import { Competition } from '../competition';
import { Field } from '../field';
import { Game } from '../game';
import { Place } from '../place';
import { Referee } from '../referee';
import { RoundNumber } from '../round/number';
import { GameGenerator } from './gamegenerator';
import { PlanningResourceService } from './resource/service';

export class PlanningService {

    private gameGenerator: GameGenerator;
    private blockedPeriod: BlockedPeriod;

    constructor(private competition: Competition) {
        this.gameGenerator = new GameGenerator();
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
        this.removeNumber(roundNumber);
        this.gameGenerator.create(roundNumber);
        const startNextRound = this.rescheduleHelper(roundNumber, startDateTime);
        if (roundNumber.hasNext()) {
            this.create(roundNumber.getNext(), startNextRound);
        }
    }

    reschedule(roundNumber: RoundNumber, startDateTime?: Date) {
        if (startDateTime === undefined && this.canCalculateStartDateTime(roundNumber)) {
            startDateTime = this.calculateStartDateTime(roundNumber);
        }
        const startNextRound = this.rescheduleHelper(roundNumber, startDateTime);
        if (roundNumber.getNext() !== undefined) {
            this.reschedule(roundNumber.getNext(), startNextRound);
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

    calculateEndDateTime(roundNumber: RoundNumber) {
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

    protected rescheduleHelper(roundNumber: RoundNumber, pStartDateTime: Date): Date {
        const dateTime = (pStartDateTime !== undefined) ? new Date(pStartDateTime.getTime()) : undefined;
        const fields = this.competition.getFields();
        const games = this.getGamesForRoundNumber(roundNumber, Game.ORDER_BYNUMBER);
        const referees = this.competition.getReferees();
        const refereePlaces = this.getRefereePlaces(roundNumber, games);
        const nextDateTime = this.assignResourceBatchToGames(games, roundNumber, dateTime, fields, referees, refereePlaces);
        if (nextDateTime !== undefined) {
            nextDateTime.setMinutes(nextDateTime.getMinutes() + roundNumber.getValidPlanningConfig().getMinutesAfter());
        }
        return nextDateTime;
    }

    protected getRefereePlaces(roundNumber: RoundNumber, games: Game[]): Place[] {
        const nrOfPlacesToFill = roundNumber.getNrOfPlaces();
        const places = [];
        const gamesCopy = games.slice();
        while (places.length < nrOfPlacesToFill) {
            const game = gamesCopy.shift();
            game.getPlaces().map(gamePlace => gamePlace.getPlace()).forEach(place => {
                if (places.find(placeIt => place === placeIt) === undefined) {
                    places.unshift(place);
                }
            });
        }
        return places;
    }

    protected assignResourceBatchToGames(
        games: Game[],
        roundNumber: RoundNumber,
        dateTime: Date,
        fields: Field[],
        referees: Referee[],
        refereePlaces: Place[]): Date {
        const resourceService = new PlanningResourceService(roundNumber);
        resourceService.setBlockedPeriod(this.blockedPeriod);
        resourceService.setFields(fields);
        resourceService.setReferees(referees);
        resourceService.setRefereePlaces(refereePlaces);
        resourceService.assign(games, dateTime);
        return this.calculateEndDateTime(roundNumber);
    }

    getGamesForRoundNumber(roundNumber: RoundNumber, order: number): Game[] {
        const games = roundNumber.getGames();

        const orderByNumber = (g1: Game, g2: Game): number => {
            if (g1.getRoundNumber() !== g2.getRoundNumber()) {
                return g1.getRoundNumber() - g2.getRoundNumber();
            }
            if (g1.getSubNumber() !== g2.getSubNumber()) {
                return g1.getSubNumber() - g2.getSubNumber();
            }
            const poule1 = g1.getPoule();
            const poule2 = g2.getPoule();
            if (poule1.getRound() === poule2.getRound()) {
                const resultPoule = poule2.getNumber() - poule1.getNumber();
                return !roundNumber.isFirst() ? resultPoule : -resultPoule;
            }
            const resultRound = poule2.getRound().getStructureNumber() - poule1.getRound().getStructureNumber();
            return !roundNumber.isFirst() ? resultRound : -resultRound;
        };

        if (order === Game.ORDER_BYNUMBER) {
            games.sort((g1, g2) => {
                return orderByNumber(g1, g2);
            });
        } else {
            const enableTime = roundNumber.getValidPlanningConfig().getEnableTime();
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
                return orderByNumber(g1, g2);
            });
        }
        return games;
    }

    protected removeNumber(roundNumber: RoundNumber) {
        const rounds = roundNumber.getRounds();
        rounds.forEach(round => {
            round.getPoules().forEach(poule => {
                poule.getGames().splice(0, poule.getGames().length);
            });
        });
    }
}

export interface BlockedPeriod {
    start: Date;
    end: Date;
}
