import { Field } from './field';
import { League } from './league';
import { Referee } from './referee';
import { Season } from './season';

export class Competition {
    static readonly STATE_CREATED = 1;
    static readonly STATE_PUBLISHED = 2;

    protected id: number;
    protected league: League;
    protected season: Season;
    protected startDateTime: Date;
    protected state: number;
    protected referees: Referee[] = [];
    protected fields: Field[] = [];

    constructor(league: League, season: Season) {
        this.setLeague(league);
        this.setSeason(season);
        this.setState(Competition.STATE_CREATED);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getLeague(): League {
        return this.league;
    }

    setLeague(league: League): void {
        this.league = league;
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

    getStateDescription(): string {
        if (this.state === Competition.STATE_CREATED) {
            return 'aangemaakt';
        } else if (this.state === Competition.STATE_PUBLISHED) {
            return 'gepubliceerd';
        }

        return undefined;
    }

    getName(): string {
        return this.getLeague().getName() + ' ' + this.getSeason().getName();
    }

    getFields(): Field[] {
        return this.fields;
    }

    getField(number: number): Field {
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

    getReferee(initials: string): Referee {
        return this.referees.find(refereeIt => initials === refereeIt.getInitials());
    }

    removeReferee(referee: Referee) {
        const index = this.referees.indexOf(referee);
        if (index > -1) {
            this.referees.splice(index, 1);
        }
    }
}
