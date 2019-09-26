import { Field } from '../../field';
import { Game } from '../../game';
import { NameService } from '../../nameservice';
import { Place } from '../../place';
import { Referee } from '../../referee';
import { RoundNumber } from '../../round/number';
import { Sport } from '../../sport';
import { PlanningPlace } from '../place';
import { SportPlanningConfigService } from '../../sport/planningconfig/service';
import { PlanningConfig } from '../config';
import { BlockedPeriod } from '../service';
import { PlanningResourceBatch } from './batch';
import { SportCounter } from '../../sport/counter';

export class PlanningResourceService {
    private referees: Referee[];
    private refereePlaces: Place[];
    private areRefereesEnabled = false;
    private fields: Field[] = [];
    private planningConfig: PlanningConfig;

    private blockedPeriod;
    private nrOfPoules: number;
    private maxNrOfGamesPerBatch: number;
    private maxNrOfGamesInARow: number;
    private multipleSports: boolean;

    private planningPlaces: PlanningPlaceMap;

    constructor(
        private roundNumber: RoundNumber
    ) {
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
    protected initPlanningPlaces() {
        const sportPlanningConfigService = new SportPlanningConfigService();
        const sportPlanningConfigs = this.roundNumber.getSportPlanningConfigs();
        this.multipleSports = sportPlanningConfigs.length > 1;
        this.planningPlaces = {};
        this.roundNumber.getPoules().forEach(poule => {
            const nrOfHeadtohead = sportPlanningConfigService.getSufficientNrOfHeadtohead(poule);
            const nrOfGamesToGo = sportPlanningConfigService.getNrOfGamesPerPlace(poule, nrOfHeadtohead);
            const minNrOfGamesMap = sportPlanningConfigService.getPlanningMinNrOfGamesMap(poule);
            poule.getPlaces().forEach((place: Place) => {
                const sportCounter = new SportCounter(nrOfGamesToGo, minNrOfGamesMap, sportPlanningConfigs);
                this.planningPlaces[place.getLocationId()] = new PlanningPlace(sportCounter);
            });
        });
    }

    assign(games: Game[], startDateTime: Date) {
        this.initPlanningPlaces();
        const resources = { dateTime: this.cloneDateTime(startDateTime), fields: this.fields.slice() };
        if (!this.assignBatch(games.slice(), resources, this.getMaxNrOfGamesPerBatch())) {
            throw Error('cannot assign resources');
        }
    }

    assignBatch(games: Game[], resources: Resources, nrOfGamesPerBatch: number): boolean {
        if (nrOfGamesPerBatch === 0) {
            return false;
        }
        this.setMaxNrOfGamesInARow(nrOfGamesPerBatch);
        if (this.assignBatchHelper(games.slice(), resources, nrOfGamesPerBatch, new PlanningResourceBatch()) === true) {
            return true;
        }
        return this.assignBatch(games,
            { dateTime: this.cloneDateTime(resources.dateTime), fields: this.fields.slice() },
            nrOfGamesPerBatch - 1);
    }

    protected assignBatchHelper(games: Game[], resources: Resources, nrOfGames: number, batch: PlanningResourceBatch
        , nrOfGamesTried: number = 0): boolean {

        if (batch.getGames().length === nrOfGames || games.length === 0) { // batchsuccess
            const nextBatch = this.toNextBatch(batch, resources);
            if (games.length === 0) { // endsuccess
                // console.log('------batch ' + batch.getNumber() +
                //     ' succes assigned batches (games per batch(' + nrOfGames + ' )-------------');
                // this.consoleBatch(batch);
                return true;
            }
            // if (batch.getNumber() === 6) {
            //     console.log('------batch succes pre sort: ' + batch.getNumber() + ' -------------');
            //     this.consoleGames(games);
            // }
            // this.sortGamesByInARow(games, assignedBatches);
            // if (batch.getNumber() === 6) {
            //     console.log('------batch succes post sort: ' + batch.getNumber() + ' -------------');
            //     this.consoleGames(games);
            // }
            // if (batch.getNumber() === 5) {
            console.log('------batch ' + batch.getNumber() +
                ' succes assigned batches (games per batch(' + nrOfGames + ' )-------------');
            this.consoleBatch(batch);
            // }

            return this.assignBatchHelper(games, resources, nrOfGames, nextBatch);
        }
        if (games.length === nrOfGamesTried) {
            return false;
        }
        const game = games.shift();
        if (this.isGameAssignable(batch, game, resources)) {
            this.assignGame(batch, game, resources);
            if (batch.getGames().length === nrOfGames) {
                const resourcesNext = { dateTime: this.cloneDateTime(resources.dateTime), fields: resources.fields.slice() };
                if (this.assignBatchHelper(games.slice(), resourcesNext, nrOfGames, batch)) {
                    return true;
                }
            } else { // try fields
                let nrOfFieldsTried = 0;
                while (nrOfFieldsTried++ < resources.fields.length) {
                    const resourcesTmp = { dateTime: this.cloneDateTime(resources.dateTime), fields: resources.fields.slice() };
                    if (this.assignBatchHelper(games.slice(), resourcesTmp, nrOfGames, batch)) {
                        return true;
                    }
                    resources.fields.push(resources.fields.shift());
                }
            }
            this.releaseGame(batch, game, resources);
        }
        games.push(game);
        return this.assignBatchHelper(games, resources, nrOfGames, batch, ++nrOfGamesTried);
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

    /*protected releaseBatch(batch: PlanningResourceBatch, resources: Resources) {
        while (batch.getGames().length > 0) {
            this.releaseGame(batch, batch.getGames()[0], resources);
        }
    }*/

    protected toNextBatch(batch: PlanningResourceBatch, resources: Resources): PlanningResourceBatch {
        batch.getGames().forEach(game => {
            game.setStartDateTime(this.cloneDateTime(resources.dateTime));
            game.setResourceBatch(batch.getNumber());
            resources.fields.push(game.getField());
            if (game.getRefereePlace()) {
                this.refereePlaces.push(game.getRefereePlace());
            }
            if (game.getReferee()) {
                this.referees.push(game.getReferee());
            }
        });
        this.setNextGameStartDateTime(resources.dateTime);
        return batch.createNext();
    }

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
            // if (!batch.hasPlace(place) && this.getPlanningPlace(place).getNrOfGamesInARow() > 7) {
            //     const r = 3;
            // }
            if (batch.hasPlace(place)) {
                return false;
            }
            const nrOfGamesInARow = batch.hasPrevious() ? (batch.getPrevious().getGamesInARow(place)) : 0;
            return nrOfGamesInARow < this.maxNrOfGamesInARow || this.maxNrOfGamesInARow === -1;
        });
    }

    private assignSport(game: Game, sport: Sport) {
        this.getPlaces(game).forEach(placeIt => {
            this.getPlanningPlace(placeIt).getSportCounter().addGame(sport);
        });
    }

    private releaseSport(game: Game, sport: Sport) {
        this.getPlaces(game).forEach(placeIt => {
            this.getPlanningPlace(placeIt).getSportCounter().removeGame(sport);
        });
    }

    private isSomeFieldAssignable(game: Game, resources: Resources): boolean {
        resources.fields.forEach(fieldIt => {
            if (fieldIt === undefined) {
                const e = 4;
            }
        });
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
        return this.getPlaces(game).every(placeIt => {
            return this.getPlanningPlace(placeIt).getSportCounter().isAssignable(sport);
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

    protected addNrOfGamesInARow(batch: PlanningResourceBatch) {
        this.roundNumber.getPlaces().forEach(place => {
            this.getPlanningPlace(place).toggleGamesInARow(batch.hasPlace(place));
        });
    }

    protected getPlanningPlace(place: Place): PlanningPlace {
        return this.planningPlaces[place.getLocationId()];
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
        const nrOfGamesSimultaneously = Math.floor(this.roundNumber.getNrOfPlaces() / nrOfGamePlaces);
        if (nrOfGamesSimultaneously < this.maxNrOfGamesPerBatch) {
            this.maxNrOfGamesPerBatch = nrOfGamesSimultaneously;
        }
        return this.maxNrOfGamesPerBatch;
    }

    protected setMaxNrOfGamesInARow(maxNrOfGamesPerBatch: number) {
        let nrOfGamePlaces = Sport.TEMPDEFAULT;
        if (this.planningConfig.getTeamup()) {
            nrOfGamePlaces *= 2;
        }
        if (this.planningConfig.getSelfReferee()) {
            nrOfGamePlaces++;
        }

        const nrOfPlaces = this.roundNumber.getNrOfPlaces();

        const nrOfRestPerBatch = nrOfPlaces - (nrOfGamePlaces * maxNrOfGamesPerBatch);
        if (nrOfRestPerBatch < 1) {
            this.maxNrOfGamesInARow = -1;
        } else {
            this.maxNrOfGamesInARow = Math.ceil(nrOfPlaces / nrOfRestPerBatch) - 1;
            if ((nrOfGamePlaces * maxNrOfGamesPerBatch) === nrOfRestPerBatch) {
                this.maxNrOfGamesInARow++;
            }
        }
        this.maxNrOfGamesInARow = -1;
    }

    protected sortGamesByInARow(games: Game[], assignedBatches: PlanningResourceBatch[]) {
        assignedBatches.sort((batch1: PlanningResourceBatch, batch2: PlanningResourceBatch) => {
            return batch2.getNumber() - batch1.getNumber();
        });
        const getInRow = (place: Place): number => {
            let nrInRow = 0;
            assignedBatches.every(batch => {
                if (batch.hasPlace(place)) {
                    nrInRow++;
                    return true;
                }
                return false;
            });
            return nrInRow;
        };
        const getMostInRow = (game: Game): number => {
            let maxNrInRow = 0;
            this.getPlaces(game).forEach(place => {
                const nrInRow = getInRow(place);
                if (nrInRow > maxNrInRow) {
                    maxNrInRow = nrInRow;
                }
            });
            return maxNrInRow;
        };

        games.sort((g1: Game, g2: Game) => {
            return getMostInRow(g1) - getMostInRow(g2);
        });
    }


    /* time functions */

    private getEndDateTime(date: Date): Date {
        if (date === undefined) {
            return undefined;
        }
        const endDateTime = new Date(date.getTime());
        endDateTime.setMinutes(endDateTime.getMinutes() + this.planningConfig.getMaximalNrOfMinutesPerGame());
        return endDateTime;
    }

    private cloneDateTime(dateTime: Date): Date {
        if (dateTime === undefined) {
            return undefined;
        }
        return new Date(dateTime.getTime());
    }

    private setNextGameStartDateTime(date: Date) {
        if (date === undefined) {
            return undefined;
        }
        const add = this.planningConfig.getMaximalNrOfMinutesPerGame() + this.planningConfig.getMinutesBetweenGames();
        this.addMinutes(date, add);
    }

    protected addMinutes(dateTime: Date, minutes: number) {
        dateTime.setMinutes(dateTime.getMinutes() + minutes);
        if (this.blockedPeriod === undefined) {
            return;
        }
        const endDateTime = this.cloneDateTime(dateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + this.planningConfig.getMaximalNrOfMinutesPerGame());
        if (endDateTime > this.blockedPeriod.start && dateTime < this.blockedPeriod.end) {
            dateTime = new Date(this.blockedPeriod.end.getTime());
        }
        // return dateTime;
    }

    /**
    * @TODO REMOVE
    */
    private consoleBatch(batch: PlanningResourceBatch) {
        this.consoleBatchHelper(batch.getRoot());
    }

    private consoleBatchHelper(batch: PlanningResourceBatch) {
        this.consoleGames(batch, batch.getGames());
        if (batch.hasNext()) {
            this.consoleBatchHelper(batch.getNext());
        }
    }

    /**
     * @TODO REMOVE
     */
    private consoleGames(batch: PlanningResourceBatch, games: Game[]) {
        games.forEach(game => console.log(this.consoleGame(batch, game)));
    }

    /**
     * @TODO REMOVE
     */
    private consoleGame(batch: PlanningResourceBatch, game: Game): string {
        const nameService = new NameService();
        return 'poule ' + game.getPoule().getNumber()
            + ', ' + this.getConsolePlaces(batch, game, Game.HOME)
            + ' vs ' + this.getConsolePlaces(batch, game, Game.AWAY)
            + ' , ref ' + (game.getRefereePlace() ? nameService.getPlaceFromName(game.getRefereePlace(), false, false) : '')
            + ', batch ' + (game.getResourceBatch() ? game.getResourceBatch() : '?')
            + ', field ' + (game.getField() ? game.getField().getNumber() : '?')
            + ', sport ' + (game.getField() ? game.getField().getSport().getName() +
                (game.getField().getSport().getCustomId() ? '(' + game.getField().getSport().getCustomId() + ')' : '') : '?')
            ;
    }

    /**
     * @TODO REMOVE
     */
    getConsolePlaces(batch: PlanningResourceBatch, game: Game, homeAway: boolean): string {
        const nameService = new NameService();
        return game.getPlaces(homeAway).map(gamePlace => {
            return nameService.getPlaceFromName(gamePlace.getPlace(), false, false) + '(' +
                batch.getGamesInARow(gamePlace.getPlace()) + ')';
        }).join(' & ');
    }
}

interface PlanningPlaceMap {
    [locationId: string]: PlanningPlace;
}

interface Resources {
    dateTime: Date;
    fields: Field[];
}
