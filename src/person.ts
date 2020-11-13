import { Player } from './team/player';

export class Person {
    protected id: string | number = 0;
    protected players: Player[] = [];

    constructor(protected firstName: string, protected nameInsertion: string, protected lastName: string) {

    }

    getId(): string | number {
        return this.id;
    }

    setId(id: string | number): void {
        this.id = id;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public getNameInsertion(): string {
        return this.nameInsertion;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public getName(): string {
        let name = this.firstName.substr(0, 1);
        if (this.nameInsertion?.length > 0) {
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

    public getPlayers(): Player[] {
        return this.players;
    }

    public getPlayer(date?: Date): Player | undefined {
        const searchDate = date ? date : new Date();
        return this.getPlayers().find(player => player.getPeriod().isIn(searchDate))
    }
}
