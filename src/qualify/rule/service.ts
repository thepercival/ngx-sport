import { PoulePlace } from '../../pouleplace';
import { Round } from '../../round';
import { PoulePlaceDivider } from '../pouleplacedivider';
import { QualifyRule } from '../rule';

export class QualifyRuleService {
    constructor(private parentRound: Round, private childRound: Round) {
    }

    createRules() {
        // console.log('createRules started: ' + this.parentRound.getNumberAsValue() + ' < -> ' + this.childRound.getNumberAsValue());
        // const order = this.childRound.getQualifyOrder() === Round.QUALIFYORDER_RANK ? Round.ORDER_POULE_NUMBER : Round.ORDER_NUMBER_POULE;
        console.error('createRules()');
        const order = Round.ORDER_NUMBER_POULE;

        const childRoundPoulePlaces = this.childRound.getPoulePlaces(order);

        const parentRoundPoulePlacesPer: PoulePlace[][] = this.getParentPoulePlacesPer();

        const poulePlaceDivider = new PoulePlaceDivider(this.childRound);

        while (childRoundPoulePlaces.length > 0 && parentRoundPoulePlacesPer.length > 0) {
            const qualifyRule = new QualifyRule(this.parentRound, this.childRound);

            const poulePlaces: PoulePlace[] = parentRoundPoulePlacesPer.shift();
            const nrOfPlacesToAdd = this.getNrOfToPlacesToAdd(parentRoundPoulePlacesPer);
            const nrOfToPoulePlaces = this.getNrOfToPoulePlaces(childRoundPoulePlaces.length, poulePlaces.length, nrOfPlacesToAdd);
            // to places
            for (let nI = 0; nI < nrOfToPoulePlaces; nI++) {
                if (childRoundPoulePlaces.length === 0) {
                    break;
                }
                qualifyRule.addToPoulePlace(childRoundPoulePlaces.shift());
            }
            // from places (needs toplaces)
            poulePlaceDivider.divide(qualifyRule, poulePlaces);
        }
        this.repairOverlappingRules();
        // console.log('createRules ended: ' + this.parentRound.getNumberAsValue() + ' < -> ' + this.childRound.getNumberAsValue());
    }

    protected getNrOfToPlacesToAdd(parentRoundPoulePlacesPer: PoulePlace[][]): number {
        let nrOfPlacesToAdd = 0;
        parentRoundPoulePlacesPer.forEach(poulePlaces => nrOfPlacesToAdd += poulePlaces.length);
        return nrOfPlacesToAdd;
    }

    protected getNrOfToPoulePlaces(childRoundPoulePlaces: number, nrOfPlacesAdding: number, nrOfPlacesToAdd: number): number {
        if (this.childRound.getWinnersOrLosers() === Round.WINNERS
           /* || this.childRound.getQualifyOrder() !== Round.QUALIFYORDER_CROSS */) {
            return nrOfPlacesAdding;
        }
        const nrOfPlacesTooMuch = (nrOfPlacesAdding + nrOfPlacesToAdd) - childRoundPoulePlaces;
        if (nrOfPlacesTooMuch > 0) {
            return (childRoundPoulePlaces % this.parentRound.getPoules().length);
        }
        return nrOfPlacesAdding;
    }

    protected repairOverlappingRules() {
        this.parentRound.getPoulePlaces().filter(poulePlace => poulePlace.getToQualifyRules().length > 1).forEach(poulePlace => {
            const winnersRule = poulePlace.getToQualifyRule(Round.WINNERS);
            const losersRule = poulePlace.getToQualifyRule(Round.LOSERS);
            if (winnersRule.isSingle() && losersRule.isMultiple()) {
                losersRule.removeFromPoulePlace(poulePlace);
            } else if (winnersRule.isMultiple() && losersRule.isSingle()) {
                winnersRule.removeFromPoulePlace(poulePlace);
            }
        });
    }

    protected getParentPoulePlacesPer(): PoulePlace[][] {
        console.error('getParentPoulePlacesPer');
        // if (this.childRound.getQualifyOrder() !== Round.QUALIFYORDER_RANK) {
        //     return this.getParentPoulePlacesPerNumber();
        // }
        return this.getParentPoulePlacesPerQualifyRule();
    }

    protected getParentPoulePlacesPerNumber(): PoulePlace[][] {
        if (this.childRound.getWinnersOrLosers() === Round.WINNERS) {
            return this.parentRound.getPoulePlacesPerNumber(Round.WINNERS);
        }
        const poulePlacesPerNumber: PoulePlace[][] = [];
        const nrOfPoules = this.parentRound.getPoules().length;
        const reversedPoulePlaces = this.parentRound.getPoulePlaces(Round.ORDER_NUMBER_POULE, true);
        let nrOfChildRoundPlaces = this.childRound.getPoulePlaces().length;
        while (nrOfChildRoundPlaces > 0) {
            let tmp = reversedPoulePlaces.splice(0, nrOfPoules).reverse().filter(poulePlace => {
                const toQualifyRule = poulePlace.getToQualifyRule(Round.WINNERS);
                return toQualifyRule === undefined || toQualifyRule.isMultiple();
            });
            // if( tmp.length > nrOfChildRoundPlaces ) {
            //     tmp = tmp.splice(0,nrOfChildRoundPlaces);
            // }
            poulePlacesPerNumber.unshift(tmp);
            nrOfChildRoundPlaces -= nrOfPoules;
        }
        return poulePlacesPerNumber;
    }

    protected getParentPoulePlacesPerQualifyRule(): PoulePlace[][] {
        const nrOfChildRoundPlaces = this.childRound.getPoulePlaces().length;

        const poulePlacesToAdd = this.getPoulePlacesPerParentFromQualifyRule();
        if (this.childRound.getWinnersOrLosers() === Round.LOSERS) {
            poulePlacesToAdd.splice(0, poulePlacesToAdd.length - nrOfChildRoundPlaces);
        }

        const poulePlacesPerQualifyRule = [];
        let placeNumber = 0;
        const poulePlacesPerNumberRank = this.parentRound.getPoulePlacesPerNumber(this.childRound.getWinnersOrLosers());
        while (poulePlacesToAdd.length > 0) {
            const tmp = poulePlacesToAdd.splice(0, poulePlacesPerNumberRank[placeNumber++].length);
            poulePlacesPerQualifyRule.push(tmp);
        }
        return poulePlacesPerQualifyRule;
    }

    protected getPoulePlacesPerParentFromQualifyRule(): PoulePlace[] {

        if (this.parentRound.isRoot()) {
            return this.parentRound.getPoulePlaces(Round.ORDER_NUMBER_POULE);
        }

        let poulePlaces = [];
        this.parentRound.getFromQualifyRules().forEach(parentFromQualifyRule => {
            const parentPoulePlaces = parentFromQualifyRule.getToPoulePlaces().slice();
            parentPoulePlaces.sort((pPoulePlaceA, pPoulePlaceB) => {
                if (pPoulePlaceA.getNumber() > pPoulePlaceB.getNumber()) {
                    return 1;
                }
                if (pPoulePlaceA.getNumber() < pPoulePlaceB.getNumber()) {
                    return -1;
                }
                if (pPoulePlaceA.getPoule().getNumber() > pPoulePlaceB.getPoule().getNumber()) {
                    return 1;
                }
                if (pPoulePlaceA.getPoule().getNumber() < pPoulePlaceB.getPoule().getNumber()) {
                    return -1;
                }
                return 0;
            });
            poulePlaces = poulePlaces.concat(parentPoulePlaces);
        });
        return poulePlaces;
    }

    removeRules() {
        // console.log('removeRules: ' + this.parentRound.getNumberAsValue() + ' < -> ' + this.childRound.getNumberAsValue());
        let fromQualifyRules = this.childRound.getFromQualifyRules().slice();
        fromQualifyRules.forEach(function (qualifyRuleIt) {
            while (qualifyRuleIt.getFromPoulePlaces().length > 0) {
                qualifyRuleIt.removeFromPoulePlace();
            }
            while (qualifyRuleIt.getToPoulePlaces().length > 0) {
                qualifyRuleIt.removeToPoulePlace();
            }
            qualifyRuleIt.setFromRound(undefined);
            qualifyRuleIt.setToRound(undefined);
        });
        fromQualifyRules = undefined;
    }
}