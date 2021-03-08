import { GameMode } from "../../planning/gameMode";
import { ScoreConfig } from "../../score/config";
import { RankingRule } from "../rule";
import { RankingRuleSet } from "../ruleSet";

export class RankingRuleGetter {

    getRules(ruleSet: RankingRuleSet, useSubScore: boolean): RankingRule[] {
        if (ruleSet === RankingRuleSet.Together) {
            return this.getTogetherRules(useSubScore);
        }
        return this.getAgainstRules(ruleSet, useSubScore);
    }

    protected getAgainstRules(ruleSet: RankingRuleSet, useSubScore: boolean): RankingRule[] {
        const rules: RankingRule[] = [RankingRule.MostPoints, RankingRule.FewestGames];
        if (ruleSet === RankingRuleSet.AgainstAmong) {
            rules.push(RankingRule.BestAmongEachOther);
        }
        rules.push(RankingRule.BestUnitDifference);
        rules.push(RankingRule.MostUnitsScored);
        if (useSubScore) {
            rules.push(RankingRule.BestSubUnitDifference);
            rules.push(RankingRule.MostSubUnitsScored);
        }
        if (ruleSet === RankingRuleSet.Against) {
            rules.push(RankingRule.BestAmongEachOther);
        }
        return rules;
    }

    protected getTogetherRules(useSubScore: boolean): RankingRule[] {
        const rules: RankingRule[] = [RankingRule.MostUnitsScored];
        if (useSubScore) {
            rules.push(RankingRule.MostSubUnitsScored);
        }
        rules.push(RankingRule.FewestGames);
        return rules;
    }
}

