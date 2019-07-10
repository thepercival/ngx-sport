import { Field } from '../../field';
import { Game } from '../../game';
import { Place } from '../../place';
import { PlanningConfig } from '../config';
import { PlanningReferee } from '../referee';
import { BlockedPeriod } from '../service';
import { Poule } from '../../poule';

export class PlanningResourceService {
    private availableReferees: PlanningReferee[] = [];
    private assignableReferees: PlanningReferee[] = [];
    private availableFields: Field[] = [];
    private assignableFields: Field[] = [];
    private batchNr = 1;
    private blockedPeriod;
    private currentGameStartDate: Date;
    private nrOfPoules: number;
    private nrOfPlaces: number;
    // private assignedPlacesPerField = {};
    private batch: Resources;
    private unassignables: Resources;

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
        this.availableFields = fields;
        this.fillAssignableFields();
        // fields.forEach(field => {
        //     this.assignedPlacesPerField[field.getId()] = [];
        // });
    }

    setReferees(referees: PlanningReferee[]) {
        this.availableReferees = referees;
        this.fillAssignableReferees();
    }

    assign(games: Game[], selfRefereeSamePouleCheck: boolean): Date {
        while (games.length > 0) {
            const game = games.shift();
            if ( this.isGameAssignable(game, selfRefereeSamePouleCheck) ) {
                console.log('assigned');
                this.assignGame(game);
                continue;
            }
            console.log('not assigned');
            this.addToUnassignable(game);
            if (games.length === 0 || this.shouldGoToNextResourceBatch()) {
                console.log('to next resoursebatch', selfRefereeSamePouleCheck );
                games = this.unassignableGames.concat( games );
                this.resetUnassignable();
                if ( !selfRefereeSamePouleCheck) {
                    this.nextResourceBatch();
                    selfRefereeSamePouleCheck = this.config.getSelfReferee();
                } else {
                    selfRefereeSamePouleCheck = false;
                }
                return this.assign(games, selfRefereeSamePouleCheck );
            }
        }
        return this.getEndDateTime();
    }

    protected assignGame(game: Game) {
        this.batch.games.push(game);
        game.setStartDateTime(this.cloneDateTime(this.currentGameStartDate));
        game.setResourceBatch(this.batchNr);
        this.assignField(game);
        this.assignPlaces(game);
        if (this.areRefereesAvailable()) {
            this.assignReferee(game);
        }
    }

    protected isPouleAssigned(poule: Poule ): boolean {
        return this.batch.poules.some( pouleIt => pouleIt === poule );
    }

    protected shouldGoToNextResourceBatch(selfRefereeSamePouleCheck: boolean): boolean {
        if( selfRefereeSamePouleCheck && this.nrOfPoules === poules zijn bezet ) {
            return true;
        }
        if (this.areFieldsAvailable() && !this.isSomeFieldAssignable()) {
            return true;
        }
        if (this.areRefereesAvailable() && this.unassignables.games.length === this.availableReferees.length) {
            return true;
        }

        if ( this.unassignablePlaces.length + 1 >= this.nrOfPlaces ) {
            return true;
        }
        return false;
    }

    private resetResources(resources: Resources) {
        resources.games = [];
        resources.poules = [];
        resources.places = [];
    }

    protected addToResources(game: Game, resources: Resources) {
        resources.games.push(game);
        if ( resources.poules.find( unassignedPoule => game.getPoule() === unassignedPoule ) === undefined ) {
            resources.poules.push(game.getPoule());
        }
        this.getPlaces(game).forEach( place => {
            if ( resources.places.find( unassignedPlace => place === unassignedPlace ) === undefined ) {
                resources.places.push(place);
            }
        });
    }

    nextResourceBatch() {
        this.resetResources(this.batch);
        this.fillAssignableFields();
        this.fillAssignableReferees();
        this.batchNr++;
        this.setNextGameStartDateTime();
    }

    private getEndDateTime(): Date {
        if (this.currentGameStartDate === undefined) {
            return undefined;
        }
        const endDateTime = new Date(this.currentGameStartDate.getTime());
        endDateTime.setMinutes(endDateTime.getMinutes() + this.config.getMaximalNrOfMinutesPerGame());
        return endDateTime;
    }

    protected assignReferee(game: Game) {
        const referee = this.getAssignableReferee(game);
        if (referee === undefined) {
            return;
        }
        this.assignableReferees.splice(this.assignableReferees.indexOf(referee), 1);
        referee.assign(game);
        if (referee.isSelf()) {
            this.batch.places.push(referee.getPlace());
        }
    }

    protected assignField(game: Game) {
        if( this.availableFields.length === 0 ) {
            return;
        }
        const field = this.getAssignableField();
        this.assignableFields.splice(this.assignableFields.indexOf(field), 1);
        game.setField(field);
    }

    private fillAssignableFields() {
        if (this.assignableFields.length >= this.availableFields.length) {
            return;
        }
        if (this.assignableFields.length === 0) {
            this.assignableFields = this.availableFields.slice();
            return;
        }
        const lastAssignableField = this.assignableFields[this.assignableFields.length - 1];
        const idxLastAssignableField = this.availableFields.indexOf(lastAssignableField);
        const firstAssignableField = this.assignableFields[0];
        const idxFirstAssignableField = this.availableFields.indexOf(firstAssignableField);
        const endIndex = idxFirstAssignableField > idxLastAssignableField ? idxFirstAssignableField : this.availableFields.length;
        for (let i = idxLastAssignableField + 1; i < endIndex; i++) {
            this.assignableFields.push(this.availableFields[i]);
        }
        if (idxFirstAssignableField <= idxLastAssignableField) {
            for (let j = 0; j < idxFirstAssignableField; j++) {
                this.assignableFields.push(this.availableFields[j]);
            }
        }
    }

    private fillAssignableReferees() {
        if (this.assignableReferees.length >= this.availableReferees.length) {
            return;
        }
        if (this.assignableReferees.length === 0) {
            this.assignableReferees = this.availableReferees.slice();
            return;
        }
        if (this.config.getSelfReferee()) {
            this.assignableReferees = this.assignableReferees.concat(this.availableReferees);
            return;
        }
        const lastAssignableReferee = this.assignableReferees[this.assignableReferees.length - 1];
        const idxLastAssignableReferee = this.availableReferees.indexOf(lastAssignableReferee);
        const firstAssignableReferee = this.assignableReferees[0];
        const idxFirstAssignableReferee = this.availableReferees.indexOf(firstAssignableReferee);
        const endIndex = idxFirstAssignableReferee > idxLastAssignableReferee ? idxFirstAssignableReferee : this.availableReferees.length;
        for (let i = idxLastAssignableReferee + 1; i < endIndex; i++) {
            this.assignableReferees.push(this.availableReferees[i]);
        }
        if (idxFirstAssignableReferee <= idxLastAssignableReferee) {
            for (let j = 0; j < idxFirstAssignableReferee; j++) {
                this.assignableReferees.push(this.availableReferees[j]);
            }
        }
    }

    private areFieldsAvailable(): boolean {
        return this.availableFields.length > 0;
    }

    private isSomeFieldAssignable(): boolean {
        return this.assignableFields.length > 0 /*&& this.getAssignableField(game) !== undefined*/;
    }

    private getAssignableField(): Field {
        return this.assignableFields[0];
        // return this.assignableFields.find(field => {
        //     return game.getPlaces().every(gamePlace => {
        //         return this.assignedPlacesPerField[field.getId()].find(place => place === gamePlace.getPlace()) === undefined;
        //     })
        // });
    }

    private areRefereesAvailable(): boolean {
        return this.availableReferees.length > 0 &&
            (!this.config.getSelfReferee() || this.availableReferees.length > this.config.getNrOfCompetitorsPerGame());
    }

    private isSomeRefereeAssignable(game: Game): boolean {
        if (!this.config.getSelfReferee()) {
            return this.assignableReferees.length > 0;
        }
        return this.getAssignableReferee(game) !== undefined;
    }

    private getAssignableReferee(game: Game): PlanningReferee {
        if (!this.config.getSelfReferee()) {
            return this.assignableReferees[0];
        }
        return this.assignableReferees.find(assignableRef => {
            return !game.isParticipating(assignableRef.getPlace()) && this.isPlaceAssignable(assignableRef.getPlace())
                && (this.nrOfPoules === 1 || assignableRef.getPlace().getPoule() !== game.getPoule());
        });
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

    private isGameAssignable(game: Game, selfRefereeSamePouleCheck: boolean): boolean {
        if ( selfRefereeSamePouleCheck && this.nrOfPoules > 1
            && this.batch.games.some( gameIt => gameIt.getPoule() === game.getPoule() ) ) {
            return false;
        }
        if (this.areFieldsAvailable() && !this.isSomeFieldAssignable()) {
            return false;
        }
        if (this.areRefereesAvailable() && !this.isSomeRefereeAssignable(game)) {
            return false;
        }
        return this.areAllPlacesAssignable(this.getPlaces(game));
    }

    protected getPlaces(game: Game): Place[] {
        return game.getPlaces().map(gamePlace => gamePlace.getPlace());
    }

    protected areAllPlacesAssignable(places: Place[]): boolean {
        return places.every(place => this.isPlaceAssignable(place));
    }

    protected isPlaceAssignable(place: Place): boolean {
        return !this.hasPlace(this.batch.places, place);
    }

    protected hasPlace(places: Place[], placeToFind: Place): boolean {
        return places.find(placeIt => placeIt === placeToFind) !== undefined;
    }
}

interface Resources {
    games: Game[];
    poules: Poule[];
    places: Place[];
}
