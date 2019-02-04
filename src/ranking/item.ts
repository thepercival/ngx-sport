import { PoulePlace } from '../pouleplace';

export class RankingItem {
    constructor(
        private rank: number,
        private rankExt: number,
        private poulePlace?: PoulePlace
    ) {
    }

    getRank(): number {
        return this.rank;
    }

    getRankExt(): number {
        return this.rankExt;
    }

    getPoulePlace(): PoulePlace {
        return this.poulePlace;
    }

    isSpecified(): boolean {
        return this.poulePlace !== undefined;
    }
}
