import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Round } from '../round';
import { QualifyReservationService } from './reservationservice';
import { QualifyRule } from './rule';

export class PoulePlaceDivider {
    private qualifyReservationService: QualifyReservationService;
    private currentToPouleNumber = 1;
    private nrOfPoules = 0;
    private crossFinals;

    constructor(childRound: Round) {
        this.qualifyReservationService = new QualifyReservationService(childRound);
        this.nrOfPoules = childRound.getPoules().length;
        // this.crossFinals = childRound.getQualifyOrder() === Round.QUALIFYORDER_CROSS;
    }

    divide(qualifyRule: QualifyRule, fromPoulePlaces: PoulePlace[]) {
        console.log('PoulePlaceDivider::divide');
        // let nrOfShifts = 0; let maxShifts = fromPoulePlaces.length;
        // const isMultiple = fromPoulePlaces.length > qualifyRule.getToPoulePlaces().length;
        // while (fromPoulePlaces.length > 0) {
        //     const fromPoulePlace = fromPoulePlaces.shift();
        //     if (!this.crossFinals || isMultiple
        //         || this.qualifyReservationService.isFree(this.currentToPouleNumber, fromPoulePlace.getPoule())
        //         || nrOfShifts === maxShifts
        //     ) {
        //         if (!isMultiple) {
        //             this.qualifyReservationService.reserve(this.currentToPouleNumber, fromPoulePlace.getPoule());
        //             this.currentToPouleNumber = (this.currentToPouleNumber === this.nrOfPoules ? 1 : this.currentToPouleNumber + 1);
        //         }
        //         qualifyRule.addFromPoulePlace(fromPoulePlace);
        //         maxShifts = fromPoulePlaces.length;
        //         nrOfShifts = 0;
        //     } else {
        //         fromPoulePlaces.push(fromPoulePlace);
        //         nrOfShifts++;
        //     }
        // }
        // custom rules kunnen hier eventueel nog worden uitgevoerd.
    }

    // Wanneer de rule multiple is moet ik eerst de bepalen wie er door zijn en vervolgens wordt pas verdeling gemaakt!

    // protected getShuffledPoulePlaces(poulePlaces: PoulePlace[], nrOfShifts: number, childRound: Round): PoulePlace[] {
    //     let shuffledPoulePlaces: PoulePlace[] = [];
    //     const qualifyOrder = childRound.getQualifyOrder();
    //     if (!childRound.hasCustomQualifyOrder()) {
    //         if ((poulePlaces.length % 2) === 0) {
    //             for (let shiftTime = 0; shiftTime < nrOfShifts; shiftTime++) {
    //                 poulePlaces.push(poulePlaces.shift());
    //             }
    //         }
    //         shuffledPoulePlaces = poulePlaces;
    //     } else if (qualifyOrder === 4) { // shuffle per two on oneven placenumbers, horizontal-children
    //         if ((poulePlaces[0].getNumber() % 2) === 0) {
    //             while (poulePlaces.length > 0) {
    //                 shuffledPoulePlaces = shuffledPoulePlaces.concat(poulePlaces.splice(0, 2).reverse());
    //             }
    //         } else {
    //             shuffledPoulePlaces = poulePlaces;
    //         }
    //     } else if (qualifyOrder === 5) { // reverse second and third item, vertical-children
    //         if (poulePlaces.length % 4 === 0) {
    //             while (poulePlaces.length > 0) {
    //                 const poulePlacesTmp = poulePlaces.splice(0, 4);
    //                 poulePlacesTmp.splice(1, 0, poulePlacesTmp.splice(2, 1)[0]);
    //                 shuffledPoulePlaces = shuffledPoulePlaces.concat(poulePlacesTmp);
    //             }
    //         } else {
    //             shuffledPoulePlaces = poulePlaces;
    //         }
    //     }
    //     return shuffledPoulePlaces;
    // }
}

interface PouleNumberReservations {
    toPouleNr: number;
    fromPoules: Poule[];
}
