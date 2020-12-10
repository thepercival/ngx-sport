import { Period } from './period';
import { Team } from './team';
import { Player } from './team/player';

export class Person {
    protected id: string | number = 0;
    protected imageUrl: string | undefined;
    protected players: Player[] = [];

    constructor(protected firstName: string, protected nameInsertion: string | undefined, protected lastName: string) {

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

    getImageUrl(): string | undefined {
        return this.imageUrl;
    }

    setImageUrl(imageUrl: string): void {
        this.imageUrl = imageUrl;
    }

    public getPlayers(team?: Team, period?: Period, line?: number): Player[] {
        const filters: { (player: Player): boolean; }[] = [];
        if (team) {
            filters.push((player: Player) => player.getTeam() === team);
        }
        if (period) {
            filters.push((player: Player) => player.getPeriod().overlaps(period));
        }
        if (line) {
            filters.push((player: Player) => player.getLine() === line);
        }
        if (filters.length === 0) {
            return this.players;
        }
        return this.players.filter((player: Player): boolean => {
            return filters.every(filter => filter(player));
        });
    }

    public getPlayer(team: Team, date?: Date): Player | undefined {
        const checkDate = date ? date : new Date();
        const filters: { (player: Player): boolean; }[] = [
            (player: Player) => player.getTeam() === team,
            (player: Player) => player.getPeriod().isIn(checkDate)
        ]
        return this.players.find((player: Player): boolean => {
            return filters.every(filter => filter(player));
        });
    }
}
