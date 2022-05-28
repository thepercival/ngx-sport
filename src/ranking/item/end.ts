import { StartLocation } from '../../competitor/startLocation';

export class EndRankingItem {
    constructor(private uniqueRank: number, private rank: number, private startLocation?: StartLocation | undefined) {
    }

    getUniqueRank(): number {
        return this.uniqueRank;
    }

    getRank(): number {
        return this.rank;
    }

    getStartLocation(): StartLocation | undefined {
        return this.startLocation;
    }
}
