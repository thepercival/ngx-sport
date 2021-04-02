import { CompetitionSport } from "../../../competition/sport";
import { Place } from "../../../place";
import { PlaceLocation } from "../../../place/location";
import { PlaceSportPerformance } from "../../../place/sportPerformance";
import { Poule } from "../../../poule";
import { HorizontalPoule } from "../../../poule/horizontal";
import { Round } from "../../../qualify/group";
import { QualifyRuleSingle } from "../../../qualify/rule/single";
import { QualifyTarget } from "../../../qualify/target";
import { State } from "../../../state";
import { SportRoundRankingItem } from "../../item/round/sport";
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

    abstract getItemsForPoule(poule: Poule): SportRoundRankingItem[];

    getPlaceLocationsForHorizontalPoule(horizontalPoule: HorizontalPoule): PlaceLocation[] {
        return this.getItemsForHorizontalPoule(horizontalPoule, true).map(rankingItem => {
            return rankingItem.getPlaceLocation();
        });
    }

    getPlacesForHorizontalPoule(horizontalPoule: HorizontalPoule): Place[] {
        return this.getItemsForHorizontalPoule(horizontalPoule, true).map((rankingSportItem: SportRoundRankingItem): Place => {
            return horizontalPoule.getRound().getPlace(rankingSportItem.getPlaceLocation());
        });
    }

    getItemsForHorizontalPoule(horizontalPoule: HorizontalPoule, checkOnSingleQualifyRule?: boolean): SportRoundRankingItem[] {
        const performances: PlaceSportPerformance[] = [];
        horizontalPoule.getPlaces().forEach(place => {
            if (checkOnSingleQualifyRule && this.hasPlaceSingleQualifyRule(place)) {
                return;
            }
            const pouleRankingItems: SportRoundRankingItem[] = this.getItemsForPoule(place.getPoule());
            const pouleRankingItem = this.getItemByRank(pouleRankingItems, place.getNumber());
            if (pouleRankingItem === undefined) {
                return;
            }
            performances.push(pouleRankingItem.getPerformance());
        });
        const scoreConfig = horizontalPoule.getRound().getValidScoreConfig(this.competitionSport);
        const ruleSet = this.competitionSport.getCompetition().getRankingRuleSet();
        const rankingRules: RankingRule[] = this.rankingRuleGetter.getRules(ruleSet, scoreConfig.useSubScore());
        return this.rankItems(performances, rankingRules);
    }

    protected rankItems(performances: PlaceSportPerformance[], rankingRules: RankingRule[]): SportRoundRankingItem[] {
        const rankingItems: SportRoundRankingItem[] = [];
        let nrOfIterations = 0;
        while (performances.length > 0) {
            const bestPerformances: PlaceSportPerformance[] = this.findBestPerformances(performances, rankingRules);
            const rank = nrOfIterations + 1;
            bestPerformances.sort((perfA: PlaceSportPerformance, perfB: PlaceSportPerformance) => {
                if (perfA.getPlaceLocation().getPouleNr() === perfA.getPlaceLocation().getPouleNr()) {
                    return perfA.getPlaceLocation().getPlaceNr() - perfA.getPlaceLocation().getPlaceNr();
                }
                return perfA.getPlaceLocation().getPouleNr() - perfA.getPlaceLocation().getPouleNr();
            });
            bestPerformances.forEach((bestPerformance: PlaceSportPerformance) => {
                performances.splice(performances.indexOf(bestPerformance), 1);
                rankingItems.push(new SportRoundRankingItem(bestPerformance, ++nrOfIterations, rank));
            });
        }
        return rankingItems;
    }

    protected getItemsHelper(round: Round, performances: PlaceSportPerformance[]): SportRoundRankingItem[] {
        const scoreConfig = round.getValidScoreConfig(this.competitionSport);
        const ruleSet = this.competitionSport.getCompetition().getRankingRuleSet();
        const rankingRules: RankingRule[] = this.rankingRuleGetter.getRules(ruleSet, scoreConfig.useSubScore());
        return this.rankItems(performances, rankingRules);
    }

    protected getItemByRank(rankingItems: SportRoundRankingItem[], rank: number): SportRoundRankingItem | undefined {
        return rankingItems.find(rankingItemIt => rankingItemIt.getUniqueRank() === rank);
    }

    protected findBestPerformances(originalPerformances: PlaceSportPerformance[], rankingRules: RankingRule[]): PlaceSportPerformance[] {
        let bestPerformances: PlaceSportPerformance[] = originalPerformances.slice();
        rankingRules.some((rankingRule: RankingRule) => {
            const rankingFunction = this.rankFunctionMap[rankingRule];
            if (rankingRule === RankingRule.BestAmongEachOther && originalPerformances.length === bestPerformances.length) {
                return false;
            }
            bestPerformances = rankingFunction(bestPerformances);
            return (bestPerformances.length < 2);
        });
        return bestPerformances;
    }

    /**
     * Place can have a multiple and a single rule, if so than do not process place for horizontalpoule(multiple)
     */
    protected hasPlaceSingleQualifyRule(place: Place): boolean {
        return [QualifyTarget.Winners, QualifyTarget.Losers].some((qualifyTarget: QualifyTarget) => {
            const qualifyRule = place.getHorizontalPoule(qualifyTarget).getQualifyRule();
            return qualifyRule instanceof QualifyRuleSingle;
        });
    }
}

interface GameStateMap {
    [key: number]: boolean;
}

export interface RankFunctionMap {
    [key: number]: Function;
}
