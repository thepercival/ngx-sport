/**
 * Created by coen on 16-2-17.
 */
import { Association } from './association';
import { Competition } from './competition';
import { Field } from './field';
import { Referee } from './referee';
import { Season } from './season';


export class Competitionseason {
    static readonly STATE_CREATED = 1;
    static readonly STATE_PUBLISHED = 2;

    protected id: number;
    protected association: Association;
    protected competition: Competition;
    protected season: Season;
    protected sport: string;
    protected startDateTime: Date;
    protected state: number;
    protected referees: Referee[] = [];
    protected fields: Field[] = [];

    // constructor
    constructor(association: Association, competition: Competition, season: Season) {
        this.setAssociation(association);
        this.setCompetition(competition);
        this.setSeason(season);
        this.setState(Competitionseason.STATE_CREATED);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getAssociation(): Association {
        return this.association;
    }

    setAssociation(association: Association): void {
        this.association = association;
    }

    getCompetition(): Competition {
        return this.competition;
    }

    setCompetition(competition: Competition): void {
        this.competition = competition;
    }

    getSeason(): Season {
        return this.season;
    }

    setSeason(season: Season): void {
        this.season = season;
    }

    getStartDateTime(): Date {
        return this.startDateTime;
    }

    setStartDateTime(dateTime: Date): void {
        this.startDateTime = dateTime;
    }

    getState(): number {
        return this.state;
    }

    setState(state: number): void {
        this.state = state;
    }

    getSport(): string {
        return this.sport;
    }

    setSport(sport: string): void {
        this.sport = sport;
    }

    getStateDescription(): string {
        if (this.state === Competitionseason.STATE_CREATED) {
            return 'aangemaakt';
        } else if (this.state === Competitionseason.STATE_PUBLISHED) {
            return 'gepubliceerd';
        }

        return undefined;
    }

    getName(): string {
        return this.getCompetition().getName() + ' ' + this.getSeason().getName();
    }

    getFields(): Field[] {
        return this.fields;
    }

    getFieldByNumber(number: number): Field {
        return this.fields.find(fieldIt => number === fieldIt.getNumber());
    }

    removeField(field: Field) {
        const index = this.fields.indexOf(field);
        if (index > -1) {
            this.fields.splice(index, 1);
        }
    }

    getReferees(): Referee[] {
        return this.referees;
    }

    getRefereeByNumber(number: number): Referee {
        return this.referees.find(refereeIt => number === refereeIt.getNumber());
    }

    removeReferee(referee: Referee) {
        const index = this.referees.indexOf(referee);
        if (index > -1) {
            this.referees.splice(index, 1);
        }
    }
}
