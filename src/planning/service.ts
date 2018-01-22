import { Game } from '../game';
import { PoulePlace } from '../pouleplace';
import { Round } from '../round';
import { StructureService } from '../structure/service';
import { catchError } from 'rxjs/operators/catchError';

export class PlanningService {

    private allRoundsByNumber: {};

    constructor(private structureService: StructureService) {
        this.allRoundsByNumber = this.structureService.getAllRoundsByNumber();
    }

    getStartDateTime(): Date {
        return this.structureService.getFirstRound().getCompetitionseason().getStartDateTime();
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

        let dateTime = (pStartDateTime !== undefined) ? new Date(pStartDateTime.getTime()) : undefined;
        const fields = this.structureService.getCompetitionseason().getFields(); // order by number
        const maxNrOfGamesSimultaneously = this.getMaxNrOfGamesSimultaneously(roundNumber);
        const tooMuchFieldsAvailable = fields.length > maxNrOfGamesSimultaneously;
        const referees = this.structureService.getCompetitionseason().getReferees();

        let nrOfGamesSimultaneously = 0;
        let fieldNr = 0;
        let currentField = fields[fieldNr];
        let refereeNr = 0;
        let currentReferee = referees[refereeNr];
        let nextRoundStartDateTime: Date;
        const games = this.getGamesByNumber(roundNumber);
        games.forEach(function (gamesPerRoundNumber) {
            gamesPerRoundNumber.forEach((game) => {
                game.setField(currentField);
                game.setStartDateTime(dateTime);
                game.setReferee(currentReferee);
                let addTime = false;
                currentField = fields[++fieldNr];
                if (currentField === undefined) {
                    fieldNr = 0;
                    currentField = fields[fieldNr];
                    addTime = true;
                }
                currentReferee = referees[++refereeNr];
                if (referees.length > 0 && currentReferee === undefined) {
                    refereeNr = 0;
                    currentReferee = referees[refereeNr];
                    addTime = true;
                }
                if (++nrOfGamesSimultaneously === maxNrOfGamesSimultaneously) {
                    addTime = true;
                    nrOfGamesSimultaneously = 0;
                }
                if (aRoundConfig.getEnableTime() && dateTime && addTime) {
                    const nrOfMinutes = aRoundConfig.getMaximalNrOfMinutesPerGame(true);
                    dateTime = new Date(dateTime.getTime());
                    dateTime.setMinutes(dateTime.getMinutes() + nrOfMinutes);
                    if (nextRoundStartDateTime === undefined || dateTime > nextRoundStartDateTime) {
                        nextRoundStartDateTime = dateTime;
                        nrOfGamesSimultaneously = 0;
                    }
                }
            });
        }, this);
        return nextRoundStartDateTime;
    }

    protected getGamesByNumber(roundNumber: number): Game[][] {
        const games = [];
        const rounds = this.allRoundsByNumber[roundNumber];
        rounds.forEach(round => {
            round.getPoules().forEach(poule => {
                let number = 1;
                poule.getGames().forEach(function (game) {
                    if (games[number] === undefined) {
                        games[number] = [];
                    }
                    games[number++].push(game);
                });
            });
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
