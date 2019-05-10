import { Poule } from '../poule';

export class PoulePlaceDivider {
    // private qualifyReservationService: QualifyReservationService;
    // private currentToPouleNumber = 1;
    // private nrOfPoules = 0;
    // private crossFinals;

    // constructor(private childRound: Round) {
    //     this.qualifyReservationService = new QualifyReservationService(childRound);
    //     this.nrOfPoules = childRound.getPoules().length;
    //     // this.crossFinals = childRound.getQualifyOrder() === Round.QUALIFYORDER_CROSS;
    // }

    // divide(qualifyRules: QualifyRule[]) {
    //     console.log('PoulePlaceDivider::divide');

    //     const horizontalPoules = this.childRound.getHorizontalPoules(QualifyGroup.WINNERS);

    //     eerste horizontalpoule van toplaces vul je from places gesorteerd op number_poule

    //     laatste horizontalpoule van toplaces vul je met from places gesorteerd op number_poule maar dan omgedraaid.



    //         // let nrOfShifts = 0; let maxShifts = fromPoulePlaces.length;
    //         // const isMultiple = fromPoulePlaces.length > qualifyRule.getToPoulePlaces().length;
    //         while(qualifyRules.length > 0) {

    //         bedankt hier een simpele methode om de qualifyRules en de toPlaces aan elkaar te koppelen

    //         const fromPoulePlace = fromPoulePlaces.shift();
    //         if (!this.crossFinals || isMultiple
    //             || this.qualifyReservationService.isFree(this.currentToPouleNumber, fromPoulePlace.getPoule())
    //             || nrOfShifts === maxShifts
    //         ) {
    //             if (!isMultiple) {
    //                 this.qualifyReservationService.reserve(this.currentToPouleNumber, fromPoulePlace.getPoule());
    //                 this.currentToPouleNumber = (this.currentToPouleNumber === this.nrOfPoules ? 1 : this.currentToPouleNumber + 1);
    //             }
    //             qualifyRule.addFromPoulePlace(fromPoulePlace);
    //             maxShifts = fromPoulePlaces.length;
    //             nrOfShifts = 0;
    //         } else {
    //             fromPoulePlaces.push(fromPoulePlace);
    //             nrOfShifts++;
    //         }
    //     }
    //     // custom rules kunnen hier eventueel nog worden uitgevoerd.
    // }
}

interface PouleNumberReservations {
    toPouleNr: number;
    fromPoules: Poule[];
}
