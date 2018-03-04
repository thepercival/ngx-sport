import { Field } from '../field';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Referee } from '../referee';
import { Round } from '../round';
import { RoundConfig } from '../round/config';
import { StructureService } from '../structure/service';
import { PlanningResourceService } from './resource/service';

export class PlanningService {

    private allRoundsByNumber: {};

    constructor(private structureService: StructureService) {
        this.allRoundsByNumber = this.structureService.getAllRoundsByNumber();
        // console.log('looping through rounds!! in constructor planningservice');
    }

    getRoundsByNumber(roundNumber: number): Round[] {
        return this.allRoundsByNumber[roundNumber];
    }

    getStartDateTime(): Date {
        return this.structureService.getFirstRound().getCompetition().getStartDateTime();
    }

    create(roundNumber: number, startDateTime?: Date) {
        if (startDateTime === undefined) {
            startDateTime = this.calculateStartDateTime(roundNumber);
        }
        try {
            this.removeHelper(roundNumber);
            this.createHelper(roundNumber);
            const startNextRound = this.rescheduleHelper(roundNumber, startDateTime);
            if (this.allRoundsByNumber[roundNumber + 1] !== undefined) {
                this.create(roundNumber + 1, startNextRound);
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    reschedule(roundNumber: number, startDateTime?: Date) {
        if (startDateTime === undefined && this.canCalculateStartDateTime(roundNumber)) {
            startDateTime = this.calculateStartDateTime(roundNumber);
        }
        try {
            const startNextRound = this.rescheduleHelper(roundNumber, startDateTime);
            if (this.allRoundsByNumber[roundNumber + 1] !== undefined) {
                this.reschedule(roundNumber + 1, startNextRound);
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    canCalculateStartDateTime(roundNumber: number) {
        const aRound = this.allRoundsByNumber[roundNumber][0];
        if (aRound.getConfig().getEnableTime() === false) {
            return false;
        }
        if (this.allRoundsByNumber[roundNumber - 1] !== undefined) {
            return this.canCalculateStartDateTime(roundNumber - 1);
        }
        return true;
    }

    isStarted(roundNumber: number) {
        const rounds = this.allRoundsByNumber[roundNumber];
        return rounds.some(round => round.isStarted());
    }

    protected calculateStartDateTime(roundNumber: number) {
        const aRound = this.allRoundsByNumber[roundNumber][0];
        if (aRound.getConfig().getEnableTime() === false) {
            return undefined;
        }
        if (roundNumber === 1) {
            return this.getStartDateTime();
        }
        return this.calculateEndDateTime(roundNumber - 1);
    }

    protected calculateEndDateTime(roundNumber: number) {
        const rounds = this.allRoundsByNumber[roundNumber];
        const aRound = rounds[0];
        if (aRound.getConfig().getEnableTime() === false) {
            return undefined;
        }

        let endDateTime;
        rounds.forEach(round => {
            round.getGames().forEach(game => {
                if (endDateTime === undefined || game.getStartDateTime() > endDateTime) {
                    endDateTime = game.getStartDateTime();
                }
            });
        });

        if (endDateTime === undefined) {
            return undefined;
        }

        const copiedEndDateTime = new Date(endDateTime.getTime());
        const nrOfMinutes = aRound.getConfig().getMaximalNrOfMinutesPerGame(true);
        copiedEndDateTime.setMinutes(copiedEndDateTime.getMinutes() + nrOfMinutes);
        return copiedEndDateTime;
    }

    protected createHelper(roundNumber: number) {
        const rounds = this.allRoundsByNumber[roundNumber];
        rounds.forEach((round) => {
            const roundConfig = round.getConfig();
            round.getPoules().forEach((poule) => {
                const schedGames = this.generateRRSchedule(poule.getPlaces().slice());
                for (let headToHead = 1; headToHead <= roundConfig.getNrOfHeadtoheadMatches(); headToHead++) {
                    const headToHeadNumber = ((headToHead - 1) * schedGames.length);
                    for (let gameRoundNumber = 0; gameRoundNumber < schedGames.length; gameRoundNumber++) {
                        const schedRoundGames = schedGames[gameRoundNumber];
                        let subNumber = 1;
                        schedRoundGames.forEach(schedGame => {
                            if (schedGame[0] === undefined || schedGame[1] === undefined) {
                                return;
                            }
                            const homePoulePlace = (headToHead % 2 === 0) ? schedGame[1] : schedGame[0];
                            const awayPoulePlace = (headToHead % 2 === 0) ? schedGame[0] : schedGame[1];
                            const gameTmp =
                                new Game(poule, homePoulePlace, awayPoulePlace, headToHeadNumber + gameRoundNumber + 1, subNumber++);
                        });
                    }
                }
            });
        });
    }

    protected rescheduleHelper(roundNumber: number, pStartDateTime: Date): Date {
        const rounds = this.allRoundsByNumber[roundNumber];
        const aRoundConfig = rounds[0].getConfig();
        const dateTime = (pStartDateTime !== undefined) ? new Date(pStartDateTime.getTime()) : undefined;

        const poules: Poule[] = this.getPoulesForRoundNumber(roundNumber);
        let fields = this.structureService.getCompetition().getFields();
        const referees = this.structureService.getCompetition().getReferees();
        if (referees.length > 0 && referees.length < fields.length) {
            fields = fields.slice(0, referees.length);
        }
        const poulesFields: PoulesFields[] = this.getPoulesFields(poules.slice(0), fields.slice(0));
        poulesFields.forEach(poulesFieldsIt => this.assignFieldsToGames(poulesFieldsIt));
        const poulesReferees: PoulesReferees[] = this.getPoulesReferees(poules.slice(0), referees.slice(0));
        poulesReferees.forEach(poulesRefereesIt => this.assignRefereesToGames(poulesRefereesIt));

        const amountPerResourceBatch = this.getAmountPerResourceBatch(fields, referees);
        return this.assignResourceBatchToGames(aRoundConfig, amountPerResourceBatch, dateTime);
    }

    protected getAmountPerResourceBatch(fields: Field[], referees: Referee[]): number {
        let amountPerResourceBatch;
        if (referees.length === 0) {
            amountPerResourceBatch = fields.length;
        } else if (fields.length === 0) {
            amountPerResourceBatch = referees.length;
        } else {
            amountPerResourceBatch = referees.length > fields.length ? fields.length : referees.length;
        }
        if (amountPerResourceBatch === 0) {
            return 1;
        }
        return amountPerResourceBatch;
    }

    protected getPoulesFields(poules: Poule[], fields: Field[]): PoulesFields[] {
        const gcd = this.greatestCommonDevisor(poules.length, fields.length);
        if (gcd === 0) {
            return [];
        }
        if (gcd === 1) {
            return [{ poules: poules, fields: fields }];
        }
        const poulesFields: PoulesFields[] = [];
        const nrOfPoulesPerPart = poules.length / gcd;
        const poulesPart: Poule[] = poules.splice(0, nrOfPoulesPerPart);
        const nrOfFieldsPerPart = fields.length / gcd;
        const fieldsPart: Field[] = fields.splice(0, nrOfFieldsPerPart);
        poulesFields.push({ poules: poulesPart, fields: fieldsPart });
        return poulesFields.concat(this.getPoulesFields(poules, fields));
    }

    protected getPoulesReferees(poules: Poule[], referees: Referee[]): PoulesReferees[] {
        const gcd = this.greatestCommonDevisor(poules.length, referees.length);
        if (gcd === 0) {
            return [];
        }
        if (gcd === 1) {
            return [{ poules: poules, referees: referees }];
        }
        const poulesReferees: PoulesReferees[] = [];
        const nrOfPoulesPerPart = poules.length / gcd;
        const poulesPart: Poule[] = poules.splice(0, nrOfPoulesPerPart);
        const nrOfFieldsPerPart = referees.length / gcd;
        const refereesPart: Referee[] = referees.splice(0, nrOfFieldsPerPart);
        poulesReferees.push({ poules: poulesPart, referees: refereesPart });
        return poulesReferees.concat(this.getPoulesReferees(poules, referees));
    }

    protected greatestCommonDevisor(a: number, b: number) {
        if (b) {
            return this.greatestCommonDevisor(b, a % b);
        } else {
            return Math.abs(a);
        }
    }

    protected assignFieldsToGames(poulesFields: PoulesFields) {
        const games = this.getPoulesGamesByNumber(poulesFields.poules, Game.ORDER_BYNUMBER);
        games.forEach(gamesPerRoundNumber => {
            let fieldNr = 0;
            let currentField = poulesFields.fields[fieldNr];
            gamesPerRoundNumber.forEach(game => {
                game.setField(currentField);
                currentField = poulesFields.fields[++fieldNr];
                if (currentField === undefined) {
                    fieldNr = 0;
                    currentField = poulesFields.fields[fieldNr];
                }
            });
        });
    }

    protected assignRefereesToGames(poulesReferees: PoulesReferees) {
        const games = this.getPoulesGamesByNumber(poulesReferees.poules, Game.ORDER_BYNUMBER);
        games.forEach(gamesPerRoundNumber => {
            let refNr = 0;
            let currentReferee = poulesReferees.referees[refNr];
            gamesPerRoundNumber.forEach(game => {
                game.setReferee(currentReferee);
                currentReferee = poulesReferees.referees[++refNr];
                if (currentReferee === undefined) {
                    refNr = 0;
                    currentReferee = poulesReferees.referees[refNr];
                }
            });
        });
    }

    protected assignResourceBatchToGames(roundConfig: RoundConfig, amountPerResourceBatch: number, dateTime?: Date): Date {
        const maximalNrOfMinutesPerGame = roundConfig.getMaximalNrOfMinutesPerGame(true);
        const games = this.getGamesByNumber(roundConfig.getRound().getNumber(), Game.ORDER_BYNUMBER);

        let resourceBatch = 1;
        games.forEach(gamesPerRoundNumber => {
            while (gamesPerRoundNumber.length > 0) {
                const resourceBatchGames = this.getResourceBatch(gamesPerRoundNumber, amountPerResourceBatch);
                resourceBatchGames.forEach(game => {
                    game.setStartDateTime(dateTime);
                    game.setResourceBatch(resourceBatch);
                    const index = gamesPerRoundNumber.indexOf(game);
                    if (index === -1) {
                        return;
                    }
                    gamesPerRoundNumber.splice(index, 1);
                });
                resourceBatch++;
                if (dateTime !== undefined) {
                    dateTime = new Date(dateTime.getTime());
                    dateTime.setMinutes(dateTime.getMinutes() + maximalNrOfMinutesPerGame);
                }
            }
        });
        return dateTime;
    }

    protected getResourceBatch(gamesPerRoundNumber: Game[], amountPerResourceBatch: number): Game[] {

        const resourceBatch: Game[] = [];
        const resourceService = new PlanningResourceService();

        gamesPerRoundNumber.forEach(game => {
            if (amountPerResourceBatch === resourceBatch.length) {
                return;
            }
            const homePoulePlace = game.getHomePoulePlace();
            const awayPoulePlace = game.getAwayPoulePlace();
            const field = game.getField();
            const referee = game.getReferee();
            if (resourceService.inUse(game)) {
                return;
            }
            resourceService.add(game);
            resourceBatch.push(game);
        });
        return resourceBatch;
    }

    protected getPoulesForRoundNumber(roundNumber: number): Poule[] {
        let poules: Poule[] = [];
        const rounds = this.allRoundsByNumber[roundNumber];
        rounds.forEach(round => {
            poules = poules.concat(round.getPoules());
        });
        return poules;
    }

    getGamesByNumber(roundNumber: number, order: number): Game[][] {
        const games = [];
        const rounds = this.allRoundsByNumber[roundNumber];
        rounds.forEach(round => {
            round.getPoules().forEach(poule => {
                poule.getGames().forEach(function (game) {
                    if (games[game.getRoundNumber()] === undefined) {
                        games[game.getRoundNumber()] = [];
                    }
                    games[game.getRoundNumber()].push(game);
                });
            });
        });
        return this.orderGames(games, order);
    }

    protected getPoulesGamesByNumber(poules: Poule[], order: number): Game[][] {
        const games = [];
        poules.forEach(poule => {
            poule.getGames().forEach(function (game) {
                if (games[game.getRoundNumber()] === undefined) {
                    games[game.getRoundNumber()] = [];
                }
                games[game.getRoundNumber()].push(game);
            });
        });
        return this.orderGames(games, order);
    }

    orderGames(games: Game[][], order: number): Game[][] {
        games.forEach(gamesPerGameRoundNumber => gamesPerGameRoundNumber.sort((g1, g2) => {
            if (order === Game.ORDER_BYNUMBER) {
                if (g1.getSubNumber() === g2.getSubNumber()) {
                    return g1.getPoule().getNumber() - g2.getPoule().getNumber();
                }
                return g1.getSubNumber() - g2.getSubNumber();
            }

            if (g1.getRound().getConfig().getEnableTime()) {
                if (g1.getStartDateTime().getTime() !== g2.getStartDateTime().getTime()) {
                    return g1.getStartDateTime().getTime() - g2.getStartDateTime().getTime();
                }
            } else {
                if (g1.getResourceBatch() !== g2.getResourceBatch()) {
                    return g1.getResourceBatch() - g2.getResourceBatch();
                }
            }
            return g1.getField().getNumber() - g2.getField().getNumber();
        })
        );
        return games;
    }

    protected getMaxNrOfGamesSimultaneously(roundNumber: number) { // misschien ook nog per gameroundnumber
        let nrOfGames = 0;
        const rounds = this.allRoundsByNumber[roundNumber];
        rounds.forEach(round => {
            round.getPoules().forEach(poule => {
                const nrOfRestingPlaces = poule.getPlaces().length % 2;
                nrOfGames += (poule.getPlaces().length - nrOfRestingPlaces) / 2;
            });
        });
        return nrOfGames;
    }

    protected removeHelper(roundNumber: number) {
        const rounds = this.allRoundsByNumber[roundNumber];
        rounds.forEach(round => {
            round.getPoules().forEach(poule => {
                poule.getGames().splice(0, poule.getGames().length);
            });
        });
    }


    private generateRRSchedule(places: PoulePlace[], rand = false) {
        let nrOfPlaces = places.length;
        if (nrOfPlaces === 0) {
            return [];
        }

        // add a placeholder if the count is odd
        if ((nrOfPlaces % 2) !== 0) {
            places.push(undefined);
            nrOfPlaces++;
        }

        // calculate the number of sets and matches per set
        const nrOfSets = nrOfPlaces - 1;
        const nrOfMatches = nrOfPlaces / 2;

        const matchups = [];

        // generate each set
        for (let j = 0; j < nrOfSets; j++) {
            matchups[j] = [];
            // break the list in half
            const halves = this.chunk(places, 2);
            // reverse the order of one half
            halves[1] = halves[1].reverse();
            // generate each match in the set
            for (let i = 0; i < nrOfMatches; i++) {
                matchups[j][i] = [];
                // match each pair of elements
                matchups[j][i][0] = halves[0][i];
                matchups[j][i][1] = halves[1][i];
            }
            // remove the first player and store
            const first = places.shift();
            // move the second player to the end of the list
            places.push(places.shift());
            // place the first item back in the first position
            places.unshift(first);
        }

        // shuffle the results if desired
        if (rand) {
            matchups.forEach((match) => {
                this.shuffle(match);
            });
            this.shuffle(matchups);
        }

        return matchups;
    }

    private shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }

    private chunk(arr: PoulePlace[], pieces: number): any[][] {
        const chunkSize = Math.round(arr.length / pieces);
        const result = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            if (result.length < pieces - 1) {
                result.push(arr.slice(i, i + chunkSize).map(a => a));
            } else {
                result.push(arr.slice(i).map(a => a));
                break;
            }
        }
        return result;
    }
}

export interface PoulesFields {
    poules: Poule[];
    fields: Field[];
}

export interface PoulesReferees {
    poules: Poule[];
    referees: Referee[];
}

