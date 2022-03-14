import { CompetitionSport } from "../../competition/sport";
import { GameState } from "../../game/state";
import { Place } from "../../place";
import { PlaceLocation } from "../../place/location";
import { Poule } from "../../poule";
import { HorizontalPoule } from "../../poule/horizontal";
import { MultipleQualifyRule } from "../../qualify/rule/multiple";
import { AgainstVariant } from "../../sport/variant/against";
import { RoundRankingItem } from "../item/round";
import { SportRoundRankingItem } from "../item/round/sport";
import { Cumulative } from "./cumulative";
import { SportRoundRankingCalculator } from "./round/sport";
import { AgainstSportRoundRankingCalculator } from "./round/sport/against";
import { TogetherSportRoundRankingCalculator } from "./round/sport/together";

export class RoundRankingCalculator {
    protected gameStates: GameState[];
    protected cumulative: Cumulative;

    constructor(
        gameStates?: GameState[],
        cumulative?: Cumulative,
    ) {
        this.gameStates = gameStates ?? [GameState.Finished];
        this.cumulative = cumulative ?? Cumulative.byRank;
    }

    protected getSportRoundRankingCalculator(competitionSport: CompetitionSport): SportRoundRankingCalculator {
        if (competitionSport.getVariant() instanceof AgainstVariant) {
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
            return this.compareBy(a, b);
        });
        const roundRankingItems: RoundRankingItem[] = [];
        let nrOfIterations = 0;
        let rank = 0;
        let previousCumulativeRankItem: RoundRankingItem | undefined;
        let cumulativeRoundRankingItem: RoundRankingItem | undefined;
        while (cumulativeRoundRankingItem = cumulativeRoundRankingItems.shift()) {
            if (this.differs(cumulativeRoundRankingItem, previousCumulativeRankItem)) {
                rank++;
            }
            cumulativeRoundRankingItem.setRank(rank, ++nrOfIterations);
            previousCumulativeRankItem = cumulativeRoundRankingItem;
            roundRankingItems.push(cumulativeRoundRankingItem);
        }
        return roundRankingItems;
    }

    protected compareBy(a: RoundRankingItem, b: RoundRankingItem): number {
        if (this.cumulative === Cumulative.byRank
            && a.getCumulativeRank() !== b.getCumulativeRank()) {
            return a.getCumulativeRank() < b.getCumulativeRank() ? -1 : 1;
        }
        const cmp = a.compareCumulativePerformances(b);
        if (cmp !== 0.0) {
            return cmp > 0 ? 1 : -1;
        }
        if (a.getPlace().getPouleNr() === b.getPlace().getPouleNr()) {
            return a.getPlace().getPlaceNr() - b.getPlace().getPlaceNr();
        }
        return a.getPlace().getPouleNr() - b.getPlace().getPouleNr();
    }

    protected differs(a: RoundRankingItem, b: RoundRankingItem | undefined): boolean {
        if (b === undefined) {
            return true;
        }
        if (this.cumulative === Cumulative.byRank && a.getCumulativeRank() !== b.getCumulativeRank()) {
            return true;
        }
        return a.compareCumulativePerformances(b) !== 0.0;
    }
}

export interface RoundRankingItemMap {
    [key: string]: RoundRankingItem;
}