import { Round } from '../round';

export abstract class QualifyRule {
    constructor(private toRound: Round) { }



    getToRound(): Round {
        return this.toRound;
    }

    abstract getFromRound(): Round;
    abstract isMultiple(): boolean;
    abstract isSingle(): boolean;

    // getFromPoulePlaces(): PoulePlace[] {
    //     return this.fromHorizontalPoule.getPlaces();
    // }

    // addFromPoulePlace(poulePlace: PoulePlace): void {
    //     if (poulePlace === undefined) { return; }
    //     poulePlace.setToQualifyRule(this.getWinnersOrLosers(), this);
    //     this.fromPoulePlaces.push(poulePlace);
    // }

    // removeFromPoulePlace(poulePlace?: PoulePlace): void {
    //     const fromPoulePlaces = this.getFromPoulePlaces();
    //     if (poulePlace === undefined) {
    //         poulePlace = fromPoulePlaces[fromPoulePlaces.length - 1];
    //     }
    //     const index = fromPoulePlaces.indexOf(poulePlace);
    //     if (index > -1) {
    //         this.getFromPoulePlaces().splice(index, 1);
    //         poulePlace.setToQualifyRule(this.getWinnersOrLosers(), undefined);
    //     }
    // }

    // getToPoulePlaces(): PoulePlace[] {
    //     return this.toPoulePlaces;
    // }

    // addToPoulePlace(poulePlace: PoulePlace): void {
    //     if (poulePlace === undefined) { return; }
    //     poulePlace.setFromQualifyRule(this);
    //     this.toPoulePlaces.push(poulePlace);
    // }

    // removeToPoulePlace(poulePlace?: PoulePlace): void {
    //     const toPoulePlaces = this.getToPoulePlaces();
    //     if (poulePlace === undefined) {
    //         poulePlace = toPoulePlaces[toPoulePlaces.length - 1];
    //     }
    //     const index = this.getToPoulePlaces().indexOf(poulePlace);
    //     if (index > -1) {
    //         this.getToPoulePlaces().splice(index, 1);
    //         poulePlace.setFromQualifyRule(undefined);
    //     }
    // }
    // quick fix



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

