import { CompetitionSport } from "../../competition/sport";
import { Place } from "../../place";
import { GameMode } from "../../planning/gameMode";
import { Poule } from "../../poule";
import { HorizontalPoule } from "../../poule/horizontal";
import { State } from "../../state";
import { RankedRoundItem } from "../item/round/ranked";
import { RankedSportRoundItem } from "../item/round/sportranked";
import { SportRoundRankingCalculator } from "./round/sport";
import { AgainstSportRoundRankingCalculator } from "./round/sport/against";
import { TogetherSportRoundRankingCalculator } from "./round/sport/together";

export class RoundRankingCalculator {
    protected gameStates: State[];

    constructor(
        gameStates?: State[]
    ) {
        this.gameStates = gameStates ?? [State.Finished];
    }

    protected getSportRoundRankingCalculator(competitionSport: CompetitionSport): SportRoundRankingCalculator {
        if (competitionSport.getSport().getGameMode() === GameMode.Against) {
            return new AgainstSportRoundRankingCalculator(competitionSport, this.gameStates);
        }
        return new TogetherSportRoundRankingCalculator(competitionSport, this.gameStates);
    }

    getItemsForPoule(poule: Poule): RankedRoundItem[] {
        return this.convertSportRoundRankingsToRoundItems(
            poule.getPlaces(),
            poule.getCompetition().getSports().map((competitionSport: CompetitionSport): RankedSportRoundItem[] => {
                return this.getSportRoundRankingCalculator(competitionSport).getItemsForPoule(poule);
            })
        );
    }

    getPlacesForHorizontalPoule(horizontalPoule: HorizontalPoule): Place[] {
        return this.getItemsForHorizontalPoule(horizontalPoule, true).map(rankingItem => {
            return rankingItem.getPlace();
        });
    }

    getPlaceLocationsForHorizontalPoule(horizontalPoule: HorizontalPoule): Place[] {
        return this.getPlacesForHorizontalPoule(horizontalPoule)
    }

    getItemsForHorizontalPoule(horizontalPoule: HorizontalPoule, checkOnSingleQualifyRule?: boolean): RankedRoundItem[] {
        return this.convertSportRoundRankingsToRoundItems(
            horizontalPoule.getPlaces(),
            horizontalPoule.getRound().getNumber().getCompetitionSports().map((competitionSport: CompetitionSport): RankedSportRoundItem[] => {
                return this.getSportRoundRankingCalculator(competitionSport).getItemsForHorizontalPoule(horizontalPoule, checkOnSingleQualifyRule);
            })
        );
    }

    getItemByRank(rankingItems: RankedRoundItem[], rank: number): RankedRoundItem | undefined {
        return rankingItems.find(rankingItemIt => rankingItemIt.getUniqueRank() === rank);
    }


    protected convertSportRoundRankingsToRoundItems(places: Place[], sportRoundRankings: (RankedSportRoundItem[])[]): RankedRoundItem[] {
        const map: RankedRoundItemMap = this.getRankedRoundItemMap(places, sportRoundRankings);
        const rankedRoundItems = places.map((place: Place): RankedRoundItem => map[place.getNewLocationId()]);
        return this.rankItems(rankedRoundItems);
    }

    protected getRankedRoundItemMap(places: Place[], sportRoundRankings: (RankedSportRoundItem[])[]): RankedRoundItemMap {
        const map: RankedRoundItemMap = {};
        places.forEach((place: Place) => map[place.getNewLocationId()] = new RankedRoundItem(place));
        sportRoundRankings.forEach((sportRoundRanking: RankedSportRoundItem[]) => {
            sportRoundRanking.forEach((sportRoundItem: RankedSportRoundItem) => {
                map[sportRoundItem.getPlace().getNewLocationId()].addSportRoundItem(sportRoundItem);
            });
        });
        return map;
    }

    protected rankItems(cumulativeRankedItems: RankedRoundItem[]): RankedRoundItem[] {
        cumulativeRankedItems.sort((a: RankedRoundItem, b: RankedRoundItem) => {
            if (a.getCumulativeRank() === b.getCumulativeRank()) {
                if (a.getPlace().getPouleNr() === b.getPlace().getPouleNr()) {
                    return a.getPlaceLocation().getPlaceNr() - b.getPlaceLocation().getPlaceNr();
                }
                return a.getPlace().getPouleNr() - b.getPlace().getPouleNr();
            }
            return a.getCumulativeRank() < b.getCumulativeRank() ? -1 : 1;
        });
        const rankedItems: RankedRoundItem[] = [];
        let nrOfIterations = 0;
        let rank = 0;
        let previousCumulativeRank = 0;
        let cumulativeRankedItem: RankedRoundItem | undefined;
        while (cumulativeRankedItem = cumulativeRankedItems.shift()) {
            if (previousCumulativeRank < cumulativeRankedItem.getCumulativeRank()) {
                rank++;
            }
            cumulativeRankedItem.setRank(rank);
            cumulativeRankedItem.setUniqueRank(++nrOfIterations);
            previousCumulativeRank = cumulativeRankedItem.getCumulativeRank();
            rankedItems.push(cumulativeRankedItem);
        }
        return rankedItems;
    }
}

export interface RankedRoundItemMap {
    [key: string]: RankedRoundItem;
}