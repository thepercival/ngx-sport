import { Field } from '../../field';
import { Game } from '../../game';
import { PoulePlace } from '../../pouleplace';
import { PlanningReferee } from '../referee';
import { BlockedPeriod } from '../service';

export class PlanningResourceService {
    private poulePlaces: PoulePlace[] = [];
    private fields: Field[] = [];
    private referees: PlanningReferee[] = [];
    private assignableFields: Field[] = [];
    private areFieldsAssignable: boolean;
    private assignableReferees: PlanningReferee[] = [];
    private areRefereesAssignable: boolean;
    private resourceBatch = 0;
    private blockedPeriod;

    constructor(
        private dateTime: Date,
        private maximalNrOfMinutesPerGame: number,
        private nrOfMinutesBetweenGames: number
    ) {
    }

    setBlockedPeriod(blockedPeriod: BlockedPeriod) {
        this.blockedPeriod = blockedPeriod;
    }

    setFields(fields: Field[]) {
        this.fields = fields;
        this.areFieldsAssignable = fields.length > 0;
        this.fillAssignableFields();
    }

    /*setSelfReferees(poulePlaceReferees: PoulePlace[]) {
        this.referees = referees;
        this.areRefereesAssignable = referees.length > 0;
        this.fillAssignableReferees();
    }*/

    setReferees(referees: PlanningReferee[]) {
        this.referees = referees;
        this.areRefereesAssignable = referees.length > 0;
        this.fillAssignableReferees();
    }

    private fillAssignableFields() {
        if (this.assignableFields.length >= this.fields.length) {
            return;
        }
        if (this.assignableFields.length === 0) {
            this.assignableFields = this.fields.slice(0);
            return;
        }
        const lastAssignableField = this.assignableFields[this.assignableFields.length - 1];
        const idxLastAssignableField = this.fields.indexOf(lastAssignableField);
        const firstAssignableField = this.assignableFields[0];
        const idxFirstAssignableField = this.fields.indexOf(firstAssignableField);
        const endIndex = idxFirstAssignableField > idxLastAssignableField ? idxFirstAssignableField : this.fields.length;
        for (let i = idxLastAssignableField + 1; i < endIndex; i++) {
            this.assignableFields.push(this.fields[i]);
        }
        if (idxFirstAssignableField <= idxLastAssignableField) {
            for (let j = 0; j < idxFirstAssignableField; j++) {
                this.assignableFields.push(this.fields[j]);
            }
        }
    }

    private fillAssignableReferees() {
        if (this.assignableReferees.length >= this.referees.length) {
            return;
        }
        if (this.assignableReferees.length === 0) {
            this.assignableReferees = this.referees.slice(0);
            return;
        }
        const lastAssignableReferee = this.assignableReferees[this.assignableReferees.length - 1];
        const idxLastAssignableReferee = this.referees.indexOf(lastAssignableReferee);
        const firstAssignableReferee = this.assignableReferees[0];
        const idxFirstAssignableReferee = this.referees.indexOf(firstAssignableReferee);
        const endIndex = idxFirstAssignableReferee > idxLastAssignableReferee ? idxFirstAssignableReferee : this.referees.length;
        for (let i = idxLastAssignableReferee + 1; i < endIndex; i++) {
            this.assignableReferees.push(this.referees[i]);
        }
        if (idxFirstAssignableReferee <= idxLastAssignableReferee) {
            for (let j = 0; j < idxFirstAssignableReferee; j++) {
                this.assignableReferees.push(this.referees[j]);
            }
        }
    }

    getAssignableGame(gamesToProcess: Game[]): Game {
        return gamesToProcess.find(game => {
            return this.isGameAssignable(game);
        });
    }

    assign(game: Game) {
        if (this.fieldsOrRefereesNotAssignable()) {
            this.nextResourceBatch();
        }
        if (this.resourceBatch === 0) {
            this.resourceBatch++;
        }
        game.setStartDateTime(this.getDateTime());
        game.setResourceBatch(this.resourceBatch);
        if (this.areFieldsAssignable) {
            game.setField(this.assignableFields.shift());
        }
        if (this.areRefereesAssignable) {
            this.assignableReferees.shift().assign(game);
        }
        this.addPoulePlaces(game);

        if (this.fieldsOrRefereesNotAssignable()) {
            this.resetPoulePlaces();
        }
    }

    fieldsOrRefereesNotAssignable() {
        return ((this.areFieldsAssignable === false && this.areRefereesAssignable === false)
            || (this.areFieldsAssignable && this.fields.length > 0 && this.assignableFields.length === 0)
            || (this.areRefereesAssignable && this.referees.length > 0 && this.assignableReferees.length === 0));
    }

    nextResourceBatch() {
        this.fillAssignableFields();
        this.fillAssignableReferees();
        this.resourceBatch++;
        this.setNextDateTime();
        this.resetPoulePlaces();
    }

    getDateTime(): Date {
        if (this.dateTime === undefined) {
            return undefined;
        }
        return new Date(this.dateTime.getTime());
    }

    getEndDateTime(): Date {
        if (this.dateTime === undefined) {
            return undefined;
        }
        const endDateTime = new Date(this.dateTime.getTime());
        endDateTime.setMinutes(endDateTime.getMinutes() + this.maximalNrOfMinutesPerGame);
        return endDateTime;
    }

    setNextDateTime() {
        if (this.dateTime === undefined) {
            return;
        }
        this.dateTime = this.addMinutes(this.dateTime, this.maximalNrOfMinutesPerGame + this.nrOfMinutesBetweenGames);
    }

    protected addMinutes(dateTime: Date, minutes: number): Date {
        dateTime.setMinutes(dateTime.getMinutes() + minutes);
        if (this.blockedPeriod !== undefined && dateTime > this.blockedPeriod.start && dateTime < this.blockedPeriod.end) {
            dateTime = new Date(this.blockedPeriod.end.getTime());
        }
        return dateTime;
    }

    private isGameAssignable(game: Game) {
        return game.getPoulePlaces().every(gamePoulePlace => !this.isPoulePlaceAssigned(gamePoulePlace.getPoulePlace()));
    }

    protected isPoulePlaceAssigned(poulePlace: PoulePlace) {
        return this.poulePlaces.find(poulePlaceIt => poulePlaceIt === poulePlace) !== undefined;
    }

    private resetPoulePlaces() {
        this.poulePlaces = [];
    }

    private addPoulePlaces(game: Game) {
        game.getPoulePlaces().forEach(gamePoulePlace => this.poulePlaces.push(gamePoulePlace.getPoulePlace()));
    }
}
