import { PoulePlace } from '../pouleplace';
import { QualifyGroup } from '../qualify/group';
import { QualifyRuleMultiple } from '../qualify/rule/multiple';
import { Round } from '../round';

/**
 * QualifyGroup.WINNERS
 *  [ A1 B1 C1 ]
 *  [ A2 B2 C2 ]
 *  [ A3 B3 C3 ]
 * QualifyGroup.LOSERS
 *  [ C3 B3 A3 ]
 *  [ C2 B2 A2 ]
 *  [ C1 B1 A1 ]
 *
 **/
export class HorizontalPoule {
    protected round: Round;
    protected qualifyGroup: QualifyGroup;
    protected number: number;
    protected places: PoulePlace[] = [];
    protected multipleRule: QualifyRuleMultiple;

    constructor(round: Round, number: number) {
        this.setRound(round);
        this.setNumber(number);
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
        return this.getQualifyGroup() ? this.getQualifyGroup().getWinnersOrLosers() : QualifyGroup.DROPOUTS;
    }

    getNumber(): number {
        return this.number;
    }

    setNumber(number: number): void {
        this.number = number;
    }

    getPlaceNumber(): number {
        if (this.getWinnersOrLosers() !== QualifyGroup.LOSERS) {
            return this.number;
        }
        const nrOfPlaceNubers = this.getQualifyGroup().getRound().getHorizontalPoules(QualifyGroup.WINNERS).length;
        return nrOfPlaceNubers - (this.number - 1);
    }

    getQualifyGroup(): QualifyGroup {
        return this.qualifyGroup;
    }

    setQualifyGroup(qualifyGroup: QualifyGroup) {

        // this is done in horizontalpouleservice
        // if( this.qualifyGroup != undefined ){ // remove from old round
        //     var index = this.qualifyGroup.getHorizontalPoules().indexOf(this);
        //     if (index > -1) {
        //         this.round.getHorizontalPoules().splice(index, 1);
        //     }
        // }
        this.qualifyGroup = qualifyGroup;
        if (qualifyGroup !== undefined) {
            this.qualifyGroup.getHorizontalPoules().push(this);
        }
    }

    getQualifyRuleMultiple(): QualifyRuleMultiple {
        return this.multipleRule;
    }

    setQualifyRuleMultiple(multipleRule: QualifyRuleMultiple) {
        this.multipleRule = multipleRule;
    }

    getPlaces(): PoulePlace[] {
        return this.places;
    }

    getFirstPlace(): PoulePlace {
        return this.places[0];
    }

    hasPlace(place: PoulePlace): boolean {
        return this.getPlaces().find(placeIt => placeIt === place) !== undefined;
    }

    // next(): Poule {
    //     const poules = this.getRound().getPoules();
    //     return poules[this.getNumber()];
    // }

    isBorderPoule(): boolean {
        if (!this.getQualifyGroup().isBorderGroup()) {
            return false;
        }
        const horPoules = this.getQualifyGroup().getHorizontalPoules();
        return horPoules[horPoules.length - 1] === this;
    }

    getNrOfQualifiers() {
        if (!this.isBorderPoule()) {
            return this.getPlaces().length;
        }
        return this.getPlaces().length - (this.getQualifyGroup().getNrOfToPlacesTooMuch());
    }
}
