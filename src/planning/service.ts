import { Competition } from '../competition';
import { Field } from '../field';
import { Game } from '../game';
import { Poule } from '../poule';
import { Referee } from '../referee';
import { Round } from '../round';
import { RoundNumber } from '../round/number';
import { PlanningReferee } from './referee';
import { PlanningResourceService } from './resource/service';

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
            if (roundNumber.hasNext()) {
                this.create(roundNumber.getNext(), startNextRound);
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
        const config = roundNumber.getValidPlanningConfig();
        if (config.getEnableTime() === false) {
            return false;
        }
        if (!roundNumber.isFirst()) {
            return this.canCalculateStartDateTime(roundNumber.getPrevious());
        }
        return true;
    }

    calculateStartDateTime(roundNumber: RoundNumber) {
        if (roundNumber.getValidPlanningConfig().getEnableTime() === false) {
            return undefined;
        }
        if (roundNumber.isFirst()) {
            return this.getStartDateTime();
        }
        const previousEndDateTime = this.calculateEndDateTime(roundNumber.getPrevious());
        const aPreviousConfig = roundNumber.getPrevious().getValidPlanningConfig();
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
        const config = roundNumber.getValidPlanningConfig();
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

    /**
     *
     * iedereen x keer elke sport( bij meerdere sporten, probeer iedereen even vaak tegen elkaar te laten spelen )
     * bij enkele sport iedereen x keer tegen elkaar
     * dus nrOfHeadtoHeadMatches hoort bij planning en geldt alleen voor enkele sport
     * nrOfGames hoort bij sportplanning
     *
     * @param roundNumber
     */
    protected createHelper(roundNumber: RoundNumber) {
        const config = roundNumber.getValidPlanningConfig();
        console.log('@TODO');
        // @TODO gamegeneratorshould take sports into account!
        // roundNumber.getPoules().forEach((poule) => {
        //     const generator = new GameGenerator(poule);
        //     const gameRounds = generator.generate(config.getTeamup());
        //     // if (poule.getPlaces().length === 8) {
        //     //     gameRounds = generator.generateBen();
        //     // }
        //     for (let headToHead = 1; headToHead <= config.getNrOfHeadtohead(); headToHead++) {
        //         const reverseHomeAway = (headToHead % 2) === 0;

        //         const headToHeadNumber = ((headToHead - 1) * gameRounds.length);
        //         gameRounds.forEach(gameRound => {
        //             let subNumber = 1;
        //             gameRound.getCombinations().forEach(combination => {
        //                 const game = new Game(poule, headToHeadNumber + gameRound.getNumber(), subNumber++);
        //                 game.setPlaces(combination.getGamePlaces(game, reverseHomeAway/*, reverseCombination*/));
        //             });
        //         });
        //     }
        // });
    }

    protected rescheduleHelper(roundNumber: RoundNumber, pStartDateTime: Date): Date {
        const dateTime = (pStartDateTime !== undefined) ? new Date(pStartDateTime.getTime()) : undefined;
        const fields = this.competition.getFields();
        const referees = this.getReferees(roundNumber);
        const nextDateTime = this.assignResourceBatchToGames(roundNumber, dateTime, fields, referees);
        if (nextDateTime !== undefined) {
            nextDateTime.setMinutes(nextDateTime.getMinutes() + roundNumber.getValidPlanningConfig().getMinutesAfter());
        }
        return nextDateTime;
    }

    protected getReferees(roundNumber: RoundNumber): PlanningReferee[] {
        if (roundNumber.getValidPlanningConfig().getSelfReferee()) {
            const places = roundNumber.getPlaces();
            return places.map(place => new PlanningReferee(undefined, place));
        }
        return this.competition.getReferees().map(referee => new PlanningReferee(referee, undefined));
    }

    protected assignResourceBatchToGames(
        roundNumber: RoundNumber,
        dateTime: Date,
        fields: Field[],
        referees: PlanningReferee[]): Date {
        const games = this.getGamesForRoundNumber(roundNumber, Game.ORDER_BYNUMBER);
        const resourceService = new PlanningResourceService(roundNumber.getValidPlanningConfig(), dateTime);
        resourceService.setBlockedPeriod(this.blockedPeriod);
        resourceService.setNrOfPoules(roundNumber.getPoules().length);
        resourceService.setFields(fields);
        resourceService.setReferees(referees);
        return resourceService.assign(games);
    }

    getGamesForRoundNumber(roundNumber: RoundNumber, order: number): Game[] {
        const rounds = roundNumber.getRounds().slice();
        if (!roundNumber.isFirst()) {
            rounds.sort((r1, r2) => r1.getStructureNumber() - r2.getStructureNumber());
        }
        let games = [];
        rounds.forEach(round => {
            const poules = round.getPoules().slice();
            if (roundNumber.isFirst()) {
                poules.sort((p1, p2) => p1.getNumber() - p2.getNumber());
            } else {
                poules.sort((p1, p2) => p2.getNumber() - p1.getNumber());
            }
            poules.forEach(poule => {
                games = games.concat(poule.getGames());
            });
        });
        return this.orderGames(games, order, roundNumber.getPlanningConfig().getEnableTime());
    }

    protected orderGames(games: Game[], order: number, enableTime: boolean): Game[] {
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
            if (enableTime) {
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

