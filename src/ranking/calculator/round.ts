import { CompetitionSport } from "../../competition/sport";
import { Place } from "../../place";
import { PlaceLocation } from "../../place/location";
import { GameMode } from "../../planning/gameMode";
import { Poule } from "../../poule";
import { HorizontalPoule } from "../../poule/horizontal";
import { MultipleQualifyRule } from "../../qualify/rule/multiple";
import { AgainstSportVariant } from "../../sport/variant/against";
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
        if (competitionSport.getVariant() instanceof AgainstSportVariant) {
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

    getPlacesForMultipleRule(multipleRule: MultipleQualifyRule): Place[] {
        return this.getItemsForHorizontalPoule(multipleRule.getFromHorizontalPoule()).map((rankingItem: RoundRankingItem) => {
            return rankingItem.getPlace();
        });
    }

    getPlaceLocationsForMultipleRule(multipleRule: MultipleQualifyRule): PlaceLocation[] {
        return this.getPlacesForMultipleRule(multipleRule)
    }

    getPlacesForHorizontalPoule(horizontalPoule: HorizontalPoule): Place[] {
        return this.getItemsForHorizontalPoule(horizontalPoule).map((rankingItem: RoundRankingItem) => {
            return rankingItem.getPlace();
        });
    }

    /*getItemsForHorizontalPoule(horizontalPoule: HorizontalPoule): RoundRankingItem[] {
        return this.convertSportRoundRankingsToRoundItems(
            horizontalPoule.getPlaces(),
            horizontalPoule.getRound().getNumber().getCompetitionSports().map((competitionSport: CompetitionSport): SportRoundRankingItem[] => {
                const sportCalculator = this.getSportRoundRankingCalculator(competitionSport);
                return sportCalculator.getItemsForHorizontalPoule(horizontalPoule);
            })
        );
    }*/

    /*getPlaceLocationsForMultipleRule(multipleRule: MultipleQualifyRule): PlaceLocation[] {
        const sportRoundRankingItems = this.getItemsForHorizontalPoule(multipleRule.getFromHorizontalPoule());
        return sportRoundRankingItems.map((rankingItem: SportRoundRankingItem): PlaceLocation => {
            return rankingItem.getPlaceLocation();
        });
    }

    getPlacesForMultipleRule(multipleRule: MultipleQualifyRule): Place[] {
        const fromRound = multipleRule.getFromHorizontalPoule().getRound();
        const sportRoundRankingItems = this.getItemsForHorizontalPoule(multipleRule.getFromHorizontalPoule());
        return sportRoundRankingItems.map((rankingSportItem: SportRoundRankingItem): Place => {
            return fromRound.getPlace(rankingSportItem.getPlaceLocation());
        });
    }*/

    getItemsForHorizontalPoule(horizontalPoule: HorizontalPoule): RoundRankingItem[] {
        const rankingItems: RoundRankingItem[] = [];
        horizontalPoule.getPlaces().forEach((place: Place) => {
            const pouleRankingItems: RoundRankingItem[] = this.getItemsForPoule(place.getPoule());
            const pouleRankingItem = this.getItemByRank(pouleRankingItems, place.getPlaceNr());
            if (pouleRankingItem === undefined) {
                return;
            }
            rankingItems.push(pouleRankingItem);
        });

        return this.rankItems(rankingItems);
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
                const cmp = a.compareCumulativePerformances(b)
                if (cmp === 0) {
                    if (a.getPlace().getPouleNr() === b.getPlace().getPouleNr()) {
                        return a.getPlaceLocation().getPlaceNr() - b.getPlaceLocation().getPlaceNr();
                    }
                    return a.getPlace().getPouleNr() - b.getPlace().getPouleNr();
                }
                return cmp;
            }
            return a.getCumulativeRank() < b.getCumulativeRank() ? -1 : 1;
        });
        const roundRankingItems: RoundRankingItem[] = [];
        let nrOfIterations = 0;
        let rank = 0;
        let previousCumulativeRankItem: RoundRankingItem | undefined;
        let cumulativeRoundRankingItem: RoundRankingItem | undefined;
        while (cumulativeRoundRankingItem = cumulativeRoundRankingItems.shift()) {
            if (previousCumulativeRankItem === undefined || previousCumulativeRankItem.getCumulativeRank() < cumulativeRoundRankingItem.getCumulativeRank() ||
                previousCumulativeRankItem.getCumulativeRank() === cumulativeRoundRankingItem.getCumulativeRank()
                && cumulativeRoundRankingItem.compareCumulativePerformances(previousCumulativeRankItem) < 0) {
                rank++;
            }
            cumulativeRoundRankingItem.setRank(rank, ++nrOfIterations);
            previousCumulativeRankItem = cumulativeRoundRankingItem;
            roundRankingItems.push(cumulativeRoundRankingItem);
        }
        return roundRankingItems;
    }
}

export interface RoundRankingItemMap {
    [key: string]: RoundRankingItem;
}