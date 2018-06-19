import { PoulePlace } from '../pouleplace';

export class RankingItem {
    constructor(
        private rank: number,
        private poulePlace?: PoulePlace
    ) {
    }

    getRank(): number {
        return this.rank;
    }

    getPoulePlace(): PoulePlace {
        return this.poulePlace;
    }

    isSpecified(): boolean {
        return this.poulePlace !== undefined;
    }
}
