import { Field } from '../field';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Referee } from '../referee';
import { Round } from '../round';
import { RoundConfig } from '../round/config';
import { StructureService } from '../structure/service';
import { PlanningResourceService } from './resource/service';

/**
 * Created by coen on 10-10-17.
 */
export class PlanningService {

    private allRoundsByNumber: {};
    private blockedPeriod: BlockedPeriod;

    constructor(private structureService: StructureService) {
        this.allRoundsByNumber = this.structureService.getAllRoundsByNumber();
        // looping through rounds!! in constructor planningservice, made wc possible
    }

    setBlockedPeriod(startDateTime: Date, durationInMinutes: number) {
        const endDateTime = new Date(startDateTime.getTime());
        endDateTime.setMinutes(endDateTime.getMinutes() + durationInMinutes);
        this.blockedPeriod = { start: startDateTime, end: endDateTime };
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
            this.removeNumber(roundNumber);
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

    calculateStartDateTime(roundNumber: number) {
        const aRound = this.allRoundsByNumber[roundNumber][0];
        if (aRound.getConfig().getEnableTime() === false) {
            return undefined;
        }
        if (roundNumber === 1) {
            return this.getStartDateTime();
        }
        const previousEndDateTime = this.calculateEndDateTime(roundNumber - 1);
        const aPreviousRound = this.allRoundsByNumber[roundNumber - 1][0];
        return this.addMinutes(previousEndDateTime, aPreviousRound.getConfig().getMinutesAfter());
    }

    protected addMinutes(dateTime: Date, minutes: number): Date {
        dateTime.setMinutes(dateTime.getMinutes() + minutes);
        if (this.blockedPeriod !== undefined && dateTime > this.blockedPeriod.start && dateTime < this.blockedPeriod.end) {
            dateTime = new Date(this.blockedPeriod.end.getTime());
        }
        return dateTime;
    }

    protected calculateEndDateTime(roundNumber: number) {
        const rounds = this.allRoundsByNumber[roundNumber];
        const aRound = rounds[0];
        if (aRound.getConfig().getEnableTime() === false) {
            return undefined;
        }

        let mostRecentStartDateTime;
        rounds.forEach(round => {
            round.getGames().forEach(game => {
                if (mostRecentStartDateTime === undefined || game.getStartDateTime() > mostRecentStartDateTime) {
                    mostRecentStartDateTime = game.getStartDateTime();
                }
            });
        });

        if (mostRecentStartDateTime === undefined) {
            return undefined;
        }

        const endDateTime = new Date(mostRecentStartDateTime.getTime());
        const nrOfMinutes = aRound.getConfig().getMaximalNrOfMinutesPerGame();
        endDateTime.setMinutes(endDateTime.getMinutes() + nrOfMinutes);
        return endDateTime;
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
                        const reverseHomeAway = headToHead === roundConfig.getNrOfHeadtoheadMatches() && (headToHead % 2) === 1
                            && schedGames.length > 1;
                        let subNumber = 1;
                        schedRoundGames.forEach(schedGame => {
                            if (schedGame[0] === undefined || schedGame[1] === undefined) {
                                return;
                            }
                            let homePoulePlace = (headToHead % 2 === 0) ? schedGame[1] : schedGame[0];
                            let awayPoulePlace = (headToHead % 2 === 0) ? schedGame[0] : schedGame[1];
                            if (reverseHomeAway && ((homePoulePlace.getNumber() + awayPoulePlace.getNumber()) % 2) === 0
                                && homePoulePlace.getNumber() < awayPoulePlace.getNumber()) {
                                homePoulePlace = schedGame[1];
                                awayPoulePlace = schedGame[0];
                            }
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
        const aRoundConfig: RoundConfig = rounds[0].getConfig();
        const dateTime = (pStartDateTime !== undefined) ? new Date(pStartDateTime.getTime()) : undefined;

        const fields = this.structureService.getCompetition().getFields();
        const referees = this.structureService.getCompetition().getReferees();

        const nextDateTime = this.assignResourceBatchToGames(aRoundConfig, dateTime, fields, referees);
        if (nextDateTime !== undefined) {
            nextDateTime.setMinutes(nextDateTime.getMinutes() + aRoundConfig.getMinutesAfter());
        }
        return nextDateTime;
    }

    protected getAmountPerResourceBatch(roundNumber: number, fields: Field[], referees: Referee[]): number {
        let amountPerResourceBatch;
        if (referees.length === 0) {
            amountPerResourceBatch = fields.length;
        } else if (fields.length === 0) {
            amountPerResourceBatch = referees.length;
        } else {
            amountPerResourceBatch = referees.length > fields.length ? fields.length : referees.length;
        }
        if (amountPerResourceBatch === 0) {
            const poules = this.getPoulesForRoundNumber(roundNumber);
            poules.forEach(poule => {
                amountPerResourceBatch += poule.getNrOfGamesPerRound();
            });
        }
        return amountPerResourceBatch;
    }

    protected assignResourceBatchToGames(roundConfig: RoundConfig, dateTime: Date, fields: Field[], referees: Referee[]): Date {
        const roundNumber = roundConfig.getRound().getNumber();
        const amountPerResourceBatch = this.getAmountPerResourceBatch(roundNumber, fields, referees);
        const gamesToProcess = this.getGamesForRoundNumber(roundNumber, Game.ORDER_BYNUMBER);
        const resourceService = new PlanningResourceService(
            amountPerResourceBatch, dateTime, roundConfig.getMaximalNrOfMinutesPerGame(), roundConfig.getMinutesBetweenGames());
        resourceService.setBlockedPeriod(this.blockedPeriod);
        resourceService.setFields(fields);
        resourceService.setReferees(referees);
        while (gamesToProcess.length > 0) {
            let gameToProcess = resourceService.getAssignableGame(gamesToProcess);
            if (gameToProcess === undefined) {
                resourceService.nextResourceBatch();
                gameToProcess = resourceService.getAssignableGame(gamesToProcess);
            }
            resourceService.assign(gameToProcess);
            const index = gamesToProcess.indexOf(gameToProcess);
            if (index === -1) {
                return;
            }
            gamesToProcess.splice(index, 1);
        }
        return resourceService.getEndDateTime();
    }

    protected getPoulesForRoundNumber(roundNumber: number): Poule[] {
        let poules: Poule[] = [];
        const rounds = this.allRoundsByNumber[roundNumber];
        rounds.forEach(round => {
            poules = poules.concat(round.getPoules());
        });
        return poules;
    }

    hasGames(roundNumber: number): boolean {
        const rounds = this.allRoundsByNumber[roundNumber];
        if (rounds === undefined) {
            return false;
        }
        return rounds.some(round => round.hasGames());
    }

    getGamesForRoundNumber(roundNumber: number, order: number): Game[] {
        const poules: Poule[] = this.getPoulesForRoundNumber(roundNumber);
        let games = [];
        poules.forEach(poule => {
            games = games.concat(poule.getGames());
        });
        return this.orderGames(games, order, roundNumber > 1);
    }

    orderGames(games: Game[], order: number, pouleNumberReversed: boolean = false): Game[] {
        if (order === Game.ORDER_BYNUMBER) {
            games.sort((g1, g2) => {
                if (g1.getRoundNumber() === g2.getRoundNumber()) {
                    if (g1.getSubNumber() === g2.getSubNumber()) {
                        if (pouleNumberReversed === true) {
                            return g2.getPoule().getNumber() - g1.getPoule().getNumber();
                        } else {
                            return g1.getPoule().getNumber() - g2.getPoule().getNumber();
                        }
                    }
                    return g1.getSubNumber() - g2.getSubNumber();
                }
                return g1.getRoundNumber() - g2.getRoundNumber();
            });
            return games;
        }
        games.sort((g1, g2) => {
            if (g1.getRound().getConfig().getEnableTime()) {
                if (g1.getStartDateTime().getTime() !== g2.getStartDateTime().getTime()) {
                    return g1.getStartDateTime().getTime() - g2.getStartDateTime().getTime();
                }
            } else {
                if (g1.getResourceBatch() !== g2.getResourceBatch()) {
                    return g1.getResourceBatch() - g2.getResourceBatch();
                }
            }
            // like order === Game.ORDER_BYNUMBER
            if (g1.getRoundNumber() === g2.getRoundNumber()) {
                if (g1.getSubNumber() === g2.getSubNumber()) {
                    if (pouleNumberReversed === true) {
                        return g2.getPoule().getNumber() - g1.getPoule().getNumber();
                    } else {
                        return g1.getPoule().getNumber() - g2.getPoule().getNumber();
                    }
                }
                return g1.getSubNumber() - g2.getSubNumber();
            }
            return g1.getRoundNumber() - g2.getRoundNumber();
        });
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

    protected removeNumber(roundNumber: number) {
        const rounds = this.allRoundsByNumber[roundNumber];
        rounds.forEach(round => {
            round.getPoules().forEach(poule => {
                poule.getGames().splice(0, poule.getGames().length);
            });
        });
    }

    remove(round: Round) {
        round.getPoules().forEach(poule => {
            poule.getGames().splice(0, poule.getGames().length);
        });
    }


    private generateRRSchedule(places: PoulePlace[]) {
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

        return matchups;
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

export interface BlockedPeriod {
    start: Date;
    end: Date;
}

