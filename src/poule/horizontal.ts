import { PoulePlace } from '../pouleplace';
import { Round } from '../round';

export class HorizontalPoule {
    protected round: Round;
    protected winnersOrLosers: number;
    protected placeNumber: number;
    protected places: PoulePlace[] = [];

    constructor(round: Round, placeNumber: number) {
        this.setRound(round);
        this.setPlaceNumber(placeNumber);
    }

    getRound(): Round {
        return this.round;
    }

    setRound(round: Round): void {
        // if( this.round != undefined ){ // remove from old round
        //     var index = this.round.getPoules().indexOf(this);
        //     if (index > -1) {
        //         this.round.getPoules().splice(index, 1);
        //     }
        // }
        this.round = round;
        // this.round.getPoules().push(this);
    }

    getWinnersOrLosers(): number {
        return this.winnersOrLosers;
    }

    setWinnersOrLosers(winnersOrLosers: number): void {
        this.winnersOrLosers = winnersOrLosers;
    }

    getPlaceNumber(): number {
        return this.placeNumber;
    }

    setPlaceNumber(placeNumber: number): void {
        this.placeNumber = placeNumber;
    }



    getPlaces(): PoulePlace[] {
        return this.places;
    }

    hasPlace(place: PoulePlace): boolean {
        return this.getPlaces().find(placeIt => placeIt === place) !== undefined;
    }

    // next(): Poule {
    //     const poules = this.getRound().getPoules();
    //     return poules[this.getNumber()];
    // }


}
