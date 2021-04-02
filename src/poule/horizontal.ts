import { Place } from '../place';
import { QualifyGroup, Round } from '../qualify/group';
import { QualifyRuleMultiple } from '../qualify/rule/multiple';
import { QualifyRuleSingle } from '../qualify/rule/single';
import { QualifyTarget } from '../qualify/target';

/**
 * QualifyTarget.Winners
 *  [ A1 B1 C1 ]
 *  [ A2 B2 C2 ]
 *  [ A3 B3 C3 ]
 * QualifyTarget.Losers
 *  [ C3 B3 A3 ]
 *  [ C2 B2 A2 ]
 *  [ C1 B1 A1 ]
 *
 **/
export class HorizontalPoule {
    protected number: number
    protected qualifyRule: QualifyRuleMultiple | QualifyRuleSingle | undefined;

    constructor(
        protected round: Round,
        protected qualifyTarget: QualifyTarget,
        protected previous: HorizontalPoule | undefined,
        protected places: Place[]) {
        round.getHorizontalPoules(this.qualifyTarget).push(this);
        this.number = previous ? previous.getNumber() + 1 : 1;
    }

    getRound(): Round {
        return this.round;
    }

    getQualifyTarget(): QualifyTarget {
        return this.qualifyTarget;
    }

    getNumber(): number {
        return this.number;
    }

    getPlaceNumber(): number {
        if (this.getQualifyTarget() !== QualifyTarget.Losers) {
            return this.number;
        }
        const nrOfPlaceNubers = this.round.getHorizontalPoules(QualifyTarget.Winners).length;
        return nrOfPlaceNubers - (this.number - 1);
    }

    /*getQualifyGroup(): QualifyGroup | undefined {
        return this.qualifyRule?.getGroup();
    }*/

    setQualifyRule(qualifyRule: QualifyRuleMultiple | QualifyRuleSingle | undefined) {
        this.qualifyRule = qualifyRule;
    }

    /*protected getQualifyRuleMultiple(): QualifyRuleMultiple | undefined {
        return this.multipleRule;
    }

    setQualifyRule(multipleRule: QualifyRuleMultiple | QualifyRuleSingle) {
        this.qualifyRule = multipleRule;
    }*/

    getQualifyRule(): QualifyRuleSingle | QualifyRuleMultiple | undefined {
        return this.qualifyRule;
    }

    /*setQualifyRulesSingle(singleRules: QualifyRuleSingle[]) {
        this.singleRules = singleRules;
    }*/

    getPlaces(): Place[] {
        return this.places;
    }

    getFirstPlace(): Place {
        return this.places[0];
    }

    hasPlace(place: Place): boolean {
        return this.getPlaces().find(placeIt => placeIt === place) !== undefined;
    }

    // next(): Poule {
    //     const poules = this.getRound().getPoules();
    //     return poules[this.getNumber()];
    // }

    /*isBorderPoule(): boolean {
        const qualifyGroup = this.getQualifyGroup();
        if (qualifyGroup === undefined || !qualifyGroup.isBorderGroup()) {
            return false;
        }
        const horPoules = qualifyGroup.getHorizontalPoules();
        return horPoules[horPoules.length - 1] === this;
    }*/

    /*getNrOfQualifiers(): number {
        const qualifyRule = this.getQualifyRule();
        if (qualifyRule === undefined) {
            return 0;
        }
        if (qualifyRule instanceof QualifyRuleSingle) {
            return qualifyRule.getMappings().length;
        }
        return qualifyRule.getToPlaces().length;
    }*/
}
