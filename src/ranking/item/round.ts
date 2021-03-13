import { CompetitionSport } from '../../competition/sport';
import { Place } from '../../place';
import { PlaceLocation } from '../../place/location';
import { SportRoundRankingItem } from './round/sport';

export class RoundRankingItem {
    private rank: number = 1;
    private uniqueRank: number = 1;
    private cumulativeRank: number = 0;
    private sportItems: SportRoundRankingItem[] = [];

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

    setRank(rank: number, uniqueRank: number) {
        this.rank = rank;
        this.uniqueRank = uniqueRank;
    }

    addSportRoundItem(item: SportRoundRankingItem) {
        this.sportItems.push(item);
        this.cumulativeRank += item.getRank();
    }

    getSportItem(competitionSport: CompetitionSport): SportRoundRankingItem {
        const sportItem = this.sportItems.find((sportItemIt: SportRoundRankingItem) => sportItemIt.getCompetitionSport() === competitionSport);
        if (!sportItem) {
            throw new Error("sportItem could not be found");
        }
        return sportItem;
    }
}
