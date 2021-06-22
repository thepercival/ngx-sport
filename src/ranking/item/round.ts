import { CompetitionSport } from '../../competition/sport';
import { Place } from '../../place';
import { PlaceLocation } from '../../place/location';
import { PlacePerformance } from '../../place/performance';
import { PlaceSportPerformance } from '../../place/sportPerformance';
import { SportRoundRankingItem } from './round/sport';

export class RoundRankingItem {
    private rank: number = 1;
    private uniqueRank: number = 1;
    private cumulativeRank: number = 0;
    private sportItems: SportRoundRankingItem[] = [];
    private cumulativePerformance: PlacePerformance;

    constructor(protected place: Place) {
        this.cumulativePerformance = new PlacePerformance(place);
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

    getCumulativePerformance(): PlacePerformance {
        return this.cumulativePerformance;
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
        this.cumulativePerformance.addSportPerformace(item.getPerformance());
    }

    getSportItem(competitionSport: CompetitionSport): SportRoundRankingItem {
        const sportItem = this.sportItems.find((sportItemIt: SportRoundRankingItem) => sportItemIt.getCompetitionSport() === competitionSport);
        if (!sportItem) {
            throw new Error("sportItem could not be found");
        }
        return sportItem;
    }

    compareCumulativePerformances(roundRankingItem: RoundRankingItem): number {
        const otherPerformance = roundRankingItem.getCumulativePerformance();

        const cmpPoints = otherPerformance.getPoints() - this.cumulativePerformance.getPoints();
        if (cmpPoints !== 0) {
            return cmpPoints;
        }

        const cmpGames = this.cumulativePerformance.getGames() - otherPerformance.getGames();
        if (cmpGames !== 0) {
            return cmpGames;
        }

        const cmpDiff = otherPerformance.getDiff() - this.cumulativePerformance.getDiff();
        if (cmpDiff !== 0) {
            return cmpDiff;
        }

        const cmpScored = otherPerformance.getScored() - this.cumulativePerformance.getScored();
        if (cmpScored !== 0) {
            return cmpScored;
        }

        const cmpReceived = this.cumulativePerformance.getReceived() - otherPerformance.getReceived();
        if (cmpReceived !== 0) {
            return cmpReceived;
        }

        const cmpSubDiff = otherPerformance.getSubDiff() - this.cumulativePerformance.getSubDiff();
        if (cmpSubDiff !== 0) {
            return cmpSubDiff;
        }

        const cmpSubScored = otherPerformance.getSubScored() - this.cumulativePerformance.getSubScored();
        if (cmpSubScored !== 0) {
            return cmpSubScored;
        }

        return this.cumulativePerformance.getSubReceived() - otherPerformance.getSubReceived();
    }
}
