import { RankingRule } from "../rule";
import { AgainstRuleSet } from "../againstRuleSet";

export class RankingRuleGetter {

    getRules(ruleSet: AgainstRuleSet | undefined, useSubScore: boolean): RankingRule[] {
        if (ruleSet === undefined) {
            return this.getTogetherRules(useSubScore);
        }
        return this.getAgainstRules(ruleSet, useSubScore);
    }

    protected getAgainstRules(ruleSet: AgainstRuleSet, useSubScore: boolean): RankingRule[] {
        const rules: RankingRule[] = [RankingRule.MostPoints, RankingRule.FewestGames];
        if (ruleSet === AgainstRuleSet.AmongFirst) {
            rules.push(RankingRule.BestAmongEachOther);
        }
        rules.push(RankingRule.BestUnitDifference);
        rules.push(RankingRule.MostUnitsScored);
        if (useSubScore) {
            rules.push(RankingRule.BestSubUnitDifference);
            rules.push(RankingRule.MostSubUnitsScored);
        }
        if (ruleSet === AgainstRuleSet.DiffFirst) {
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
