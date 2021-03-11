import { CompetitionSport } from '../../../competition/sport';
import { Place } from '../../../place';
import { PlaceLocation } from '../../../place/location';
import { RankedSportRoundItem } from './sportranked';

export class RankedRoundItem {
    private rank: number = 1;
    private uniqueRank: number = 1;
    private cumulativeRank: number = 0;
    private sportItems: RankedSportRoundItem[] = [];

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

    addSportRoundItem(item: RankedSportRoundItem) {
        this.sportItems.push(item);
        this.cumulativeRank += item.getRank();
    }

    getSportItem(competitionSport: CompetitionSport): RankedSportRoundItem {
        const sportItem = this.sportItems.find((sportItemIt: RankedSportRoundItem) => sportItemIt.getCompetitionSport() === competitionSport);
        if (!sportItem) {
            throw new Error("sportItem could not be found");
        }
        return sportItem;
    }
}
