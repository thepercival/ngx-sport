import { CompetitionSport } from "../../../competition/sport";
import { Place } from "../../../place";
import { PlaceLocation } from "../../../place/location";
import { Poule } from "../../../poule";
import { HorizontalPoule } from "../../../poule/horizontal";
import { State } from "../../../state";
import { RankedSportRoundItem } from "../../item/round/sportranked";
import { UnrankedRoundItem } from "../../item/round/unranked";
import { RankingRule } from "../../rule";
import { RankingRuleGetter } from "../../rule/getter";

export abstract class SportRoundRankingCalculator {
    protected gameStateMap: GameStateMap = {};
    protected rankFunctionMap: RankFunctionMap = {};
    protected rankingRuleGetter: RankingRuleGetter;

    constructor(
        protected competitionSport: CompetitionSport,
        gameStates: State[]
    ) {
        gameStates.forEach((state: State) => this.gameStateMap[+state] = true);
        this.rankingRuleGetter = new RankingRuleGetter();
    }

    abstract getItemsForPoule(poule: Poule): RankedSportRoundItem[];
    protected abstract rankItems(unrankedItems: UnrankedRoundItem[], rankingRules: RankingRule[]): RankedSportRoundItem[]

    getPlaceLocationsForHorizontalPoule(horizontalPoule: HorizontalPoule): PlaceLocation[] {
        return this.getItemsForHorizontalPoule(horizontalPoule, true).map(rankingItem => {
            return rankingItem.getPlaceLocation();
        });
    }

    getPlacesForHorizontalPoule(horizontalPoule: HorizontalPoule): Place[] {
        return this.getItemsForHorizontalPoule(horizontalPoule, true).map(rankingItem => {
            return rankingItem.getPlace();
        });
    }

    getItemsForHorizontalPoule(horizontalPoule: HorizontalPoule, checkOnSingleQualifyRule?: boolean): RankedSportRoundItem[] {
        const unrankedRoundItems: UnrankedRoundItem[] = [];
        horizontalPoule.getPlaces().forEach(place => {
            if (checkOnSingleQualifyRule && this.hasPlaceSingleQualifyRule(place)) {
                return;
            }
            const pouleRankingItems: RankedSportRoundItem[] = this.getItemsForPoule(place.getPoule());
            const pouleRankingItem = this.getItemByRank(pouleRankingItems, place.getNumber());
            if (pouleRankingItem === undefined) {
                return;
            }
            unrankedRoundItems.push(pouleRankingItem.getUnranked());
        });
        const scoreConfig = horizontalPoule.getRound().getValidScoreConfig(this.competitionSport);
        const ruleSet = this.competitionSport.getCompetition().getRankingRuleSet();
        const rankingRules: RankingRule[] = this.rankingRuleGetter.getRules(ruleSet, scoreConfig.useSubScore());
        return this.rankItems(unrankedRoundItems, rankingRules);
    }

    protected getItemByRank(rankingItems: RankedSportRoundItem[], rank: number): RankedSportRoundItem | undefined {
        return rankingItems.find(rankingItemIt => rankingItemIt.getUniqueRank() === rank);
    }

    /**
     * Place can have a multiple and a single rule, if so than do not
     * process place for horizontalpoule(multiple)
     *
     * @param place
     */
    protected hasPlaceSingleQualifyRule(place: Place): boolean {
        return place.getToQualifyRules().filter(qualifyRuleIt => qualifyRuleIt.isSingle()).length > 0;
    }


}

interface GameStateMap {
    [key: number]: boolean;
}

export interface RankFunctionMap {
    [key: number]: Function;
}
