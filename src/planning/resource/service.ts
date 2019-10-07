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
import { StructureService } from '../../structure/service';
import { consoleBatch } from '../../../test/helper';

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
    private nrOfSports: number;
    private counter = 0;
    private tryShuffledFields = false;
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
        this.nrOfSports = sportPlanningConfigs.length;
        this.planningPlaces = {};
        this.roundNumber.getPoules().forEach(poule => {
            const nrOfHeadtohead = sportPlanningConfigService.getSufficientNrOfHeadtohead(poule);
            const nrOfGamesToGo = sportPlanningConfigService.getNrOfGamesPerPlace(poule, nrOfHeadtohead);

            const sportsNrOfGames = sportPlanningConfigService.getPlanningMinNrOfGames(poule);
            const minNrOfGamesMap = sportPlanningConfigService.convertToMap(sportsNrOfGames);
            poule.getPlaces().forEach((place: Place) => {
                const sportCounter = new SportCounter(nrOfGamesToGo, minNrOfGamesMap, sportPlanningConfigs);
                this.planningPlaces[place.getLocationId()] = new PlanningPlace(sportCounter);
            });
        });
    }

    assign(games: Game[], startDateTime: Date) {
        this.initPlanningPlaces();
        const resources = { dateTime: this.cloneDateTime(startDateTime), fields: this.fields.slice() };
        if (!this.assignBatch(games.slice(), resources, this.getMaxNrOfGamesPerBatch(games.length))) {
            throw Error('cannot assign resources');
        }
    }

    assignBatch(games: Game[], resources: Resources, nrOfGamesPerBatch: number): boolean {
        if (nrOfGamesPerBatch === 0) {
            return false;
        }
        this.setMaxNrOfGamesInARow(nrOfGamesPerBatch);
        return this.assignBatchHelper(games.slice(), resources, nrOfGamesPerBatch, new PlanningResourceBatch());
        // if (this.assignBatchHelper(games.slice(), resources, nrOfGamesPerBatch, new PlanningResourceBatch()) === true) {
        //     return true;
        // }
        // return this.assignBatch(games,
        //     { dateTime: this.cloneDateTime(resources.dateTime), fields: this.fields.slice() },
        //     nrOfGamesPerBatch - 1);
    }

    protected assignBatchHelper(games: Game[], resources: Resources, nrOfGames: number, batch: PlanningResourceBatch
        , nrOfGamesTried: number = 0): boolean {

        if (batch.getGames().length === nrOfGames || games.length === 0) { // batchsuccess
            // consoleBatch(batch);
            const nextBatch = this.toNextBatch(batch, resources);
            if (games.length === 0) { // endsuccess
                // consoleBatch(batch);
                return true;
            }
            return this.assignBatchHelper(games, resources, nrOfGames, nextBatch);
        }
        if (games.length === nrOfGamesTried) {
            return false;
        }

        const resources3 = { dateTime: this.cloneDateTime(resources.dateTime), fields: resources.fields.slice() };
        let nrOfFieldsTried = 0;
        while (nrOfFieldsTried++ < resources3.fields.length) {
            let nrOfGamesTriedPerField = nrOfGamesTried;
            // console.log('batchnr: ' + this.getConsoleString(batch.getNumber(), 2)
            //     + ', gamesInBatch: ' + this.getConsoleString(batch.getGames().length, 2)
            //     + ', fieldsTried: ' + this.getConsoleString(nrOfFieldsTried - 1, 1)
            //     + ', gamesTried: ' + this.getConsoleString(nrOfGamesTriedPerField, 2)
            //     + ', gamesPerBatch: ' + nrOfGames);
            const resources2 = { dateTime: this.cloneDateTime(resources3.dateTime), fields: resources3.fields.slice() };
            {
                const game = games.shift();
                if (this.isGameAssignable(batch, game, resources2)) {
                    this.assignGame(batch, game, resources2);
                    if (this.assignBatchHelper(games.slice(), resources2, nrOfGames, batch)) {
                        return true;
                    }
                    this.releaseGame(batch, game, resources2);
                }
                games.push(game);
            }
            if (this.assignBatchHelper(games, resources3, nrOfGames, batch, ++nrOfGamesTriedPerField)) {
                return true;
            }
            if (!this.tryShuffledFields) {
                return false;
            }
            // if (resources2.fields.length === 0) {
            //     const f = 1;
            //     break;
            // }
            resources3.fields.push(resources3.fields.shift());
        }
        return false;

        // const resources2 = { dateTime: this.cloneDateTime(resources.dateTime), fields: resources.fields.slice() };
        // const game = games.shift();
        // if (this.isGameAssignable(batch, game, resources)) {
        //     this.assignGame(batch, game, resources2);
        //     // console.log('------game for batch ' + batch.getNumber() +
        //     //     ' : games per batch => ' + nrOfGames + ' ----------');
        //     // console.log(this.consoleGame(batch, game));
        //     if (this.assignBatchHelper(games.slice(), resources2, nrOfGames, batch)) {
        //         return true;
        //     }
        //     this.releaseGame(batch, game, resources2);
        // }
        // games.push(game);

        // const resources3 = { dateTime: this.cloneDateTime(resources.dateTime), fields: resources.fields.slice() };
        // return this.assignBatchHelper(games, resources3, nrOfGames, batch, ++nrOfGamesTried);
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
            // hier alle velden toevoegen die er nog niet in staan
            const fieldIndex = resources.fields.indexOf(game.getField());
            if (fieldIndex === -1) {
                resources.fields.push(game.getField());
            }
            if (game.getRefereePlace()) {
                this.refereePlaces.push(game.getRefereePlace());
            }
            if (game.getReferee()) {
                this.referees.push(game.getReferee());
            }
        });
        // console.log('nextbatch', resources.fields.map(field => field.getNumber()).join(' & '));
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
        // resources.fields.unshift(game.getField());


        if (resources.fieldIndex !== undefined) {
            if (resources.fields.length === 3) {
                const r = 4;
            }
            const fieldIndex = resources.fields.indexOf(game.getField());
            if (fieldIndex === -1) {
                resources.fields.splice(resources.fieldIndex, 0, game.getField());
            }
            resources.fieldIndex = undefined;
        }
        // const fieldIndex = resources.fields.indexOf(game.getField());
        // resources.fields.unshift(resources.fields.splice(fieldIndex, 1).pop());

        game.setField(undefined);
    }

    private assignField(game: Game, resources: Resources) {
        const field = resources.fields.find(fieldIt => {
            return this.isSportAssignable(game, fieldIt.getSport());
        });
        if (field) {
            // const fieldIndex = resources.fields.indexOf(field);
            // resources.fields.splice(fieldIndex, 1);
            // resources.fields.push(field);
            // game.setField(field);
            resources.fieldIndex = resources.fields.indexOf(field);
            game.setField(resources.fields.splice(resources.fieldIndex, 1).pop());
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

    protected getMaxNrOfGamesPerBatch(nrOfGames: number): number {
        if (this.maxNrOfGamesPerBatch !== undefined) {
            return this.maxNrOfGamesPerBatch;
        }
        this.maxNrOfGamesPerBatch = this.fields.length;

        if (!this.planningConfig.getSelfReferee() && this.referees.length > 0 && this.referees.length < this.maxNrOfGamesPerBatch) {
            this.maxNrOfGamesPerBatch = this.referees.length;
        }

        const nrOfGamePlaces = this.getNrOfGamePlaces();
        const nrOfRoundNumberPlaces = this.roundNumber.getNrOfPlaces();
        const nrOfGamesSimultaneously = Math.floor(nrOfRoundNumberPlaces / nrOfGamePlaces);
        const maxNrOfGamesPerBatchPreBorder = this.maxNrOfGamesPerBatch;
        if (nrOfGamesSimultaneously < this.maxNrOfGamesPerBatch) {
            this.maxNrOfGamesPerBatch = nrOfGamesSimultaneously;
        }
        const ss = new StructureService();
        const nrOfPoulePlaces = ss.getNrOfPlacesPerPoule(this.roundNumber.getNrOfPlaces(), this.roundNumber.getPoules().length);
        // if ((nrOfPoulePlaces - 1) === this.nrOfSports
        //     && this.nrOfSports > 1 && this.nrOfSports === this.fields.length
        // ) {
        //     if (this.roundNumber.getValidPlanningConfig().getNrOfHeadtohead() === 2 ||
        //         this.roundNumber.getValidPlanningConfig().getNrOfHeadtohead() === 3) {
        //         this.maxNrOfGamesPerBatch = 2;
        //     } else {
        //         this.maxNrOfGamesPerBatch = 1; // this.roundNumber.getPoules().length;
        //     }
        // }

        const nrOfPlacesPerBatch = nrOfGamePlaces * this.maxNrOfGamesPerBatch;
        if (this.nrOfSports > 1) {
            /*if (this.roundNumber.getNrOfPlaces() === nrOfPlacesPerBatch) {
                this.maxNrOfGamesPerBatch--;
            } else*/ if (Math.floor(this.roundNumber.getNrOfPlaces() / nrOfPlacesPerBatch) < 2) {
                const sportPlanningConfigService = new SportPlanningConfigService();
                const defaultNrOfGames = sportPlanningConfigService.getNrOfCombinationsExt(this.roundNumber);
                const nrOfHeadtothead = nrOfGames / defaultNrOfGames;
                // if (((nrOfPlacesPerBatch * nrOfHeadtothead) % this.roundNumber.getNrOfPlaces()) !== 0) {

                if (maxNrOfGamesPerBatchPreBorder >= this.maxNrOfGamesPerBatch) {
                    if ((nrOfHeadtothead % 2) === 1) {
                        this.maxNrOfGamesPerBatch--;
                    } /*else if (this.nrOfSports === (nrOfPoulePlaces - 1)) {
                        this.maxNrOfGamesPerBatch--;
                    }*/

                    // if ((nrOfHeadtothead * maxNrOfGamesPerBatchPreBorder) <= this.maxNrOfGamesPerBatch) {
                    //     this.maxNrOfGamesPerBatch--;
                    // }
                }

                /*if (maxNrOfGamesPerBatchPreBorder === this.maxNrOfGamesPerBatch
                    && ((nrOfHeadtothead * maxNrOfGamesPerBatchPreBorder) === this.maxNrOfGamesPerBatch)) {
                    this.maxNrOfGamesPerBatch--;
                } else if (maxNrOfGamesPerBatchPreBorder > this.maxNrOfGamesPerBatch
                    && ((nrOfHeadtothead * maxNrOfGamesPerBatchPreBorder) < this.maxNrOfGamesPerBatch)) {
                    this.maxNrOfGamesPerBatch--;
                } /*else {
                    this.tryShuffledFields = true;
                }*/
                // nrOfPlacesPerBatch deelbaar door nrOfGames
                // als wat is verschil met:
                // 3v en 4d 1H2H
                // 3v en 4d 2H2H deze niet heeft 12G
                // 2v en 4d
            }
        }


        // this.maxNrOfGamesPerBatch moet 1 zijn, maar er kunnen twee, dus bij meerdere sporten
        // en totaal aantal deelnemers <= aantal deelnemers per batch
        //      bij  2v  4d dan 4 <= 4 1H2H van 2 naar 1
        //      bij 21v 44d dan 8 <= 8 1H2H van 3 naar 2
        //      bij  3v  4d dan 4 <= 6 1H2H van 2 naar 1
        //      bij  3v  4d dan 4 <= 6 2H2H van 2 naar 1(FOUT)

        // if (this.fields.length === 3 && this.nrOfSports === 2) {
        //     this.tryShuffledFields = true;
        // }
        if (this.maxNrOfGamesPerBatch < 1) {
            this.maxNrOfGamesPerBatch = 1;
        }
        return this.maxNrOfGamesPerBatch;
    }

    protected getNrOfGamePlaces(): number {
        let nrOfGamePlaces = Sport.TEMPDEFAULT;
        if (this.planningConfig.getTeamup()) {
            nrOfGamePlaces *= 2;
        }
        if (this.planningConfig.getSelfReferee()) {
            nrOfGamePlaces++;
        }
        return nrOfGamePlaces;
    }

    protected setMaxNrOfGamesInARow(maxNrOfGamesPerBatch: number) {
        const nrOfGamePlaces = this.getNrOfGamePlaces();

        const nrOfPlaces = this.roundNumber.getNrOfPlaces();
        // @TODO only when all games(field->sports) have equal nrOfPlacesPerGame
        const nrOfPlacesPerBatch = nrOfGamePlaces * maxNrOfGamesPerBatch;

        const nrOfRestPerBatch = nrOfPlaces - nrOfPlacesPerBatch;
        if (nrOfRestPerBatch < 1) {
            this.maxNrOfGamesInARow = -1;
        } else {
            this.maxNrOfGamesInARow = Math.ceil(nrOfPlaces / nrOfRestPerBatch) - 1;
            if (nrOfPlacesPerBatch === nrOfRestPerBatch) {
                this.maxNrOfGamesInARow++;
            }
            if (this.nrOfSports > 1) {
                if ((nrOfPlaces - 1) === nrOfPlacesPerBatch) {
                    this.maxNrOfGamesInARow++;
                }
            }

            // nrOfPlacesPerBatch = 2
            // nrOfRestPerBatch = 1
            // nrOfPlaces = 3

            // bij 3 teams en 2 teams per batch speelt ook aantal placesper
            // if (nrOfPlacesPerBatch === nrOfRestPerBatch) {
            //     this.maxNrOfGamesInARow++;
            // }
            // if (this.nrOfSports >= Math.ceil(nrOfRestPerBatch / this.fields.length)
            //     && this.nrOfSports > 1 /*&& this.nrOfSports === this.fields.length*/) {
            //     // this.maxNrOfGamesInARow++;
            //     this.maxNrOfGamesInARow++;
            //     // this.maxNrOfGamesInARow = -1;
            // }
        }
        // if (this.nrOfSports > 1) {
        //     this.maxNrOfGamesInARow = -1;
        // }
        // this.maxNrOfGamesInARow = -1;
    }

    /* time functions */

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
}

interface PlanningPlaceMap {
    [locationId: string]: PlanningPlace;
}

interface Resources {
    dateTime: Date;
    fields: Field[];
    fieldIndex?: number;
}
