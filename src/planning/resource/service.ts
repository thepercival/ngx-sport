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
    private currentGameStartDate: Date;
    private nrOfPoules: number;
    // private assignedPoulePlacesPerField = {};

    constructor(
        private roundNumberConfig: RoundNumberConfig,
        dateTime: Date
    ) {
        this.currentGameStartDate = this.cloneDateTime(dateTime);
        if (this.roundNumberConfig.getSelfReferee()) {
            this.nrOfPoules = this.roundNumberConfig.getRoundNumber().getPoules().length;
        }
    }

    setBlockedPeriod(blockedPeriod: BlockedPeriod) {
        this.blockedPeriod = blockedPeriod;
    }

    setFields(fields: Field[]) {
        this.availableFields = fields;
        this.fillAssignableFields();
        // fields.forEach(field => {
        //     this.assignedPoulePlacesPerField[field.getId()] = [];
        // });

    }

    setReferees(referees: PlanningReferee[]) {
        this.availableReferees = referees;
        if (this.roundNumberConfig.getSelfReferee()) {
            this.availableReferees.reverse();
        }
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
        }
        return this.getEndDateTime();
    }

    protected assignGame(game: Game) {
        game.setStartDateTime(this.cloneDateTime(this.currentGameStartDate));
        game.setResourceBatch(this.resourceBatch);
        if (this.areFieldsAvailable()) {
            this.assignField(game);
        }
        this.assignPoulePlaces(game);
        if (this.areRefereesAvailable()) {
            this.assignReferee(game);
        }
    }

    nextResourceBatch() {
        this.fillAssignableFields();
        this.fillAssignableReferees();
        this.resourceBatch++;
        this.setNextGameStartDateTime();
        this.resetPoulePlaces();
    }

    private getEndDateTime(): Date {
        if (this.currentGameStartDate === undefined) {
            return undefined;
        }
        const endDateTime = new Date(this.currentGameStartDate.getTime());
        endDateTime.setMinutes(endDateTime.getMinutes() + this.roundNumberConfig.getMaximalNrOfMinutesPerGame());
        return endDateTime;
    }

    private assignPoulePlaces(game: Game) {
        game.getPoulePlaces().forEach(gamePoulePlace => {
            const poulePlace = gamePoulePlace.getPoulePlace();
            this.assignedPoulePlaces.push(poulePlace);
            // if (game.getField() !== undefined) {
            //     this.assignedPoulePlacesPerField[game.getField().getId()].push(poulePlace);
            // }
        });
    }

    protected assignReferee(game: Game) {
        const referee = this.getAssignableReferee(game);
        if (referee === undefined) {
            return;
        }
        this.assignableReferees.splice(this.assignableReferees.indexOf(referee), 1);
        referee.assign(game);
        if (referee.isSelf()) {
            this.assignedPoulePlaces.push(referee.getPoulePlace());
        }
    }

    protected assignField(game: Game) {
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
        if (this.roundNumberConfig.getSelfReferee()) {
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

    private isSomeFieldAssignable(game: Game): boolean {
        return this.assignableFields.length > 0 /*&& this.getAssignableField(game) !== undefined*/;
    }

    private getAssignableField(): Field {
        return this.assignableFields[0];
        // return this.assignableFields.find(field => {
        //     return game.getPoulePlaces().every(gamePoulePlace => {
        //         return this.assignedPoulePlacesPerField[field.getId()].find(poulePlace => poulePlace === gamePoulePlace.getPoulePlace()) === undefined;
        //     })
        // });
    }

    private areRefereesAvailable(): boolean {
        return this.availableReferees.length > 0 &&
            (!this.roundNumberConfig.getSelfReferee() || this.availableReferees.length > this.roundNumberConfig.getNrOfCompetitorsPerGame());
    }

    private isSomeRefereeAssignable(game: Game): boolean {
        if (!this.roundNumberConfig.getSelfReferee()) {
            return this.assignableReferees.length > 0;
        }
        return this.getAssignableReferee(game) !== undefined;
    }

    private getAssignableReferee(game: Game): PlanningReferee {
        if (!this.roundNumberConfig.getSelfReferee()) {
            return this.assignableReferees[0];
        }
        return this.assignableReferees.find(assignableRef => {
            return !game.isParticipating(assignableRef.getPoulePlace()) && this.isPoulePlaceAssignable(assignableRef.getPoulePlace())
                && (this.nrOfPoules === 1 || assignableRef.getPoulePlace().getPoule() !== game.getPoule());
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
        const add = this.roundNumberConfig.getMaximalNrOfMinutesPerGame() + this.roundNumberConfig.getMinutesBetweenGames();
        this.currentGameStartDate = this.addMinutes(this.currentGameStartDate, add);
    }

    protected addMinutes(dateTime: Date, minutes: number): Date {
        dateTime.setMinutes(dateTime.getMinutes() + minutes);
        if (this.blockedPeriod !== undefined && dateTime > this.blockedPeriod.start && dateTime < this.blockedPeriod.end) {
            dateTime = new Date(this.blockedPeriod.end.getTime());
        }
        return dateTime;
    }

    /** bij echte scheidsrechters mag isGameAssignable wel van scheidsrechters afhangen  */
    private isGameAssignable(game: Game): boolean {
        if (this.areFieldsAvailable() && !this.isSomeFieldAssignable(game)) {
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
        return poulePlaces.every(poulePlace => this.isPoulePlaceAssignable(poulePlace));
    }

    protected isPoulePlaceAssignable(poulePlace: PoulePlace): boolean {
        return !this.hasPoulePlace(this.assignedPoulePlaces, poulePlace);
    }

    protected hasPoulePlace(poulePlaces: PoulePlace[], poulePlaceToFind: PoulePlace): boolean {
        return poulePlaces.find(poulePlaceIt => poulePlaceIt === poulePlaceToFind) !== undefined;
    }

    private resetPoulePlaces() {
        this.assignedPoulePlaces = [];
    }
}
