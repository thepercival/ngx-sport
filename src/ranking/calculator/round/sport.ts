import { CompetitionSport } from "../../../competition/sport";
import { PlaceSportPerformance } from "../../../place/sportPerformance";
import { Poule } from "../../../poule";
import { Round } from "../../../qualify/group";
import { SportRoundRankingItem } from "../../item/round/sport";
import { RankingRule } from "../../rule";
import { RankingRuleGetter } from "../../rule/getter";
import { AgainstRuleSet } from "../../againstRuleSet";
import { GameState } from "../../../game/state";
import { AgainstVariant } from "../../../sport/variant/against";

export abstract class SportRoundRankingCalculator {
    protected gameStateMap: GameStateMap = {};
    protected rankFunctionMap: RankFunctionMap = {};
    protected rankingRuleGetter: RankingRuleGetter;

    constructor(
        protected competitionSport: CompetitionSport,
        gameStates: GameState[]
    ) {
        gameStates.forEach((state: GameState) => this.gameStateMap[state] = true);
        this.rankingRuleGetter = new RankingRuleGetter();
    }

    abstract getItemsForPoule(poule: Poule): SportRoundRankingItem[];

    protected getRankingRuleSet(): AgainstRuleSet | undefined {
        if (this.competitionSport.getVariant() instanceof AgainstVariant) {
            return this.competitionSport.getCompetition().getAgainstRuleSet();
        }
        return undefined;
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
        const ruleSet = this.getRankingRuleSet();
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
}

interface GameStateMap {
    [key: number]: boolean;
}

export interface RankFunctionMap {
    [key: number]: Function;
}
