import { PoulePlace } from '../../pouleplace';
import { QualifyRule } from '../../qualify/rule';
import { QualifyRuleMultiple } from '../../qualify/rule/multiple';
import { QualifyRuleSingle } from '../../qualify/rule/single';
import { Round } from '../../round';
import { QualifyGroup } from '../group';
import { QualifyReservationService } from '../reservationservice';
import { QualifyRuleQueue } from './queue';

export class QualifyRuleService {

    constructor(private round: Round) {
    }

    recreateTo() {
        this.removeTo(this.round);
        this.createTo(this.round);
    }

    recreateFrom() {
        const parentRound = this.round.getParent();
        if (parentRound === undefined) {
            return;
        }
        this.removeTo(parentRound);
        this.createTo(parentRound);
    }

    protected removeTo(round: Round) {
        round.getPlaces().forEach(place => {
            const toQualifyRules = place.getToQualifyRules();
            toQualifyRules.forEach(toQualifyRule => {
                let toPlaces: PoulePlace[] = [];
                if (toQualifyRule.isMultiple()) {
                    toPlaces = toPlaces.concat((<QualifyRuleMultiple>toQualifyRule).getToPlaces());
                } else {
                    toPlaces.push((<QualifyRuleSingle>toQualifyRule).getToPlace());
                }
                toPlaces.forEach(toPlace => toPlace.setFromQualifyRule(undefined));
            });
            toQualifyRules.splice(0, toQualifyRules.length);
        });
        // console.log('removeRules: ' + this.parentRound.getNumberAsValue() + ' < -> ' + this.childRound.getNumberAsValue());
        // let fromQualifyRules = this.childRound.getFromQualifyRules().slice();
        // fromQualifyRules.forEach(function (qualifyRuleIt) {
        //     while (qualifyRuleIt.getFromPoulePlaces().length > 0) {
        //         qualifyRuleIt.removeFromPoulePlace();
        //     }
        //     while (qualifyRuleIt.getToPoulePlaces().length > 0) {
        //         qualifyRuleIt.removeToPoulePlace();
        //     }
        //     qualifyRuleIt.setFromRound(undefined);
        //     qualifyRuleIt.setToRound(undefined);
        // });
        // fromQualifyRules = undefined;
    }

    protected createTo(round: Round) {
        const queue = new QualifyRuleQueue();

        round.getQualifyGroups(QualifyGroup.WINNERS).forEach(qualifyGroup => {

            const childRound = qualifyGroup.getChildRound();
            const qualifyReservationService = new QualifyReservationService(childRound);

            // add rules and set from places
            {
                qualifyGroup.getHorizontalPoules().forEach(horizontalPoule => {
                    if (horizontalPoule.isBorderPoule() && qualifyGroup.getNrOfToPlacesShort() > 0) {
                        const nrOfToPlacesBorderPoule = qualifyGroup.getChildRound().getNrOfPlaces() % round.getPoules().length;
                        queue.add(QualifyRuleQueue.START, new QualifyRuleMultiple(horizontalPoule, nrOfToPlacesBorderPoule));
                    } else {
                        horizontalPoule.getPlaces().forEach(place => {
                            queue.add(QualifyRuleQueue.START, new QualifyRuleSingle(place, qualifyGroup));
                        });
                    }
                });
            }            
            queue.shuffleIfUnevenAndNoMultiple(childRound.getPoules().length);

            // update rules with to places
            const toHorPoules = childRound.getHorizontalPoules(QualifyGroup.WINNERS);            
            let startEnd = QualifyRuleQueue.START;
            while (toHorPoules.length > 0) {
                const toHorPoule = startEnd === QualifyRuleQueue.START ? toHorPoules.shift() : toHorPoules.pop();
                toHorPoule.getPlaces().forEach(place => {
                    this.connectPlaceWithRule(place, queue, startEnd, qualifyReservationService);
                });
                startEnd = queue.toggle(startEnd);
            }
        });
    }

    private connectPlaceWithRule(childPlace: PoulePlace, queue: QualifyRuleQueue, startEnd: number, reservationService: QualifyReservationService) {

        const setToPlacesAndReserve = (qualifyRule: QualifyRule) => {
            if (qualifyRule.isSingle()) {
                reservationService.reserve(childPlace.getPoule().getNumber(), (<QualifyRuleSingle>qualifyRule).getFromPoule());
                (<QualifyRuleSingle>qualifyRule).setToPlace(childPlace);
            } else {
                (<QualifyRuleMultiple>qualifyRule).addToPlace(childPlace);
                if (!(<QualifyRuleMultiple>qualifyRule).toPlacesComplete()) {
                    queue.add(QualifyRuleQueue.START, qualifyRule);                    
                }
            }
        };

        const unfreeQualifyRules: QualifyRule[] = [];
        let oneQualifyRuleConnected = false;
        while (!oneQualifyRuleConnected && !queue.isEmpty()) {
            const qualifyRule = queue.remove(startEnd);
            if (!qualifyRule.isMultiple() && !reservationService.isFree(childPlace.getPoule().getNumber(), (<QualifyRuleSingle>qualifyRule).getFromPoule())) {
                unfreeQualifyRules.push(qualifyRule);
                continue;
            }
            setToPlacesAndReserve(qualifyRule);
            oneQualifyRuleConnected = true;
        }
        if (startEnd === QualifyRuleQueue.END) {
            unfreeQualifyRules.reverse();
        }
        if( !oneQualifyRuleConnected ) {
            setToPlacesAndReserve(unfreeQualifyRules.shift());                    
        }
        
        while (unfreeQualifyRules.length > 0) {
            queue.add( startEnd, unfreeQualifyRules.shift() );
        }
    }    

    // protected getNrOfToPlacesToAdd(parentRoundPoulePlacesPer: PoulePlace[][]): number {
    //     let nrOfPlacesToAdd = 0;
    //     parentRoundPoulePlacesPer.forEach(poulePlaces => nrOfPlacesToAdd += poulePlaces.length);
    //     return nrOfPlacesToAdd;
    // }

    // protected getNrOfToPoulePlaces(childRoundPoulePlaces: number, nrOfPlacesAdding: number, nrOfPlacesToAdd: number): number {
    //     if (this.childRound.getWinnersOrLosers() === QualifyGroup.WINNERS
    //        /* || this.childRound.getQualifyOrder() !== Round.QUALIFYORDER_CROSS */) {
    //         return nrOfPlacesAdding;
    //     }
    //     const nrOfPlacesTooMuch = (nrOfPlacesAdding + nrOfPlacesToAdd) - childRoundPoulePlaces;
    //     if (nrOfPlacesTooMuch > 0) {
    //         return (childRoundPoulePlaces % this.parentRound.getPoules().length);
    //     }
    //     return nrOfPlacesAdding;
    // }

    // protected repairOverlappingRules() {
    //     this.parentRound.getPoulePlaces().filter(poulePlace => poulePlace.getToQualifyRules().length > 1).forEach(poulePlace => {
    //         const winnersRule = poulePlace.getToQualifyRule(QualifyGroup.WINNERS);
    //         const losersRule = poulePlace.getToQualifyRule(QualifyGroup.LOSERS);
    //         if (winnersRule.isSingle() && losersRule.isMultiple()) {
    //             losersRule.removeFromPoulePlace(poulePlace);
    //         } else if (winnersRule.isMultiple() && losersRule.isSingle()) {
    //             winnersRule.removeFromPoulePlace(poulePlace);
    //         }
    //     });
    // }

    // protected getParentPoulePlacesPer(): PoulePlace[][] {
    //     console.error('getParentPoulePlacesPer');
    //     // if (this.childRound.getQualifyOrder() !== Round.QUALIFYORDER_RANK) {
    //     //     return this.getParentPoulePlacesPerNumber();
    //     // }
    //     return this.getParentPoulePlacesPerQualifyRule();
    // }

    // protected getParentPoulePlacesPerNumber(): PoulePlace[][] {
    //     if (this.childRound.getWinnersOrLosers() === QualifyGroup.WINNERS) {
    //         return this.parentRound.getPoulePlacesPerNumber(QualifyGroup.WINNERS);
    //     }
    //     const poulePlacesPerNumber: PoulePlace[][] = [];
    //     const nrOfPoules = this.parentRound.getPoules().length;
    //     const reversedPoulePlaces = this.parentRound.getPoulePlaces(Round.ORDER_NUMBER_POULE, true);
    //     let nrOfChildRoundPlaces = this.childRound.getPoulePlaces().length;
    //     while (nrOfChildRoundPlaces > 0) {
    //         let tmp = reversedPoulePlaces.splice(0, nrOfPoules).reverse().filter(poulePlace => {
    //             const toQualifyRule = poulePlace.getToQualifyRule(QualifyGroup.WINNERS);
    //             return toQualifyRule === undefined || toQualifyRule.isMultiple();
    //         });
    //         // if( tmp.length > nrOfChildRoundPlaces ) {
    //         //     tmp = tmp.splice(0,nrOfChildRoundPlaces);
    //         // }
    //         poulePlacesPerNumber.unshift(tmp);
    //         nrOfChildRoundPlaces -= nrOfPoules;
    //     }
    //     return poulePlacesPerNumber;
    // }

    // protected getParentPoulePlacesPerQualifyRule(): PoulePlace[][] {
    //     const nrOfChildRoundPlaces = this.childRound.getPoulePlaces().length;

    //     const poulePlacesToAdd = this.getPoulePlacesPerParentFromQualifyRule();
    //     if (this.childRound.getWinnersOrLosers() === QualifyGroup.LOSERS) {
    //         poulePlacesToAdd.splice(0, poulePlacesToAdd.length - nrOfChildRoundPlaces);
    //     }

    //     const poulePlacesPerQualifyRule = [];
    //     let placeNumber = 0;
    //     const poulePlacesPerNumberRank = this.parentRound.getPoulePlacesPerNumber(this.childRound.getWinnersOrLosers());
    //     while (poulePlacesToAdd.length > 0) {
    //         const tmp = poulePlacesToAdd.splice(0, poulePlacesPerNumberRank[placeNumber++].length);
    //         poulePlacesPerQualifyRule.push(tmp);
    //     }
    //     return poulePlacesPerQualifyRule;
    // }

    // protected getPoulePlacesPerParentFromQualifyRule(): PoulePlace[] {

    //     if (this.parentRound.isRoot()) {
    //         return this.parentRound.getPoulePlaces(Round.ORDER_NUMBER_POULE);
    //     }
    //     console.error('getPoulePlacesPerParentFromQualifyRule');
    //     let poulePlaces = [];
    //     // this.parentRound.getFromQualifyRules().forEach(parentFromQualifyRule => {
    //     //     const parentPoulePlaces = parentFromQualifyRule.getToPoulePlaces().slice();
    //     //     parentPoulePlaces.sort((pPoulePlaceA, pPoulePlaceB) => {
    //     //         if (pPoulePlaceA.getNumber() > pPoulePlaceB.getNumber()) {
    //     //             return 1;
    //     //         }
    //     //         if (pPoulePlaceA.getNumber() < pPoulePlaceB.getNumber()) {
    //     //             return -1;
    //     //         }
    //     //         if (pPoulePlaceA.getPoule().getNumber() > pPoulePlaceB.getPoule().getNumber()) {
    //     //             return 1;
    //     //         }
    //     //         if (pPoulePlaceA.getPoule().getNumber() < pPoulePlaceB.getPoule().getNumber()) {
    //     //             return -1;
    //     //         }
    //     //         return 0;
    //     //     });
    //     //     poulePlaces = poulePlaces.concat(parentPoulePlaces);
    //     // });
    //     return poulePlaces;
    // }

    // removeRules() {
    //     console.error('removeRules()');
    //     // console.log('removeRules: ' + this.parentRound.getNumberAsValue() + ' < -> ' + this.childRound.getNumberAsValue());
    //     // let fromQualifyRules = this.childRound.getFromQualifyRules().slice();
    //     // fromQualifyRules.forEach(function (qualifyRuleIt) {
    //     //     while (qualifyRuleIt.getFromPoulePlaces().length > 0) {
    //     //         qualifyRuleIt.removeFromPoulePlace();
    //     //     }
    //     //     while (qualifyRuleIt.getToPoulePlaces().length > 0) {
    //     //         qualifyRuleIt.removeToPoulePlace();
    //     //     }
    //     //     qualifyRuleIt.setFromRound(undefined);
    //     //     qualifyRuleIt.setToRound(undefined);
    //     // });
    //     // fromQualifyRules = undefined;
    // }
}