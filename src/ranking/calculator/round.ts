import { CompetitionSport } from "../../competition/sport";
import { Place } from "../../place";
import { GameMode } from "../../planning/gameMode";
import { Poule } from "../../poule";
import { HorizontalPoule } from "../../poule/horizontal";
import { State } from "../../state";
import { RoundRankingItem } from "../item/round";
import { SportRoundRankingItem } from "../item/round/sport";
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

    getItemsForPoule(poule: Poule): RoundRankingItem[] {
        return this.convertSportRoundRankingsToRoundItems(
            poule.getPlaces(),
            poule.getCompetition().getSports().map((competitionSport: CompetitionSport): SportRoundRankingItem[] => {
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

    getItemsForHorizontalPoule(horizontalPoule: HorizontalPoule, checkOnSingleQualifyRule?: boolean): RoundRankingItem[] {
        return this.convertSportRoundRankingsToRoundItems(
            horizontalPoule.getPlaces(),
            horizontalPoule.getRound().getNumber().getCompetitionSports().map((competitionSport: CompetitionSport): SportRoundRankingItem[] => {
                return this.getSportRoundRankingCalculator(competitionSport).getItemsForHorizontalPoule(horizontalPoule, checkOnSingleQualifyRule);
            })
        );
    }

    getItemByRank(rankingItems: RoundRankingItem[], rank: number): RoundRankingItem | undefined {
        return rankingItems.find(rankingItemIt => rankingItemIt.getUniqueRank() === rank);
    }


    protected convertSportRoundRankingsToRoundItems(places: Place[], sportRoundRankings: (SportRoundRankingItem[])[]): RoundRankingItem[] {
        const map: RoundRankingItemMap = this.getRoundRankingItemMap(places, sportRoundRankings);
        const roundRankingItems = places.map((place: Place): RoundRankingItem => map[place.getRoundLocationId()]);
        return this.rankItems(roundRankingItems);
    }

    protected getRoundRankingItemMap(places: Place[], sportRoundRankings: (SportRoundRankingItem[])[]): RoundRankingItemMap {
        const map: RoundRankingItemMap = {};
        places.forEach((place: Place) => map[place.getRoundLocationId()] = new RoundRankingItem(place));
        sportRoundRankings.forEach((sportRoundRanking: SportRoundRankingItem[]) => {
            sportRoundRanking.forEach((sportRoundItem: SportRoundRankingItem) => {
                map[sportRoundItem.getPlaceLocation().getRoundLocationId()].addSportRoundItem(sportRoundItem);
            });
        });
        return map;
    }

    protected rankItems(cumulativeRoundRankingItems: RoundRankingItem[]): RoundRankingItem[] {
        cumulativeRoundRankingItems.sort((a: RoundRankingItem, b: RoundRankingItem) => {
            if (a.getCumulativeRank() === b.getCumulativeRank()) {
                if (a.getPlace().getPouleNr() === b.getPlace().getPouleNr()) {
                    return a.getPlaceLocation().getPlaceNr() - b.getPlaceLocation().getPlaceNr();
                }
                return a.getPlace().getPouleNr() - b.getPlace().getPouleNr();
            }
            return a.getCumulativeRank() < b.getCumulativeRank() ? -1 : 1;
        });
        const roundRankingItems: RoundRankingItem[] = [];
        let nrOfIterations = 0;
        let rank = 0;
        let previousCumulativeRank = 0;
        let cumulativeRoundRankingItem: RoundRankingItem | undefined;
        while (cumulativeRoundRankingItem = cumulativeRoundRankingItems.shift()) {
            if (previousCumulativeRank < cumulativeRoundRankingItem.getCumulativeRank()) {
                rank++;
            }
            cumulativeRoundRankingItem.setRank(rank, ++nrOfIterations);
            previousCumulativeRank = cumulativeRoundRankingItem.getCumulativeRank();
            roundRankingItems.push(cumulativeRoundRankingItem);
        }
        return roundRankingItems;
    }
}

export interface RoundRankingItemMap {
    [key: string]: RoundRankingItem;
}