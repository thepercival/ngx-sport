import { Field } from '../../field';
import { Game } from '../../game';
import { NameService } from '../../nameservice';
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
        if (!this.assignBatch(games.slice(), this.getMaxNrOfGamesPerBatch())) {
            throw Error('cannot assign resources');
        }
        return this.getEndDateTime();
    }

    assignBatch(games: Game[], nrOfGamesPerBatch: number): boolean {
        if (nrOfGamesPerBatch === 0) {
            return false;
        }
        const resources = { fields: this.fields.slice() };
        if (this.assignBatchHelper(games.slice(), resources, nrOfGamesPerBatch, new PlanningResourceBatch(1)) === true) {
            return true;
        }
        return this.assignBatch(games, nrOfGamesPerBatch - 1);
    }

    protected assignBatchHelper(games: Game[], resources: Resources, nrOfGames: number, batch: PlanningResourceBatch
        , assignedBatches: PlanningResourceBatch[] = [], nrOfGamesTried: number = 0, iteration: number = 0): boolean {

        if (batch.getGames().length === nrOfGames || games.length === 0) { // batchsuccess
            const nextBatch = this.toNextBatch(batch, assignedBatches, resources);
            // if (batch.getNumber() < 4) {
            // console.log('batch succes: ' + batch.getNumber() + ' it(' + iteration + ')');
            // assignedBatches.forEach(batchTmp => this.consoleGames(batchTmp.getGames()));
            // console.log('-------------------');
            // }
            if (games.length === 0) { // endsuccess
                return true;
            }
            return this.assignBatchHelper(games, resources, nrOfGames, nextBatch, assignedBatches, 0, iteration++);
        }
        if (games.length === nrOfGamesTried) {
            // this.releaseBatch(batch);
            batch = new PlanningResourceBatch(batch.getNumber());
            return false;
        }
        const game = games.shift();
        // console.log('trying   game .. ' + this.consoleGame(game) + ' => ' +
        // (this.isGameAssignable(batch, game, resources) ? 'success' : 'fail'));
        if (this.isGameAssignable(batch, game, resources)) {
            this.assignGame(batch, game, resources);
            // console.log('assigned game .. ' + this.consoleGame(game));
            const resourcesTmp = { fields: resources.fields.slice() };
            if (this.assignBatchHelper(games.slice(), resourcesTmp, nrOfGames, batch, assignedBatches.slice(), 0, iteration++) === true) {
                return true;
            }
            this.releaseGame(batch, game, resources);
        }
        games.push(game);
        return this.assignBatchHelper(games, resources, nrOfGames, batch, assignedBatches, ++nrOfGamesTried, iteration++);
    }

    protected assignGame(batch: PlanningResourceBatch, game: Game, resources: Resources) {
        this.assignField(game, resources);
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

    protected releaseGame(batch: PlanningResourceBatch, game: Game, resources: Resources) {
        batch.remove(game);
        this.releaseSport(game, game.getField().getSport());
        this.releaseField(game, resources);
        this.releaseReferee(game);
        if (game.getRefereePlace()) {
            this.releaseRefereePlaces(game);
        }
    }

    protected releaseBatch(batch: PlanningResourceBatch, resources: Resources) {
        while (batch.getGames().length > 0) {
            this.releaseGame(batch, batch.getGames()[0], resources);
        }
    }

    protected toNextBatch(batch: PlanningResourceBatch, assignedBatches: PlanningResourceBatch[]
        , resources: Resources): PlanningResourceBatch {
        batch.getGames().forEach(game => {
            game.setStartDateTime(this.cloneDateTime(this.currentGameStartDate));
            game.setResourceBatch(batch.getNumber());
            resources.fields.push(game.getField());
            if (game.getRefereePlace()) {
                this.refereePlaces.push(game.getRefereePlace());
            }
            if (game.getReferee()) {
                this.referees.push(game.getReferee());
            }
        });
        this.setNextGameStartDateTime();
        assignedBatches.push(batch);
        return new PlanningResourceBatch(batch.getNumber() + 1);
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

    private isGameAssignable(batch: PlanningResourceBatch, game: Game, resources: Resources): boolean {
        if (!this.isSomeFieldAssignable(game, resources)) {
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

    private isSomeFieldAssignable(game: Game, resources: Resources): boolean {
        return resources.fields.some(fieldIt => {
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

    private releaseField(game: Game, resources: Resources) {
        resources.fields.unshift(game.getField());
        game.setField(undefined);
    }

    private assignField(game: Game, resources: Resources) {
        const field = resources.fields.find(fieldIt => {
            return this.isSportAssignable(game, fieldIt.getSport());
        });
        if (field) {
            game.setField(resources.fields.splice(resources.fields.indexOf(field), 1).pop());
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

    /**
     * @TODO REMOVE
     */
    private consoleGames(games: Game[]) {
        games.forEach(game => console.log(this.consoleGame(game)));
    }

    /**
     * @TODO REMOVE
     */
    private consoleGame(game: Game): string {
        const nameService = new NameService();
        return 'poule ' + game.getPoule().getNumber()
            + ', ' + nameService.getPlacesFromName(game.getPlaces(Game.HOME), false, false)
            + ' vs ' + nameService.getPlacesFromName(game.getPlaces(Game.AWAY), false, false)
            + ' , ref ' + (game.getRefereePlace() ? nameService.getPlaceFromName(game.getRefereePlace(), false, false) : '')
            + ', batch ' + (game.getResourceBatch() ? game.getResourceBatch() : '?')
            + ', field ' + (game.getField() ? game.getField().getNumber() : '?')
            + ', sport ' + (game.getField() ? game.getField().getSport().getName() +
             (game.getField().getSport().getCustomId() ? '(' + game.getField().getSport().getCustomId() + ')' : '') : '?')
            ;
    }
}

interface LocationIdToSportCounterMap {
    [locationId: string]: SportCounter;
}

interface Resources {
    fields: Field[];
}
