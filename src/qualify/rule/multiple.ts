import { HorizontalPoule } from '../../poule/horizontal';
import { PoulePlace } from '../../pouleplace';
import { Round } from '../../round';
import { QualifyRule } from '../rule';

export class QualifyRuleMultiple extends QualifyRule {
    private toPlaces: PoulePlace[] = [];
    private fromHorizontalPoule: HorizontalPoule;
    private nrOfToPlaces: number;

    constructor(fromHorizontalPoule: HorizontalPoule, toRound: Round, nrOfToPlaces: number) {
        super(toRound);
        this.fromHorizontalPoule = fromHorizontalPoule;
        this.nrOfToPlaces = nrOfToPlaces;
    }

    getFromHorizontalPoule(): HorizontalPoule {
        return this.fromHorizontalPoule;
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

    addToPlace(toPlace: PoulePlace) {
        this.toPlaces.push(toPlace);
    }

    toPlacesComplete(): boolean {
        return this.nrOfToPlaces === this.toPlaces.length;
    }

    getToPlaces(): PoulePlace[] {
        return this.toPlaces;
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

