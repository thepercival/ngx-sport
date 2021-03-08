import { Place } from '../../../place';
import { PlaceLocation } from '../../../place/location';
import { RankedSportRoundItem } from './sportranked';

export class RankedRoundItem {
    private rank: number = 1;
    private uniqueRank: number = 1;
    private cumulativeRank: number = 0;
    private rankedSportRoundItems: RankedSportRoundItem[] = [];

    constructor(protected place: Place) {
    }

    getPlace(): Place {
        return this.place;
    }

    getPlaceLocation(): PlaceLocation {
        return this.place;
    }

    getCumulativeRank(): number {
        return this.cumulativeRank;
    }

    getUniqueRank(): number {
        return this.uniqueRank;
    }

    getRank(): number {
        return this.rank;
    }

    setRank(rank: number) {
        this.rank = rank;
    }

    setUniqueRank(rank: number) {
        this.uniqueRank = rank;
    }

    addSportRoundItem(item: RankedSportRoundItem) {
        this.rankedSportRoundItems.push(item);
        this.cumulativeRank += item.getRank();
    }
}
