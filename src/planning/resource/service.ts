import { Field } from '../../field';
import { Game } from '../../game';
import { Place } from '../../place';
import { Referee } from '../../referee';
import { RoundNumber } from '../../round/number';
import { Sport } from '../../sport';
import { SportCounter } from '../../sport/counter';
import { SportPlanningConfigService } from '../../sport/planningconfig/service';
import { PlanningConfig } from '../config';
import { BlockedPeriod } from '../service';
import { PlanningResourceBatch } from './batch';

export class PlanningResourceService {
    private referees: Referee[];
    private refereePlaces: Place[];
    private areRefereesEnabled = false;
    private fields: Field[] = [];
    private planningConfig: PlanningConfig;

    private blockedPeriod;
    private currentGameStartDate: Date;
    private nrOfPoules: number;
    private maxNrOfGamesPerBatch: number;

    private placesSportsCounter: LocationIdToSportCounterMap;

    constructor(
        private roundNumber: RoundNumber,
        dateTime: Date
    ) {
        this.currentGameStartDate = this.cloneDateTime(dateTime);
        this.planningConfig = this.roundNumber.getValidPlanningConfig();
        this.nrOfPoules = this.roundNumber.getPoules().length;
    }

    setBlockedPeriod(blockedPeriod: BlockedPeriod) {
        this.blockedPeriod = blockedPeriod;
    }

    setFields(fields: Field[]) {
        this.fields = fields.slice();
    }

    setReferees(referees: Referee[]) {
        this.areRefereesEnabled = referees.length > 0;
        this.referees = referees.slice();
    }

    refereesEnabled(): boolean {
        return this.referees.length > 0;
    }

    setRefereePlaces(places: Place[]) {
        this.refereePlaces = places;
    }

    // het minimale aantal wedstrijden per sport moet je weten
    // per plaats bijhouden: het aantal wedstrijden voor elke sport
    // per plaats bijhouden: als alle sporten klaar
    protected initSportsCounter() {
        const sportPlanningConfigService = new SportPlanningConfigService();
        const sportPlanningConfigs = sportPlanningConfigService.getUsed(this.roundNumber);

        this.placesSportsCounter = {};
        this.roundNumber.getPoules().forEach(poule => {
            const minNrOfGamesMap = sportPlanningConfigService.getMinNrOfGamesMap(poule, sportPlanningConfigs);
            poule.getPlaces().forEach((place: Place) => {
                this.placesSportsCounter[place.getLocationId()] = new SportCounter(minNrOfGamesMap, sportPlanningConfigs);
            });
        });
    }

    assign(games: Game[]): Date {
        this.initSportsCounter();
        let batchNr = 1;
        while (games.length > 0) {
            let nrOfGamesPerBatch = this.getMaxNrOfGamesPerBatch();
            let batch = new PlanningResourceBatch();
            while (!this.assignBatch(games.slice(), nrOfGamesPerBatch, batch)) {
                nrOfGamesPerBatch--;
                this.rollbackBatch(batch);
                batch = new PlanningResourceBatch();
            }
            this.toNextBatch(batch, games, batchNr++);
        }
        return this.getEndDateTime();
    }

    // maybe use this function as seconds parameter of assignBatch
    // protected isBatchCompleted( batch: PlanningResourceBatch, nrOfGames: number ): boolean {
    //     return batch.getGames().length === nrOfGames;
    // }

    protected assignBatch(games: Game[], nrOfGames: number, batch: PlanningResourceBatch): boolean {
        if (batch.getGames().length === nrOfGames) { // endsuccess
            return true;
        }
        if (games.length === 0) {
            return false;
        }
        const game = games.shift();
        if (this.isGameAssignable(batch, game)) {
            this.assignGame(batch, game);
            if (this.assignBatch(games.slice(), nrOfGames, batch) === true) {
                return true;
            }
            this.releaseGame(batch, game);

            return this.assignBatch(games, nrOfGames, batch);
        }
        return this.assignBatch(games, nrOfGames, batch);
    }

    protected assignGame(batch: PlanningResourceBatch, game: Game) {
        this.assignField(game);
        if (!this.planningConfig.getSelfReferee()) {
            if (this.referees.length > 0) {
                this.assignReferee(game);
            }
        } else {
            this.assignRefereePlace(batch, game);
        }
        batch.add(game);
        this.assignSport(game, game.getField().getSport());
    }

    protected releaseGame(batch: PlanningResourceBatch, game: Game) {
        batch.remove(game);
        this.releaseSport(game, game.getField().getSport());
        this.releaseField(game);
        this.releaseReferee(game);
        if (game.getRefereePlace()) {
            this.releaseRefereePlaces(game);
        }
    }

    protected rollbackBatch(batch: PlanningResourceBatch) {
        while (batch.getGames().length > 0) {
            this.releaseGame(batch, batch.getGames()[0]);
        }
    }

    protected toNextBatch(batch: PlanningResourceBatch, games: Game[], batchNr: number) {
        const batchGames = batch.getGames();
        while (batchGames.length > 0) {
            const game = batchGames.shift();
            game.setStartDateTime(this.cloneDateTime(this.currentGameStartDate));
            game.setResourceBatch(batchNr);
            this.fields.push(game.getField());
            if (game.getRefereePlace()) {
                this.refereePlaces.push(game.getRefereePlace());
            }
            if (game.getReferee()) {
                this.referees.push(game.getReferee());
            }
            games.splice(games.indexOf(game), 1);
        }
        this.setNextGameStartDateTime();
    }

    /*protected shouldGoToNextBatch(batch: PlanningResourceBatch): boolean {
        if (this.config.getSelfReferee() && this.nrOfPoules > 1 && batch.getNrOfPoules() === this.nrOfPoules) {
            return true;
        }
        if (!this.isSomeFieldAssignable()) {
            return true;
        }
        if (!this.isSomeRefereeAssignable(batch)) {
            return true;
        }
        let minNrNeeded = this.config.getNrOfGamePlaces();
        minNrNeeded += this.config.getSelfReferee() ? 1 : 0;
        return batch.getNrOfPlaces() + minNrNeeded > this.nrOfPlaces;
    }*/

    private isGameAssignable(batch: PlanningResourceBatch, game: Game): boolean {
        if (!this.isSomeFieldAssignable(game)) {
            return false;
        }
        if (!this.isSomeRefereeAssignable(batch, game)) {
            return false;
        }
        return this.areAllPlacesAssignable(batch, game);

    }

    /**
     * de wedstrijd is assignbaar als 
     * 1 alle plekken, van een wedstrijd, nog niet in de batch
     * 2 alle plekken, van een wedstrijd, de sport nog niet vaak genoeg gedaan heeft of alle sporten al gedaan
     * 
     * @param batch 
     * @param game 
     */
    private areAllPlacesAssignable(batch: PlanningResourceBatch, game: Game): boolean {
        return this.getPlaces(game).every(place => {
            return !batch.hasPlace(place);
            // moved to isFieldAssignable
            // const sportCounter = this.placesSportsCounter[place.getLocationId()];
            // return (!sportCounter.isSportDone(sport) || sportCounter.isDone());
        });
    }

    private assignSport(game: Game, sport: Sport) {
        this.getPlaces(game).forEach(placeIt => {
            this.placesSportsCounter[placeIt.getLocationId()].addGame(sport);
        });
    }

    private releaseSport(game: Game, sport: Sport) {
        this.getPlaces(game).forEach(placeIt => {
            this.placesSportsCounter[placeIt.getLocationId()].removeGame(sport);
        });
    }

    private isSomeFieldAssignable(game: Game): boolean {
        return this.fields.some(fieldIt => {
            return this.isSportAssignable(game, fieldIt.getSport());
        });
    }

    private isSomeRefereeAssignable(batch: PlanningResourceBatch, game?: Game): boolean {
        if (!this.planningConfig.getSelfReferee()) {
            if (!this.areRefereesEnabled) {
                return true;
            }
            return this.referees.length > 0;
        }
        if (game === undefined) {
            return this.refereePlaces.length > 0;
        }

        return this.refereePlaces.some(refereePlaceIt => {
            if (game.isParticipating(refereePlaceIt) || batch.isParticipating(refereePlaceIt)) {
                return false;
            }
            if (this.nrOfPoules === 1) {
                return true;
            }
            return refereePlaceIt.getPoule() !== game.getPoule();
        });
    }

    private releaseField(game: Game) {
        this.fields.unshift(game.getField());
        game.setField(undefined);
    }

    private assignField(game: Game) {
        const field = this.fields.find(fieldIt => {
            return this.isSportAssignable(game, fieldIt.getSport());
        });
        if (field) {
            game.setField(this.fields.splice(this.fields.indexOf(field), 1).pop());
        }
    }

    private isSportAssignable(game: Game, sport: Sport): boolean {
        return this.getPlaces(game).every(place => {
            const sportCounter = this.placesSportsCounter[place.getLocationId()];
            return (!sportCounter.isSportDone(sport) || sportCounter.isDone());
        });
    }

    private assignReferee(game: Game) {
        game.setReferee(this.referees.shift());
    }

    private releaseReferee(game: Game) {
        if (game.getReferee() === undefined) {
            return;
        }
        this.referees.unshift(game.getReferee());
        game.setReferee(undefined);
    }

    private assignRefereePlace(batch: PlanningResourceBatch, game: Game) {
        const refereePlace = this.refereePlaces.find(refereePlaceIt => {
            if (game.isParticipating(refereePlaceIt) || batch.isParticipating(refereePlaceIt)) {
                return false;
            }
            if (this.nrOfPoules === 1) {
                return true;
            }
            return refereePlaceIt.getPoule() !== game.getPoule();
        });
        if (refereePlace) {
            game.setRefereePlace(this.refereePlaces.splice(this.refereePlaces.indexOf(refereePlace), 1).pop());
        }
    }

    private releaseRefereePlaces(game: Game) {
        this.refereePlaces.unshift(game.getRefereePlace());
        game.setRefereePlace(undefined);
    }

    protected getPlaces(game: Game): Place[] {
        return game.getPlaces().map(gamePlace => gamePlace.getPlace());
    }

    protected getMaxNrOfGamesPerBatch(): number {
        if (this.maxNrOfGamesPerBatch !== undefined) {
            return this.maxNrOfGamesPerBatch;
        }
        this.maxNrOfGamesPerBatch = this.fields.length;

        if (!this.planningConfig.getSelfReferee() && this.referees.length > 0 && this.referees.length < this.maxNrOfGamesPerBatch) {
            this.maxNrOfGamesPerBatch = this.referees.length;
        }

        let nrOfGamePlaces = Sport.TEMPDEFAULT;
        if (this.planningConfig.getTeamup()) {
            nrOfGamePlaces *= 2;
        }
        if (this.planningConfig.getSelfReferee()) {
            nrOfGamePlaces++;
        }
        const nrOfGamesSimultaneously = Math.ceil(this.roundNumber.getNrOfPlaces() / nrOfGamePlaces);
        if (nrOfGamesSimultaneously < this.maxNrOfGamesPerBatch) {
            this.maxNrOfGamesPerBatch = nrOfGamesSimultaneously;
        }
        return this.maxNrOfGamesPerBatch;
    }

    /* time functions */

    private getEndDateTime(): Date {
        if (this.currentGameStartDate === undefined) {
            return undefined;
        }
        const endDateTime = new Date(this.currentGameStartDate.getTime());
        endDateTime.setMinutes(endDateTime.getMinutes() + this.planningConfig.getMaximalNrOfMinutesPerGame());
        return endDateTime;
    }

    private cloneDateTime(dateTime: Date): Date {
        if (dateTime === undefined) {
            return undefined;
        }
        return new Date(dateTime.getTime());
    }

    private setNextGameStartDateTime() {
        if (this.currentGameStartDate === undefined) {
            return;
        }
        const add = this.planningConfig.getMaximalNrOfMinutesPerGame() + this.planningConfig.getMinutesBetweenGames();
        this.currentGameStartDate = this.addMinutes(this.currentGameStartDate, add);
    }

    protected addMinutes(dateTime: Date, minutes: number): Date {
        dateTime.setMinutes(dateTime.getMinutes() + minutes);
        if (this.blockedPeriod === undefined) {
            return dateTime;
        }
        const endDateTime = this.cloneDateTime(dateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + this.planningConfig.getMaximalNrOfMinutesPerGame());
        if (endDateTime > this.blockedPeriod.start && dateTime < this.blockedPeriod.end) {
            dateTime = new Date(this.blockedPeriod.end.getTime());
        }
        return dateTime;
    }
}

interface LocationIdToSportCounterMap {
    [locationId: string]: SportCounter;
}
