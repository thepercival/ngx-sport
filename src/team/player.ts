import { Period } from '../period';
import { Person } from '../person';
import { Team } from '../team';

export class Player extends Period {
    protected id: string | number = 0;

    constructor(protected team: Team, protected person: Person, start: Date, end: Date, protected line: number) {
        super(start, end);
        // person.getPlayers().push(this);
    }

    public getId(): string | number {
        return this.id;
    }

    public setId(id: string | number): void {
        this.id = id;
    }

    public getTeam(): Team {
        return this.team;
    }

    public getPerson(): Person {
        return this.person;
    }

    public getLine(): number {
        return this.line;
    }
}
