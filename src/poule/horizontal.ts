import { Place } from '../place';
import { Round } from '../qualify/group';
import { HorizontalMultipleQualifyRule } from '../qualify/rule/horizontal/multiple';
import { HorizontalSingleQualifyRule } from '../qualify/rule/horizontal/single';
import { VerticalMultipleQualifyRule } from '../qualify/rule/vertical/multiple';
import { VerticalSingleQualifyRule } from '../qualify/rule/vertical/single';
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
    protected qualifyRule: HorizontalMultipleQualifyRule | HorizontalSingleQualifyRule | VerticalMultipleQualifyRule | VerticalSingleQualifyRule | undefined;

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

    getAbsoluteNumber(): number {
        if (this.getQualifyTarget() !== QualifyTarget.Losers) {
            return this.number;
        }
        const nrOfPlaceNubers = this.round.getHorizontalPoules(QualifyTarget.Winners).length;
        return nrOfPlaceNubers - (this.number - 1);
    }

    /*getQualifyGroup(): QualifyGroup | undefined {
        return this.qualifyRule?.getGroup();
    }*/

    setQualifyRuleNew(qualifyRule: HorizontalMultipleQualifyRule | HorizontalSingleQualifyRule | VerticalMultipleQualifyRule | VerticalSingleQualifyRule | undefined) {
        this.qualifyRule = qualifyRule;
    }

    /*protected getMultipleQualifyRule(): MultipleQualifyRule | undefined {
        return this.multipleRule;
    }

    setQualifyRule(multipleRule: MultipleQualifyRule | SingleQualifyRule) {
        this.qualifyRule = multipleRule;
    }*/

    getQualifyRuleNew(): HorizontalMultipleQualifyRule | HorizontalSingleQualifyRule | VerticalMultipleQualifyRule | VerticalSingleQualifyRule | undefined {
        return this.qualifyRule;
    }

    /*setQualifyRulesSingle(singleRules: SingleQualifyRule[]) {
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
        if (qualifyRule instanceof SingleQualifyRule) {
            return qualifyRule.getMappings().length;
        }
        return qualifyRule.getToPlaces().length;
    }*/
}
