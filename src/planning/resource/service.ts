import { Field } from '../../field';
import { Game } from '../../game';
import { Place } from '../../place';
import { Referee } from '../../referee';
import { PlanningConfig } from '../config';
import { BlockedPeriod } from '../service';
import { PlanningResourceBatch } from './batch';

export class PlanningResourceService {
    private referees: Referee[];
    private refereePlaces: Place[];
    private areRefereesEnabled: boolean = false;
    private fields: Field[] = [];

    private blockedPeriod;
    private currentGameStartDate: Date;
    private nrOfPoules: number;
    private nrOfPlaces: number;
    private maxNrOfGamesPerBatch: number;
    // private assignedPlacesPerField = {};
    // private batch: Resources;

    constructor(
        private config: PlanningConfig,
        dateTime: Date
    ) {
        this.currentGameStartDate = this.cloneDateTime(dateTime);
    }

    setBlockedPeriod(blockedPeriod: BlockedPeriod) {
        this.blockedPeriod = blockedPeriod;
    }

    setNrOfPoules(nrOfPoules: number) {
        this.nrOfPoules = nrOfPoules;
    }

    setNrOfPlaces(nrOfPlaces: number) {
        this.nrOfPlaces = nrOfPlaces;
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

    assign(games: Game[]): Date {
        let batchNr = 1;
        while (games.length > 0) {
            let nrOfGamesPerBatch = this.getMaxNrOfGamesPerBatch();
            let batch = new PlanningResourceBatch();
            while (!this.isBatchCompleted(games.slice(), nrOfGamesPerBatch, batch)) {
                nrOfGamesPerBatch--;
                this.rollbackBatch(batch);
                batch = new PlanningResourceBatch();
            };
            this.toNextBatch(batch, games, batchNr++);
        }
        return this.getEndDateTime();
    }

    protected isBatchCompleted(games: Game[], nrOfGamesPerBatch: number, batch: PlanningResourceBatch): boolean {
        if (batch.getGames().length === nrOfGamesPerBatch) { // endsuccess
            return true;
        }
        if (games.length === 0) {
            return false;
        }
        const game = games.shift();
        if (this.isGameAssignable(batch, game)) {
            this.assignGame(batch, game);
            if (this.isBatchCompleted(games.slice(), nrOfGamesPerBatch, batch) === true) {
                return true;
            }
            this.releaseGame(batch, game);

            return this.isBatchCompleted(games, nrOfGamesPerBatch, batch);
        }
        return this.isBatchCompleted(games, nrOfGamesPerBatch, batch);
    };

    protected assignGame(batch: PlanningResourceBatch, game: Game) {
        this.assignField(game);
        if (!this.config.getSelfReferee()) {
            if (this.referees.length > 0) {
                this.assignReferee(game);
            }
        } else {
            this.assignRefereePlaces(game);
        }
        batch.add(game);
    }

    protected releaseGame(batch: PlanningResourceBatch, game: Game) {
        batch.remove(game);
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
                this.getPlaces(game).forEach(place => {
                    this.refereePlaces.push(place);
                });
            }
            if (game.getReferee()) {
                this.referees.push(game.getReferee());
            }
            games.splice(games.indexOf(game), 1);
        }
        this.setNextGameStartDateTime();
    }

    protected shouldGoToNextBatch(batch: PlanningResourceBatch): boolean {
        if (this.config.getSelfReferee() && this.nrOfPoules > 1 && batch.getNrOfPoules() === this.nrOfPoules) {
            return true;
        }
        if (!this.isSomeFieldAssignable()) {
            return true;
        }
        if (!this.isSomeRefereeAssignable()) {
            return true;
        }
        let minNrNeeded = this.config.getNrOfCompetitorsPerGame();
        minNrNeeded += this.config.getSelfReferee() ? 1 : 0;
        return batch.getNrOfPlaces() + minNrNeeded > this.nrOfPlaces;
    }

    private isGameAssignable(batch: PlanningResourceBatch, game: Game): boolean {
        if (!this.isSomeFieldAssignable()) {
            return false;
        }
        if (!this.isSomeRefereeAssignable(game)) {
            return false;
        }
        return !batch.hasSomePlace(this.getPlaces(game));
    }

    private isSomeFieldAssignable(): boolean {
        return this.fields.length > 0;
    }

    private isSomeRefereeAssignable(game?: Game): boolean {
        if (!this.config.getSelfReferee()) {
            if (!this.areRefereesEnabled) {
                return true;
            }
            return this.referees.length > 0;
        }
        if (game === undefined) {
            return this.refereePlaces.length > 0;
        }

        return this.refereePlaces.some(refereePlace => {
            return !game.isParticipating(refereePlace) && (this.nrOfPoules === 1 || refereePlace.getPoule() !== game.getPoule());
        });
    }

    private releaseField(game: Game) {
        this.fields.unshift(game.getField());
        game.setField(undefined);
    }

    private assignField(game: Game) {
        game.setField(this.fields.shift());
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

    private assignRefereePlaces(game: Game) {
        this.getPlaces(game).forEach(place => {
            const idx = this.refereePlaces.indexOf(place);
            if (idx >= 0) {
                this.refereePlaces.splice(idx, 1);
            }
        });
        const refereePlace = this.refereePlaces.find(refereePlaceIt => {
            return (this.nrOfPoules === 1 || refereePlaceIt.getPoule() !== game.getPoule());
        });
        if (refereePlace) {
            game.setRefereePlace(this.refereePlaces.splice(this.refereePlaces.indexOf(refereePlace), 1).pop());
        }
    }

    private releaseRefereePlaces(game: Game) {
        this.getPlaces(game).reverse().forEach(place => {
            this.refereePlaces.unshift(place);
        });
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
        if (!this.config.getSelfReferee() && this.referees.length > 0 && this.referees.length < this.maxNrOfGamesPerBatch) {
            this.maxNrOfGamesPerBatch = this.referees.length;
        }

        let nrOfPlacesPerGame = this.config.getNrOfCompetitorsPerGame();
        if (this.config.getSelfReferee()) {
            nrOfPlacesPerGame++;
        }
        const nrOfGames = (this.nrOfPlaces - (this.nrOfPlaces % nrOfPlacesPerGame)) / nrOfPlacesPerGame;
        if (nrOfGames < this.maxNrOfGamesPerBatch) {
            this.maxNrOfGamesPerBatch = nrOfGames;
        }
        return this.maxNrOfGamesPerBatch;
    }

    /* time functions */

    private getEndDateTime(): Date {
        if (this.currentGameStartDate === undefined) {
            return undefined;
        }
        const endDateTime = new Date(this.currentGameStartDate.getTime());
        endDateTime.setMinutes(endDateTime.getMinutes() + this.config.getMaximalNrOfMinutesPerGame());
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
        const add = this.config.getMaximalNrOfMinutesPerGame() + this.config.getMinutesBetweenGames();
        this.currentGameStartDate = this.addMinutes(this.currentGameStartDate, add);
    }

    protected addMinutes(dateTime: Date, minutes: number): Date {
        dateTime.setMinutes(dateTime.getMinutes() + minutes);
        if (this.blockedPeriod === undefined) {
            return dateTime;
        }
        const endDateTime = this.cloneDateTime(dateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + this.config.getMaximalNrOfMinutesPerGame());
        if (endDateTime > this.blockedPeriod.start && dateTime < this.blockedPeriod.end) {
            dateTime = new Date(this.blockedPeriod.end.getTime());
        }
        return dateTime;
    }
}
