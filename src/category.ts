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

    getNumber(): number {
        return this.number;
    }

    getRootRound(): Round {
        return this.rootRound;
    }
}
