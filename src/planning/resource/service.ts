import { Field } from '../../field';
import { Game } from '../../game';
import { PoulePlace } from '../../pouleplace';
import { RoundNumberConfig } from '../../round/number/config';
import { PlanningReferee } from '../referee';
import { BlockedPeriod } from '../service';

export class PlanningResourceService {
    private assignedPoulePlaces: PoulePlace[] = [];
    private availableReferees: PlanningReferee[] = [];
    private assignableReferees: PlanningReferee[] = [];
    private availableFields: Field[] = [];
    private assignableFields: Field[] = [];
    private resourceBatch = 1;
    private blockedPeriod;

    constructor(
        private roundNumberConfig: RoundNumberConfig,
        private dateTime: Date
    ) {
    }

    setBlockedPeriod(blockedPeriod: BlockedPeriod) {
        this.blockedPeriod = blockedPeriod;
    }

    setFields(fields: Field[]) {
        this.availableFields = fields;
        this.fillAssignableFields();
    }

    /*setSelfReferees(poulePlaceReferees: PoulePlace[]) {
        this.referees = referees;
        this.areRefereesAssignable = referees.length > 0;
        this.fillAssignableReferees();
    }*/

    setReferees(referees: PlanningReferee[]) {
        this.availableReferees = referees;
        this.fillAssignableReferees();
    }

    getAssignableGame(gamesToProcess: Game[]): Game {
        return gamesToProcess.find(game => this.isGameAssignable(game));
    }

    assign(games: Game[]): Date {
        while (games.length > 0) {
            let game = this.getAssignableGame(games);
            if (game === undefined) {
                this.nextResourceBatch();
                game = this.getAssignableGame(games);
            }
            this.assignGame(game);
            games.splice(games.indexOf(game), 1);
            if (!this.areFieldsAvailable() && !this.areRefereesAvailable()) {
                this.nextResourceBatch();
            }
        }
        return this.getEndDateTime();
    }

    protected assignGame(game: Game) {
        // if (!this.fieldsAreAssignable() || !this.refereesAreAssignable()) {
        //     this.nextResourceBatch();
        // }
        // if (this.resourceBatch === 0) {
        //     this.resourceBatch = 1;
        // }
        game.setStartDateTime(this.getDateTime());
        game.setResourceBatch(this.resourceBatch);
        if (this.areFieldsAvailable()) {
            this.assignField(game);
        }
        this.assignPoulePlaces(game);
        if (this.areRefereesAvailable()) {
            this.assignReferee(game);
        }
        // if (!this.fieldsAreAssignable() || !this.refereesAreAssignable()) {
        //     this.resetPoulePlaces();
        // }
    }

    nextResourceBatch() {
        this.fillAssignableFields();
        this.fillAssignableReferees();
        this.resourceBatch++;
        this.setNextDateTime();
        this.resetPoulePlaces();
    }

    getEndDateTime(): Date {
        if (this.dateTime === undefined) {
            return undefined;
        }
        const endDateTime = new Date(this.dateTime.getTime());
        endDateTime.setMinutes(endDateTime.getMinutes() + this.roundNumberConfig.getMinutesBetweenGames());
        return endDateTime;
    }

    private assignPoulePlaces(game: Game) {
        game.getPoulePlaces().forEach(gamePoulePlace => this.assignedPoulePlaces.push(gamePoulePlace.getPoulePlace()));
    }

    protected assignReferee(game: Game) {
        const referee = this.getAssignableReferee(game);
        referee.assign(game);
        if (referee.isSelf()) {
            this.assignedPoulePlaces.push(referee.getPoulePlace());
        }
    }

    protected assignField(game: Game) {
        game.setField(this.assignableFields.shift());
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
        return this.assignableFields.length > 0;
    }

    private areRefereesAvailable(): boolean {
        return this.availableReferees.length > 0;
    }

    private isSomeRefereeAssignable(game: Game): boolean {
        if (!this.roundNumberConfig.getSelfReferee()) {
            return this.assignableReferees.length > 0;
        }
        return this.assignableReferees.some(assignableRef => {
            return !game.isParticipating(assignableRef.getPoulePlace());
        });
    }

    private getAssignableReferee(game: Game): PlanningReferee {
        if (!this.roundNumberConfig.getSelfReferee()) {
            return this.assignableReferees.shift();
        }
        const referee = this.assignableReferees.find(assignableRef => {
            return !game.isParticipating(assignableRef.getPoulePlace());
        });
        if (referee !== undefined) {
            this.assignableReferees.splice(this.assignableReferees.indexOf(referee), 1);
        }
        return referee;
    }

    private getDateTime(): Date {
        if (this.dateTime === undefined) {
            return undefined;
        }
        return new Date(this.dateTime.getTime());
    }

    private setNextDateTime() {
        if (this.dateTime === undefined) {
            return;
        }
        const add = this.roundNumberConfig.getMaximalNrOfMinutesPerGame() + this.roundNumberConfig.getMinutesBetweenGames();
        this.dateTime = this.addMinutes(this.dateTime, add);
    }

    protected addMinutes(dateTime: Date, minutes: number): Date {
        dateTime.setMinutes(dateTime.getMinutes() + minutes);
        if (this.blockedPeriod !== undefined && dateTime > this.blockedPeriod.start && dateTime < this.blockedPeriod.end) {
            dateTime = new Date(this.blockedPeriod.end.getTime());
        }
        return dateTime;
    }

    private isGameAssignable(game: Game): boolean {
        if (this.areFieldsAvailable() && !this.isSomeFieldAssignable()) {
            return false;
        }
        if (this.areRefereesAvailable() && !this.isSomeRefereeAssignable(game)) {
            return false;
        }
        return this.areAllPoulePlacesAssignable(this.getPoulePlaces(game));
    }

    protected getPoulePlaces(game: Game): PoulePlace[] {
        return game.getPoulePlaces().map(gamePoulePlace => gamePoulePlace.getPoulePlace());
    }

    protected areAllPoulePlacesAssignable(poulePlaces: PoulePlace[]): boolean {
        return poulePlaces.every(poulePlace => this.isPoulePlacesAssignable(poulePlace));
    }

    protected isPoulePlacesAssignable(poulePlace: PoulePlace): boolean {
        return !this.hasPoulePlace(this.assignedPoulePlaces, poulePlace);
    }

    protected hasPoulePlace(poulePlaces: PoulePlace[], poulePlaceToFind: PoulePlace): boolean {
        return poulePlaces.find(poulePlaceIt => poulePlaceIt === poulePlaceToFind) !== undefined;
    }

    private resetPoulePlaces() {
        this.assignedPoulePlaces = [];
    }
}
