import { PlaceLocation } from '../../../place/location';
import { Place } from '../../../place';
import { UnrankedRoundItem } from './unranked';

export class RankedSportRoundItem {
    constructor(private unranked: UnrankedRoundItem, private uniqueRank: number, private rank: number
    ) {
    }

    getUniqueRank(): number {
        return this.uniqueRank;
    }

    getRank(): number {
        return this.rank;
    }

    getPlaceLocation(): PlaceLocation {
        return this.unranked.getPlaceLocation();
    }

    getUnranked(): UnrankedRoundItem {
        return this.unranked;
    }

    getPlace(): Place {
        const place = this.unranked.getRound().getPlace(this.getPlaceLocation());
        if (!place) {
            throw new Error("rankedrounditem should have a place");
        }
        return place;
    }
}

