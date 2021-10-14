import { Identifiable } from '../identifiable';
import { Period } from '../period';
import { Person } from '../person';
import { Team } from '../team';

export class Player extends Identifiable {
    protected id: number = 0;

    constructor(protected team: Team, protected person: Person, protected period: Period, protected line: number) {
        super();
        person.getPlayers().push(this);
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
