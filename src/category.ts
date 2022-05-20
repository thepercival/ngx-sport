import { Identifiable } from './identifiable';
import { Competition } from './competition';
import { Round } from './qualify/group';

export class Category extends Identifiable {

    public static readonly DefaultName = 'standaard';

    constructor(
        protected competition: Competition,
        protected name: string,
        private number: number,
        private rootRound: Round) {
        super();

    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getNumber(): number {
        return this.number;
    }

    setNumber(number: number): void {
        this.number = number;
    }

    getRootRound(): Round {
        return this.rootRound;
    }
}
