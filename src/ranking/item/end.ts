import { PlaceLocation } from '../../place/location';

export class EndRankingItem {
    constructor(private uniqueRank: number, private rank: number, private placeLocation?: PlaceLocation) {
    }

    getUniqueRank(): number {
        return this.uniqueRank;
    }

    getRank(): number {
        return this.rank;
    }

    getStartPlaceLocation(): PlaceLocation | undefined {
        return this.placeLocation;
    }
}
