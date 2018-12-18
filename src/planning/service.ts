import { Competition } from '../competition';
import { Field } from '../field';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Referee } from '../referee';
import { Round } from '../round';
import { RoundNumber } from '../round/number';
import { RoundNumberConfig } from '../round/number/config';
import { PlanningResourceService } from './resource/service';

/**
 * Created by coen on 10-10-17.
 */
export class PlanningService {

    private blockedPeriod: BlockedPeriod;

    constructor(private competition: Competition) {
    }

    setBlockedPeriod(startDateTime: Date, durationInMinutes: number) {
        const endDateTime = new Date(startDateTime.getTime());
        endDateTime.setMinutes(endDateTime.getMinutes() + durationInMinutes);
        this.blockedPeriod = { start: startDateTime, end: endDateTime };
    }

    getStartDateTime(): Date {
        return this.competition.getStartDateTime();
    }

    create(roundNumber: RoundNumber, startDateTime?: Date) {
        if (startDateTime === undefined) {
            startDateTime = this.calculateStartDateTime(roundNumber);
        }
        try {
            this.removeNumber(roundNumber);
            this.createHelper(roundNumber);
            const startNextRound = this.rescheduleHelper(roundNumber, startDateTime);
            const nextRoundNumber = roundNumber.getNext();
            if (nextRoundNumber !== undefined) {
                this.create(nextRoundNumber, startNextRound);
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    reschedule(roundNumber: RoundNumber, startDateTime?: Date) {
        if (startDateTime === undefined && this.canCalculateStartDateTime(roundNumber)) {
            startDateTime = this.calculateStartDateTime(roundNumber);
        }
        try {
            const startNextRound = this.rescheduleHelper(roundNumber, startDateTime);
            if (roundNumber.getNext() !== undefined) {
                this.reschedule(roundNumber.getNext(), startNextRound);
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    canCalculateStartDateTime(roundNumber: RoundNumber) {
        const config = roundNumber.getConfig();
        if (config.getEnableTime() === false) {
            return false;
        }
        if (!roundNumber.isFirst()) {
            return this.canCalculateStartDateTime(roundNumber.getPrevious());
        }
        return true;
    }

    isStarted(roundNumber: RoundNumber) {
        return roundNumber.getRounds().some(round => round.isStarted());
    }

    calculateStartDateTime(roundNumber: RoundNumber) {
        if (roundNumber.getConfig().getEnableTime() === false) {
            return undefined;
        }
        if (roundNumber.isFirst()) {
            return this.getStartDateTime();
        }
        const previousEndDateTime = this.calculateEndDateTime(roundNumber.getPrevious());
        const aPreviousConfig = roundNumber.getPrevious().getConfig();
        return this.addMinutes(previousEndDateTime, aPreviousConfig.getMinutesAfter());
    }

    protected addMinutes(dateTime: Date, minutes: number): Date {
        dateTime.setMinutes(dateTime.getMinutes() + minutes);
        if (this.blockedPeriod !== undefined && dateTime > this.blockedPeriod.start && dateTime < this.blockedPeriod.end) {
            dateTime = new Date(this.blockedPeriod.end.getTime());
        }
        return dateTime;
    }

    protected calculateEndDateTime(roundNumber: RoundNumber) {
        const config = roundNumber.getConfig();
        if (config.getEnableTime() === false) {
            return undefined;
        }

        let mostRecentStartDateTime;
        roundNumber.getRounds().forEach(round => {
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
        const nrOfMinutes = config.getMaximalNrOfMinutesPerGame();
        endDateTime.setMinutes(endDateTime.getMinutes() + nrOfMinutes);
        return endDateTime;
    }

    protected createHelper(roundNumber: RoundNumber) {
        const roundNumberConfig = roundNumber.getConfig();
        this.getPoulesForRoundNumber(roundNumber).forEach((poule) => {
            const schedGames = this.generateRRSchedule(poule.getPlaces().slice());
            for (let headToHead = 1; headToHead <= roundNumberConfig.getNrOfHeadtoheadMatches(); headToHead++) {
                const headToHeadNumber = ((headToHead - 1) * schedGames.length);
                for (let gameRoundNumber = 0; gameRoundNumber < schedGames.length; gameRoundNumber++) {
                    const schedRoundGames = schedGames[gameRoundNumber];
                    const reverseHomeAway = headToHead === roundNumberConfig.getNrOfHeadtoheadMatches() && (headToHead % 2) === 1
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
    }

    protected rescheduleHelper(roundNumber: RoundNumber, pStartDateTime: Date): Date {
        const dateTime = (pStartDateTime !== undefined) ? new Date(pStartDateTime.getTime()) : undefined;
        const fields = this.competition.getFields();
        const referees = this.competition.getReferees();
        const nextDateTime = this.assignResourceBatchToGames(roundNumber, roundNumber.getConfig(), dateTime, fields, referees);
        if (nextDateTime !== undefined) {
            nextDateTime.setMinutes(nextDateTime.getMinutes() + roundNumber.getConfig().getMinutesAfter());
        }
        return nextDateTime;
    }

    protected getAmountPerResourceBatch(roundNumber: RoundNumber, fields: Field[], referees: Referee[]): number {
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

    protected assignResourceBatchToGames(roundNumber: RoundNumber, roundNumberConfig: RoundNumberConfig
        , dateTime: Date, fields: Field[], referees: Referee[]): Date {
        const amountPerResourceBatch = this.getAmountPerResourceBatch(roundNumber, fields, referees);
        const gamesToProcess = this.getGamesForRoundNumber(roundNumber, Game.ORDER_BYNUMBER);
        const resourceService = new PlanningResourceService(
            amountPerResourceBatch, dateTime, roundNumberConfig.getMaximalNrOfMinutesPerGame(), roundNumberConfig.getMinutesBetweenGames());
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

    protected getPoulesForRoundNumber(roundNumber: RoundNumber): Poule[] {
        let poules: Poule[] = [];
        roundNumber.getRounds().forEach(round => {
            poules = poules.concat(round.getPoules());
        });
        return poules;
    }

    getGamesForRoundNumber(roundNumber: RoundNumber, order: number): Game[] {

        const rounds = roundNumber.getRounds().slice();
        if ( !roundNumber.isFirst() ) {
            rounds.sort((r1, r2) => this.getRoundPathAsNumber(r1) - this.getRoundPathAsNumber(r2) );
        }

        let games = [];
        rounds.forEach( round => {
            const poules = round.getPoules().slice();
            if ( roundNumber.isFirst() ) {
                poules.sort((p1, p2) => p1.getNumber() - p2.getNumber() );
            } else {
                poules.sort((p1, p2) => p2.getNumber() - p1.getNumber() );
            }
            poules.forEach(poule => {
                games = games.concat(poule.getGames());
            });
        });
        return this.orderGames(games, order);
    }

    protected getRoundPathAsNumber( round: Round ): number {
        let value = 0;
        const path = round.getPath();
        let pow = path.length;
        path.forEach( winnersOrLosers => {
            value += winnersOrLosers === Round.WINNERS ? Math.pow( 2, pow ) : 0;
            pow--;
        });
        return value;
    }

    protected orderGames(games: Game[], order: number): Game[] {
        if (order === Game.ORDER_BYNUMBER) {
            games.sort((g1, g2) => {
                if (g1.getRoundNumber() === g2.getRoundNumber()) {
                    return g1.getSubNumber() - g2.getSubNumber();
                }
                return g1.getRoundNumber() - g2.getRoundNumber();
            });
            return games;
        }
        games.sort((g1, g2) => {
            if (g1.getConfig().getEnableTime()) {
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
                    return g1.getPoule().getNumber() - g2.getPoule().getNumber();
                }
                return g1.getSubNumber() - g2.getSubNumber();
            }
            return g1.getRoundNumber() - g2.getRoundNumber();
        });
        return games;
    }

    protected getMaxNrOfGamesSimultaneously(roundNumber: RoundNumber) { // misschien ook nog per gameroundnumber
        let nrOfGames = 0;
        const rounds = roundNumber.getRounds();
        rounds.forEach(round => {
            round.getPoules().forEach(poule => {
                const nrOfRestingPlaces = poule.getPlaces().length % 2;
                nrOfGames += (poule.getPlaces().length - nrOfRestingPlaces) / 2;
            });
        });
        return nrOfGames;
    }

    protected removeNumber(roundNumber: RoundNumber) {
        const rounds = roundNumber.getRounds();
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

