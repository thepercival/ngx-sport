import { Period } from '../period';
import { Person } from '../person';
import { Team } from '../team';

export class Player {
    protected id: number = 0;

    constructor(protected team: Team, protected person: Person, protected period: Period, protected line: number) {
        person.getPlayers().push(this);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    public getTeam(): Team {
        return this.team;
    }

    public getPerson(): Person {
        return this.person;
    }

    public getPeriod(): Period {
        return this.period;
    }

    public getLine(): number {
        return this.line;
    }
}
