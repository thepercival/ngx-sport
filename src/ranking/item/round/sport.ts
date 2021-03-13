import { PlaceLocation } from '../../../place/location';
import { CompetitionSport } from '../../../competition/sport';
import { PlaceSportPerformance } from '../../../place/sportPerformance';

export class SportRoundRankingItem {
    constructor(private performance: PlaceSportPerformance, private uniqueRank: number, private rank: number
    ) {
    }

    getUniqueRank(): number {
        return this.uniqueRank;
    }

    getRank(): number {
        return this.rank;
    }

    getCompetitionSport(): CompetitionSport {
        return this.performance.getCompetitionSport();
    }

    getPlaceLocation(): PlaceLocation {
        return this.performance.getPlaceLocation();
    }

    getPerformance(): PlaceSportPerformance {
        return this.performance;
    }


}

