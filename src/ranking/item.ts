import { PoulePlace } from '../pouleplace';

export class RankingItem {
    constructor(
        private uniqueRank: number,
        private rank: number,
        private poulePlace?: PoulePlace
    ) {
    }

    getUniqueRank(): number {
        return this.uniqueRank;
    }

    getRank(): number {
        return this.rank;
    }

    getPoulePlace(): PoulePlace {
        return this.poulePlace;
    }

    getPoulePlaceForRank(): PoulePlace {
        return this.poulePlace.getPoule().getPlace(this.getUniqueRank());
    }

    isSpecified(): boolean {
        return this.poulePlace !== undefined;
    }
}
