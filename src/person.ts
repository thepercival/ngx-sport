import { Identifiable } from './identifiable';
import { Period } from './period';
import { Team } from './team';
import { Player } from './team/player';

export class Person extends Identifiable {
    // protected players: Player[] = [];

    constructor(protected firstName: string, protected nameInsertion: string | undefined, protected lastName: string) {
        super();
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public getNameInsertion(): string | undefined {
        return this.nameInsertion;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public getName(): string {
        let name = this.firstName.substr(0, 1);
        if (this.nameInsertion) {
            if (name.length > 0) {
                name += " ";
            }
            name += this.nameInsertion;
        }
        if (this.lastName?.length > 0) {
            if (name.length > 0) {
                name += " ";
            }
            name += this.lastName;
        }
        return name;
    }
}
