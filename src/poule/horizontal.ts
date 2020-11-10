import { Place } from '../place';
import { QualifyGroup, Round } from '../qualify/group';
import { QualifyRuleMultiple } from '../qualify/rule/multiple';

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
    protected qualifyGroup: QualifyGroup | undefined;
    protected places: Place[] = [];
    protected multipleRule: QualifyRuleMultiple | undefined;

    constructor(protected round: Round, protected number: number) {
    }

    getRound(): Round {
        return this.round;
    }

    getWinnersOrLosers(): number {
        const qualifyGroup = this.getQualifyGroup();
        return qualifyGroup ? qualifyGroup.getWinnersOrLosers() : QualifyGroup.DROPOUTS;
    }

    getNumber(): number {
        return this.number;
    }

    getPlaceNumber(): number {
        if (this.getWinnersOrLosers() !== QualifyGroup.LOSERS) {
            return this.number;
        }
        const nrOfPlaceNubers = this.round.getHorizontalPoules(QualifyGroup.WINNERS).length;
        return nrOfPlaceNubers - (this.number - 1);
    }

    getQualifyGroup(): QualifyGroup | undefined {
        return this.qualifyGroup;
    }

    setQualifyGroup(qualifyGroup?: QualifyGroup) {

        // this is done in horizontalpouleservice
        // if( this.qualifyGroup != undefined ){ // remove from old round
        //     var index = this.qualifyGroup.getHorizontalPoules().indexOf(this);
        //     if (index > -1) {
        //         this.round.getHorizontalPoules().splice(index, 1);
        //     }
        // }
        this.qualifyGroup = qualifyGroup;
        this.qualifyGroup?.getHorizontalPoules().push(this);
    }

    getQualifyRuleMultiple(): QualifyRuleMultiple | undefined {
        return this.multipleRule;
    }

    setQualifyRuleMultiple(multipleRule: QualifyRuleMultiple | undefined) {
        this.getPlaces().forEach(place => place.setToQualifyRule(this.getWinnersOrLosers(), multipleRule));
        this.multipleRule = multipleRule;
    }

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

    isBorderPoule(): boolean {
        const qualifyGroup = this.getQualifyGroup();
        if (qualifyGroup === undefined || !qualifyGroup.isBorderGroup()) {
            return false;
        }
        const horPoules = qualifyGroup.getHorizontalPoules();
        return horPoules[horPoules.length - 1] === this;
    }

    getNrOfQualifiers(): number {
        const qualifyGroup = this.getQualifyGroup();
        if (qualifyGroup === undefined) {
            return 0;
        }
        if (!this.isBorderPoule()) {
            return this.getPlaces().length;
        }
        return this.getPlaces().length - qualifyGroup.getNrOfToPlacesTooMuch();
    }
}
