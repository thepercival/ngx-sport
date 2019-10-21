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
import { PlanningConfigOptimalization } from '../config/optimalization';
import { VoetbalRange } from '../../range';
// import { consoleBatch } from '../../../test/helper';

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

    assign(allGames: Game[], startDateTime: Date) {

        const gamesH2h = this.getGamesByH2h(allGames);
        // wedstrijden per h2h ophalen
        // je geeft dan de batch mee, zodat je nog wel nrofgamesinarow beschikbaar hebt!!
        // nu gaan de games ook niet door elkaar lopen!!
        // games zijn al gesorteerd op roundnumber, subnumber, dus nu gewoon even opsplitsten

        let batch = new PlanningResourceBatch();
        batch.setDateTime(startDateTime);
        gamesH2h.forEach(games => {
            const resources = { fields: this.fields.slice() };
            batch = this.assignBatch(games.slice(), resources, batch);
            if (batch === undefined) {
                throw Error('cannot assign resources');
            }
        });
    }

    protected assignBatch(games: Game[], resources: Resources, batch: PlanningResourceBatch): PlanningResourceBatch {
        const optimalization = new PlanningConfigOptimalization(
            this.fields.length,
            this.planningConfig.getSelfReferee(),
            this.referees.length,
            this.roundNumber.getPoules().length,
            this.roundNumber.getNrOfPlaces(),
            this.planningConfig.getTeamup()
        );

        const nrOfBatchGames = optimalization.getMaxNrOfGamesPerBatch();
        while (nrOfBatchGames.min > 0) {

            this.maxNrOfGamesInARow = optimalization.getMaxNrOfGamesInARow();
            console.log('trying for maxNrOfBatchGames = (' + nrOfBatchGames.min + '->'
                + nrOfBatchGames.max + ')  maxNrOfGamesInARow = ' + this.maxNrOfGamesInARow);
            // die();
            this.initPlanningPlaces();
            let resourcesTmp = { fields: resources.fields.slice() };
            if (this.assignBatchHelper(games.slice(), resourcesTmp, nrOfBatchGames, batch)) {
                return batch.getLeaf();
            }
            // throw Error('cannot assign resources new ');

            this.maxNrOfGamesInARow = optimalization.setMaxNrOfGamesInARow(++this.maxNrOfGamesInARow);
            console.log('trying2 for maxNrOfBatchGames = (' + nrOfBatchGames.min + '->'
                + nrOfBatchGames.max + ')  maxNrOfGamesInARow = ' + this.maxNrOfGamesInARow);
            // die();
            this.initPlanningPlaces();
            resourcesTmp = { fields: resources.fields.slice() };
            if (this.assignBatchHelper(games.slice(), resourcesTmp, nrOfBatchGames, batch)) {
                return batch.getLeaf();
            }

            optimalization.decreaseNrOfBatchGames();
        }
        return undefined;
    }


    protected assignBatchHelper(games: Game[], resources: Resources, nrOfBatchGames: VoetbalRange
        , batch: PlanningResourceBatch, nrOfGamesTried: number = 0): boolean {

        if (batch.getGames().length === nrOfBatchGames.max || games.length === 0) { // batchsuccess
            const nextBatch = this.toNextBatch(batch, resources);
            // if (batch.getNumber() < 4) {
            // console.log('batch succes: ' + batch.getNumber() + ' it(' + iteration + ')');
            // assignedBatches.forEach(batchTmp => this.consoleGames(batchTmp.getGames()));
            // console.log('-------------------');
            // }
            if (games.length === 0) { // endsuccess
                return true;
            }
            return this.assignBatchHelper(games, resources, nrOfBatchGames, nextBatch);
        }
        if (games.length === nrOfGamesTried) {
            if (batch.getGames().length >= nrOfBatchGames.min) {
                const nextBatch = this.toNextBatch(batch, resources);
                return this.assignBatchHelper(games, resources, nrOfBatchGames, nextBatch);
            }
            return false;
        }

        const resources3 = { fields: resources.fields.slice() };
        let nrOfFieldsTried = 0;
        while (nrOfFieldsTried++ < resources3.fields.length) {
            // let nrOfGamesTriedPerField = nrOfGamesTried;
            //             echo 'batchnr: ' . $this->getConsoleString($batch->getNumber(), 2)
            //                 . ', gamesInBatch: ' . $this->getConsoleString(count($batch->getGames()), 2)
            //                 . ', fieldsTried: ' . $this->getConsoleString($nrOfFieldsTried - 1, 1)
            //                 . ', gamesTried: ' . $this->getConsoleString($nrOfGamesTriedPerField, 2)
            //                 . ', gamesPerBatch: ' . $nrOfGames . PHP_EOL;
            const resources2 = { fields: resources3.fields.slice() };
            {
                const game = games.shift();
                if (this.isGameAssignable(batch, game, resources2)) {
                    this.assignGame(batch, game, resources2);
                    if (this.assignBatchHelper(games.slice(), resources2, nrOfBatchGames, batch)) {
                        return true;
                    }
                    this.releaseGame(batch, game);
                }
                games.push(game);
            }
            if (this.assignBatchHelper(games, resources3, nrOfBatchGames, batch, ++nrOfGamesTried /*++$nrOfGamesTriedPerField*/)) {
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

    protected releaseGame(batch: PlanningResourceBatch, game: Game) {
        batch.remove(game);
        this.releaseSport(game, game.getField().getSport());
        this.releaseField(game);
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
            game.setStartDateTime(this.cloneDateTime(batch.getDateTime()));
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
        const nextBatch = batch.createNext();
        nextBatch.setDateTime(this.getNextGameStartDateTime(batch.getDateTime()));
        return nextBatch;
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
            return (nrOfGamesInARow < this.maxNrOfGamesInARow) || this.maxNrOfGamesInARow === -1;
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
        // resources.fields.forEach(fieldIt => {
        //     if (fieldIt === undefined) {
        //         const e = 4;
        //     }
        // });
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

    private releaseField(game: Game/*, resources: Resources*/) {
        // resources.fields.unshift(game.getField());


        // if (resources.fieldIndex !== undefined) {
        //     if (resources.fields.length === 3) {
        //         const r = 4;
        //     }
        //     const fieldIndex = resources.fields.indexOf(game.getField());
        //     if (fieldIndex === -1) {
        //         resources.fields.splice(resources.fieldIndex, 0, game.getField());
        //     }
        //     resources.fieldIndex = undefined;
        // }
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

    protected getGamesByH2h(orderedGames: Game[]): Game[][] {
        let currentBatch = [];
        const h2hgames = [];
        let firstGame;
        orderedGames.forEach(game => {
            if (firstGame === undefined) {
                firstGame = game;
            } else if (this.isSameGame(firstGame, game)) {
                h2hgames.push(currentBatch);
                currentBatch = [];
                firstGame = game;
            }
            currentBatch.push(game);
        });
        if (currentBatch.length > 0) {
            h2hgames.push(currentBatch);
        }
        return h2hgames;
    }

    protected isSameGame(firstGame: Game, game: Game): boolean {
        return firstGame.getPlaces().every(gamePlace => game.isParticipating(gamePlace.getPlace()));
    }

    /* time functions */

    private cloneDateTime(dateTime: Date): Date {
        if (dateTime === undefined) {
            return undefined;
        }
        return new Date(dateTime.getTime());
    }

    private getNextGameStartDateTime(date: Date): Date {
        if (date === undefined) {
            return undefined;
        }
        const add = this.planningConfig.getMaximalNrOfMinutesPerGame() + this.planningConfig.getMinutesBetweenGames();
        return this.addMinutes(date, add);
    }

    protected addMinutes(dateTime: Date, minutes: number): Date {
        let newStartDateTime = this.cloneDateTime(dateTime);
        newStartDateTime.setMinutes(newStartDateTime.getMinutes() + minutes);
        if (this.blockedPeriod === undefined) {
            return newStartDateTime;
        }
        const endDateTime = this.cloneDateTime(newStartDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + this.planningConfig.getMaximalNrOfMinutesPerGame());
        if (endDateTime > this.blockedPeriod.start && dateTime < this.blockedPeriod.end) {
            newStartDateTime = new Date(this.blockedPeriod.end.getTime());
        }
        return newStartDateTime;
    }
}

interface PlanningPlaceMap {
    [locationId: string]: PlanningPlace;
}

interface Resources {
    fields: Field[];
    fieldIndex?: number;
}
