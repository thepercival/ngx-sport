import { HorizontalPoule } from '../../poule/horizontal';
import { Round } from '../../round';
import { QualifyRule } from '../rule';

export class QualifyRuleMultiple extends QualifyRule {
    constructor(private fromHorizontalPoule: HorizontalPoule, toRound: Round) {
        super(toRound)
    }

    getFromRound(): Round {
        return this.fromHorizontalPoule.getRound();
    }

    isMultiple(): boolean {
        return true;
    }

    isSingle(): boolean {
        return false;
    }

    // getFromPoulePlaces(): PoulePlace[] {
    //     return this.fromHorizontalPoule.getPlaces();
    // }



    // getToPoulePlaces(): PoulePlace[] {
    //     return this.toPoulePlaces;
    // }

    // addToPoulePlace(poulePlace: PoulePlace): void {
    //     if (poulePlace === undefined) { return; }
    //     poulePlace.setFromQualifyRule(this);
    //     this.toPoulePlaces.push(poulePlace);
    // }





    // getToEquivalent(fromPoulePlace: PoulePlace): PoulePlace {
    //     if (this.isMultiple()) {
    //         return undefined;
    //     }
    //     const index = this.getFromPoulePlaces().indexOf(fromPoulePlace);
    //     if (index < 0) {
    //         return undefined;
    //     }
    //     return this.getToPoulePlaces()[index];
    // }

    // getFromEquivalent(toPoulePlace: PoulePlace): PoulePlace {
    //     if (this.isMultiple()) {
    //         return undefined;
    //     }
    //     const index = this.getToPoulePlaces().indexOf(toPoulePlace);
    //     if (index < 0) {
    //         return undefined;
    //     }
    //     return this.getFromPoulePlaces()[index];
    // }

    // getWinnersOrLosers(): number {
    //     return this.qualifyGroup.getWinnersOrLosers();
    // }
}

