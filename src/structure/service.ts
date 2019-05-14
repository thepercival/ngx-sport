import { QualifyGroup } from '../../src/qualify/group';
import { Competition } from '../competition';
import { Poule } from '../poule';
import { HorizontalPoule } from '../poule/horizontal';
import { HorizontalPouleService } from '../poule/horizontal/service';
import { PoulePlace } from '../pouleplace';
import { QualifyRuleService } from '../qualify/rule/service';
import { Round } from '../round';
import { RoundNumber } from '../round/number';
import { RoundNumberConfigService } from '../round/number/config/service';
import { Structure } from '../structure';


export interface RoundStructureConfig {
    nrofcompetitors: number;
    nrofpoules: number;
}

export interface ICompetitorRange {
    min: number;
    max: number;
}

export class StructureService {

    static readonly DEFAULTS: number[] = [
        undefined, undefined, /* 2 */
        1, // 2
        1,
        1,
        1,
        2, // 6
        1,
        2,
        3,
        2, // 10
        2,
        3,
        3,
        3,
        3,
        4,
        4,
        4, // 18
        4,
        5,
        5,
        5,
        5,
        6, // 24
        5,
        6,
        9, // 27
        7,
        6,
        6,
        7,
        8, // 32
        6,
        6,
        7,
        6,
        7,
        7,
        7,
        8
    ];

    private configService: RoundNumberConfigService;

    constructor(
        private competitorRange: ICompetitorRange
    ) {
        this.configService = new RoundNumberConfigService();
    }

    // setMaxNrOfPoulePlacesForChildRound(maxNrOfPoulePlacesForChildRound: number) {
    //     this.maxNrOfPoulePlacesForChildRound = maxNrOfPoulePlacesForChildRound;
    // }

    create(competition: Competition, nrOfPlaces: number): Structure {
        const firstRoundNumber = new RoundNumber(competition);
        this.configService.createDefault(firstRoundNumber);
        const rootRound = new Round(firstRoundNumber, undefined);
        this.refillRound(rootRound, nrOfPlaces);
        return new Structure(firstRoundNumber, rootRound);
    }

    addPlaceToRootRound(round: Round): PoulePlace {
        const poules = round.getPoules();
        if (poules.length === 0) {
            throw new Error('er moet minimaal 1 poule aanwezig zijn');
        }
        if (round.getPlaces().length > this.competitorRange.max) {
            throw new Error('er mogen maximaal ' + this.competitorRange.max + ' deelnemers meedoen');
        }

        this.updateRound(round, round.getNrOfPlaces() + 1, round.getPoules().length)

        return round.getFirstHorizontalPoule(QualifyGroup.LOSERS).getFirstPlace();

        // const nrOfPlacesNotEven = places.length % poules.length;

        // let pouleToAddTo = poules[0];
        // if (nrOfPlacesNotEven > 0) {
        //     pouleToAddTo = poules.find(pouleIt => (nrOfPlacesNotEven + 1) === pouleIt.getNumber());
        // }
        // const poulePlace = new PoulePlace(pouleToAddTo);

        // // lines between should be merged???
        // const horizontalPouleService = new HorizontalPouleService(round);
        // horizontalPouleService.recreate();

        // [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
        //     this.updateQualifyGroups(round, winnersOrLosers, round.getNrOfPlacesChildren(winnersOrLosers));
        // });

        // const qualifyRuleService = new QualifyRuleService(round);
        // qualifyRuleService.recreate();
        // // lines between should be merged???

        // return poulePlace;
    }

    removePlaceFromRootRound(round: Round) {
        // console.log('removePoulePlace for round ' + round.getNumberAsValue());
        const places = round.getPlaces();
        if (places.length === round.getNrOfPlacesChildren()) {
            throw new Error('de deelnemer kan niet verwijderd worden, omdat alle deelnemer naar de volgende ronde gaan');
        }
        if (this.competitorRange.min && places.length === this.competitorRange.min) {
            throw new Error('er moeten minimaal ' + this.competitorRange.min + ' deelnemers zijn');
        }
        this.updateRound(round, round.getNrOfPlaces() - 1, round.getPoules().length)
        // const pouleToRemoveFrom = round.getHorizontalPoules(QualifyGroup.LOSERS)[0];
        // if (pouleToRemoveFrom.getPlaces().length === 2) {
        //     this.removePouleHelper(round);
        //     return;
        // }

        // const placeToRemove = pouleToRemoveFrom.getPlaces()[0];
        // this.removePlaceHelper(placeToRemove);

        // lines between should be merged???


        // [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
        //     this.updateQualifyGroups(round, winnersOrLosers, round.getNrOfPlacesChildren(winnersOrLosers));
        // });


        // lines between should be merged???
    }

    // protected removePlaceHelper(place: PoulePlace): boolean {
    //     const places = place.getPoule().getPlaces();
    //     const index = places.indexOf(place);
    //     if (index === -1) {
    //         return false;
    //     }
    //     places.splice(index, 1);
    //     place.setPoule(undefined);
    //     places.forEach(function (placeIt) {
    //         if (placeIt.getNumber() > place.getNumber()) {
    //             placeIt.setNumber(placeIt.getNumber() - 1);
    //         }
    //     });
    //     place.setNumber(undefined);
    //     return true;
    // }

    protected updateRound(round: Round, nrOfPlaces: number, nrOfPoules: number) {
        if (round.getNrOfPlaces() === nrOfPlaces) {
            return;
        }
        this.refillRound(round, nrOfPlaces, nrOfPoules);

        const horizontalPouleService = new HorizontalPouleService(round);
        horizontalPouleService.recreate();

        const qualifyRuleService = new QualifyRuleService(round);
        qualifyRuleService.recreate();

        [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
            this.updateQualifyGroups(round, winnersOrLosers, round.getNrOfPlacesChildren(winnersOrLosers));
        });

    }

    protected updateQualifyGroups(round: Round, winnersOrLosers: number, nrOfPlaces: number) {

        if (nrOfPlaces > round.getNrOfPlaces()) {
            nrOfPlaces = round.getNrOfPlaces();
        }

        const roundHorizontalPoules = round.getHorizontalPoules(winnersOrLosers).slice();
        const nrOfPoules = round.getPoules().length;
        const qualifyGroups = round.getQualifyGroups(winnersOrLosers);
        const removedQualifyGroups = qualifyGroups.splice(0, qualifyGroups.length);
        while (nrOfPlaces > 0) {
            let qualifyGroup = removedQualifyGroups.pop();
            let qualifyGroupNrOfPlaces;
            if (qualifyGroup === undefined) {
                qualifyGroup = new QualifyGroup(round, winnersOrLosers);
                qualifyGroup.setChildRound(new Round(round.getNumber().getNext(), qualifyGroup));
                qualifyGroupNrOfPlaces = nrOfPlaces;
            } else {
                qualifyGroupNrOfPlaces = qualifyGroup.getChildRound().getNrOfPlaces();
                if (qualifyGroupNrOfPlaces > nrOfPlaces) {
                    qualifyGroupNrOfPlaces = nrOfPlaces;
                }
            }
            const horizontalPoules = qualifyGroup.getHorizontalPoules();
            horizontalPoules.splice(0, horizontalPoules.length);
            let qualifyGroupNrOfPlacesAdded = 0;
            while (qualifyGroupNrOfPlacesAdded < qualifyGroupNrOfPlaces) {
                horizontalPoules.push(roundHorizontalPoules.pop())
                qualifyGroupNrOfPlacesAdded += nrOfPoules;
            }
            nrOfPlaces -= qualifyGroupNrOfPlaces;
            this.updateRound(qualifyGroup.getChildRound(), winnersOrLosers, qualifyGroupNrOfPlaces)
        }
    }


    // restructureQualifyGroup(round: Round, jsonQualifyGroupCreate: JsonRoundCreate) {
    //     const removeService = new StructureRemoveService(round);



    //     // removeQualifier(round: Round, winnersOrLosers: Number) vanaf round naar beneden opnieuw genereren
    //     // addQualifier(round: Round, winnersOrLosers: Number) vanaf round naar beneden opnieuw genereren
    //     // mergeQualifyGroups(qualifyGroupA, qualifyGroupB) vanaf round naar beneden opnieuw genereren
    //     // splitQualifyGroup(qualifyGroup) vanaf round naar beneden opnieuw genereren
    // }

    protected movePlace(place: PoulePlace, toNumber: number) {
        const places = place.getPoule().getPlaces();
        if (toNumber > places.length) {
            toNumber = places.length;
        }
        if (toNumber < 1) {
            toNumber = 1;
        }

        // find index of place with same number
        const foundPlace = places.find(pouleplaceIt => toNumber === pouleplaceIt.getNumber());

        // remove item
        {
            const index = places.indexOf(place);
            if (index === -1) {
                return;
            }
            places.splice(index, 1);
        }

        // insert item
        {
            const index = places.indexOf(foundPlace);
            // insert item
            places.splice(index, 0, place);
        }

        // update numbers from foundPlace
        let number = 1;
        places.forEach(function (poulePlaceIt) {
            poulePlaceIt.setNumber(number++);
        });

        return true;
    }

    private addChildRound(parentRound: Round, winnersOrLosers: number, nrOfPlaces: number): Round {
        console.error('addChildRound');
        return undefined;
        // let nextRoundNumber = parentRound.getNumber().getNext();
        // if (nextRoundNumber === undefined) {
        //     nextRoundNumber = parentRound.getNumber().createNext();
        //     this.configService.createFromPrevious(nextRoundNumber);
        // }
        // const round = new Round(nextRoundNumber, parentRound, winnersOrLosers);
        // return this.fillRound(round, nrOfPlaces);
    }

    // private fillRound(round: Round, nrOfPlaces: number/*, opposing: number*/): Round {
    private refillRound(round: Round, nrOfPlaces: number, nrOfPoules?: number): Round {
        if (nrOfPlaces <= 0) {
            return;
        }
        const poules = round.getPoules();
        poules.splice(0, poules.length);

        let nrOfPoulesToAdd = nrOfPoules ? nrOfPoules : this.getDefaultNrOfPoules(nrOfPlaces);
        while (nrOfPlaces > 0) {
            const nrOfPlacesToAdd = this.getNrOfPlacesPerPoule(nrOfPlaces, nrOfPoulesToAdd);
            const poule = new Poule(round);
            for (let i = 0; i < nrOfPlacesToAdd; i++) {
                new PoulePlace(poule);
            }
            nrOfPlaces -= nrOfPlacesToAdd;
            nrOfPoulesToAdd--;
        }
        // connecting rounds needs to be done somewhere else
        // console.error('fillRound');
        // if (!round.isRoot()) {
        //     const qualifyService = new QualifyRuleService(round.getParent(), round);
        //     qualifyService.removeRules();
        //     qualifyService.createRules();
        // }
        return round;
    }

    protected removeChildRound(parentRound: Round, winnersOrLosers: number): Round {
        console.error('removeChildRound');
        return undefined;
        // const childRound = parentRound.getChildRound(winnersOrLosers);
        // if (childRound === undefined) {
        //     return undefined;
        // }
        // const roundNumber = childRound.getNumber();
        // const numberRounds = roundNumber.getRounds();
        // const indexNumber = numberRounds.indexOf(childRound);
        // if (indexNumber > -1) {
        //     // console.log('removeRound from number, number: ' + childRound.getNumberAsValue());
        //     numberRounds.splice(indexNumber, 1);
        //     if (numberRounds.length === 0) {
        //         parentRound.getNumber().removeNext();
        //         // console.log('removeRoundNumber, number: ' + childRound.getNumberAsValue());
        //     }
        // }
        // const index = parentRound.getChildRounds().indexOf(childRound);

        // // console.log('removeRound from parent, number: ' + childRound.getNumberAsValue());
        // parentRound.getChildRounds().splice(index, 1);
        // const qualifyService = new QualifyRuleService(parentRound, childRound);
        // qualifyService.removeRules();
        // return childRound;
    }

    protected addPoule(round: Round, fillPouleTo: number = 2): number {
        console.error('addPoule');
        return 0;
        // // console.log('addPoule for round ' + round.getNumberAsValue());
        // const poules = round.getPoules();
        // const poulePlacesOrderedByPlace = round.getPlaces(Round.ORDER_NUMBER_POULE);
        // const nrOfPlacesNotEvenOld = poulePlacesOrderedByPlace.length % poules.length;
        // const placesPerPouleOld = (poulePlacesOrderedByPlace.length - nrOfPlacesNotEvenOld) / poules.length;
        // const newPoule = new Poule(round);
        // const nrOfPlacesNotEven = poulePlacesOrderedByPlace.length % poules.length;
        // let placesToAddToNewPoule = (poulePlacesOrderedByPlace.length - nrOfPlacesNotEven) / poules.length;

        // if (placesPerPouleOld === 2 && nrOfPlacesNotEvenOld < 2) {
        //     placesToAddToNewPoule = nrOfPlacesNotEvenOld;
        // }


        // const structureService = this;
        // while (placesToAddToNewPoule > 0) {

        //     poulePlacesOrderedByPlace.forEach(poulePlaceIt => {
        //         if (poulePlaceIt.getNumber() === 1 || placesToAddToNewPoule === 0) {
        //             return;
        //         }
        //         structureService.movePoulePlace(round, poulePlaceIt, newPoule);
        //         placesToAddToNewPoule--;
        //     });
        // }

        // // there could be a place left in the last placenumber which does not start at the first poule
        // const horizontalPoulesParentRound = round.getHorizontalPoules(QualifyGroup.WINNERS);
        // const lastHorizontalPoule = horizontalPoulesParentRound.pop();
        // let pouleIt = round.getPoules()[0];
        // lastHorizontalPoule.getPlaces().forEach(function (lastPoulePlaceIt) {
        //     if (lastPoulePlaceIt.getPoule() !== pouleIt) {
        //         this.movePoulePlace(round, lastPoulePlaceIt, pouleIt);
        //     }
        //     pouleIt = pouleIt.next();
        // });

        // while (newPoule.getPlaces().length < fillPouleTo) {
        //     const tmp = new PoulePlace(newPoule);
        // }

        // this.recalculateQualifyRulesForRound(round);
        // return newPoule.getPlaces().length;
    }

    protected removePoule(round: Round): boolean {
        console.error('removePoule');
        // // console.log('removePoule for round ' + round.getNumberAsValue());
        // const poules = round.getPoules();
        // const roundPlaces = round.getPlaces();
        // if (poules.length === 1) {
        //     throw new Error('er moet minimaal 1 poule zijn');
        // }
        // const lastPoule = poules[poules.length - 1];
        // const places = lastPoule.getPlaces();
        // while (places.length > 0) {
        //     const place = places[places.length - 1];
        //     const nrOfPlacesNotEven = ((roundPlaces.length - lastPoule.getPlaces().length) % (poules.length - 1)) + 1;
        //     const poule = poules.find(pouleIt => nrOfPlacesNotEven === pouleIt.getNumber());
        //     if (!this.movePoulePlace(round, place, poule)) {
        //         throw new Error('de pouleplek kan niet verplaatst worden');
        //     }
        // }
        // try {
        //     this.removePouleHelper(lastPoule);
        // } catch (e) {
        //     throw new Error('er moet minimaal 1 poule zijn');
        // }

        // if (recalcQualify === true) {
        //     this.recalculateQualifyRulesForRound(round);
        // }
        return true;
    }

    private removePouleHelper(round: Round): boolean {
        const poules = round.getPoules();
        const poule = poules[poules.length - 1];
        const index = poules.indexOf(poule);
        if (index > -1) {
            poules.splice(index, 1);
            return true;
        }
        return false;
    }

    protected recalculateQualifyRulesForRound(round: Round, recalculateChildRounds: boolean = true) {
        console.error('recalculateQualifyRulesForRound');
        // if (!round.isRoot()) {
        //     const qualifyService = new QualifyRuleService(round.getParent(), round);
        //     qualifyService.removeRules();
        //     qualifyService.createRules();
        // }
        // if (recalculateChildRounds) {
        //     round.getChildRounds().forEach(function (childRound) {
        //         const qualifyService = new QualifyRuleService(childRound.getParent(), childRound);
        //         qualifyService.removeRules();
        //         qualifyService.createRules();
        //     });
        // }
    }

    // protected removePoulePlace(round, recalcQualify: boolean = true): number {
    //     // console.log('removePoulePlace for round ' + round.getNumberAsValue());
    //     const places = round.getPoulePlaces();
    //     const poules = round.getPoules();
    //     if (poules.length === 0) {
    //         throw new Error('er moet minimaal 1 poule aanwezig zijn');
    //     }

    //     const nrOfPlacesNotEven = places.length % poules.length;
    //     let pouleToRemoveFrom = poules[poules.length - 1];
    //     if (nrOfPlacesNotEven > 0) {
    //         pouleToRemoveFrom = poules.find(pouleIt => nrOfPlacesNotEven === pouleIt.getNumber());
    //     }

    //     const placesTmp = pouleToRemoveFrom.getPlaces();
    //     if (round.getNumber().isFirst()) {
    //         if (this.competitorRange.min && placesTmp.length === this.competitorRange.min) {
    //             throw new Error('er moeten minimaal ' + this.competitorRange.min + ' deelnemers per poule zijn');
    //         }
    //     }

    //     // if (places.length === 1) {
    //     //     this.removeRound(round.getParent(), round.getWinnersOrLosers());
    //     //     return 1;
    //     // }

    //     let nrOfRemovedPlaces = 1;
    //     pouleToRemoveFrom.removePlace(placesTmp[placesTmp.length - 1]);
    //     if (placesTmp.length === 1 && poules.length > 1) {
    //         this.removePoule(round, !recalcQualify);
    //         nrOfRemovedPlaces++;
    //     }

    //     const tooMuchChildRoundPlaces = round.getNrOfPlacesChildRounds() > round.getPoulePlaces().length;
    //     if (recalcQualify === true) {
    //         // do parent, because opposing can be changed too!
    //         this.recalculateQualifyRulesForRound(round.isRoot() ? round : round.getParent());
    //     }

    //     if (tooMuchChildRoundPlaces) {
    //         let childRoundToRemovePlace = round.getChildRound(QualifyGroup.LOSERS);
    //         if (childRoundToRemovePlace === undefined) {
    //             childRoundToRemovePlace = round.getChildRound(QualifyGroup.WINNERS);
    //         }
    //         if (childRoundToRemovePlace !== undefined) {
    //             this.removePoulePlace(childRoundToRemovePlace, recalcQualify);
    //         }
    //     }

    //     // remove childrounds with no pouleplaces
    //     if (round.getPoulePlaces().length < 1) {
    //         round.getChildRounds().forEach(function (childRound) {
    //             this.removeChildRound(round, childRound.getWinnersOrLosers());
    //         }, this);
    //         this.removeChildRound(round.getParent(), round.getWinnersOrLosers());
    //     }

    //     return nrOfRemovedPlaces;
    // }

    /**
     * when removePoulePlace is rescursively called, qualifyRules are not always uptodate
     * that's why this function is introduced, realtime qualifyrules are better!
     *
     * @param round Round
     * @param childRound Round
     */
    private removePoulePlaceHelper(round: Round, childRound: Round) {
        console.error('removePoulePlaceHelper()');
        // const poulePlacesToRound = childRound.getPlaces();
        // round.getToQualifyRules(childRound.getWinnersOrLosers()).forEach(toQualifyRule => {
        //     const toPoulePlaces = toQualifyRule.getToPoulePlaces();
        //     toPoulePlaces.forEach(toPoulePlace => {
        //         const index = poulePlacesToRound.indexOf(toPoulePlace);
        //         if (index === -1) {
        //             toPoulePlaces.splice(index, 1);
        //         }
        //     });
        // });
    }

    protected changeNrOfPlacesChildRound(nrOfChildPlacesNew: number, parentRound: Round, winnersOrLosers: number) {
        console.error('changeNrOfPlacesChildRound');
        // // console.log('changeNrOfPlacesChildRound(' + nrOfChildPlacesNew + ', parentRound: ' + parentRound.getNumber()
        // //     + ', winnersOrLosers: ' + winnersOrLosers + ')');
        // let childRound = parentRound.getChildRound(winnersOrLosers);
        // let addRound = (childRound === undefined && nrOfChildPlacesNew > 0);
        // if (childRound !== undefined && childRound.getPoulePlaces().length > 0 && nrOfChildPlacesNew === 2) {
        //     // const qualifyServiceIn = new QualifyRuleService(childRound.getParent(), childRound);
        //     // qualifyServiceIn.removeRules();
        //     this.removeChildRound(parentRound, winnersOrLosers);
        //     childRound = undefined;
        //     addRound = true;
        // }

        // if (addRound) {
        //     childRound = this.addChildRound(parentRound, winnersOrLosers, nrOfChildPlacesNew);
        //     this.recalculateQualifyRulesForRound(childRound, false);
        //     return;
        // }
        // if (childRound === undefined) {
        //     return;
        // }

        // const nrOfPlacesChildRound = childRound.getPoulePlaces().length;
        // let nrOfPlacesDifference = nrOfChildPlacesNew - nrOfPlacesChildRound;
        // if (nrOfPlacesDifference === 0) {
        //     return;
        // }
        // if (nrOfPlacesDifference < 0) {
        //     while (nrOfPlacesDifference < 0) {
        //         nrOfPlacesDifference += this.removePoulePlace(childRound);
        //     }
        // } else {
        //     for (let nI = 0; nI < nrOfPlacesDifference; nI++) {
        //         this.addPoulePlace(childRound, false);
        //     }
        //     this.checkMaxNrOfPoulePlacesForChildRound(childRound);
        //     this.recalculateQualifyRulesForRound(childRound);
        // }
    }

    private checkMaxNrOfPoulePlacesForChildRound(childRound: Round) {
        console.log('checkMaxNrOfPoulePlacesForChildRound');
        // const nrOfPoules = childRound.getPoules().length;
        // const nrOfPlaces = childRound.getNrOfPlaces();
        // const onePouleTwoOrThreePlaces = nrOfPoules === 1 && (nrOfPlaces === 2 || nrOfPlaces === 3);
        // if (onePouleTwoOrThreePlaces) {
        //     return;
        // }
        // if (this.getNrOfPlacesPerPoule(nrOfPlaces - 1, nrOfPoules) <= this.maxNrOfPoulePlacesForChildRound) {
        //     return;
        // }
        // const newPoule = new Poule(childRound);
        // const poulePlaces = childRound.getPlaces(Round.ORDER_NUMBER_POULE);
        // while (newPoule.getPlaces().length < (this.maxNrOfPoulePlacesForChildRound - 1)) {
        //     const poulePlace = poulePlaces.pop();
        //     this.movePoulePlace(childRound, poulePlace, newPoule);
        // }
        // const poulePlaceTmp = poulePlaces.pop();
        // if (newPoule.getPlaces().length === (this.maxNrOfPoulePlacesForChildRound - 1)
        //     && poulePlaceTmp.getNumber() > this.maxNrOfPoulePlacesForChildRound) {
        //     this.movePoulePlace(childRound, poulePlaceTmp, newPoule);
        // }
    }

    getDefaultNrOfPoules(nrOfPlaces): number {
        if (nrOfPlaces < this.competitorRange.min || nrOfPlaces > this.competitorRange.max) {
            return undefined;
        }
        return StructureService.DEFAULTS[nrOfPlaces];
    }

    getNrOfPlacesPerPoule(nrOfPlaces: number, nrOfPoules: number): number {
        const nrOfPlaceLeft = (nrOfPlaces % nrOfPoules);
        if (nrOfPlaceLeft === 0) {
            return nrOfPlaces / nrOfPoules;
        }
        return ((nrOfPlaces - nrOfPlaceLeft) / nrOfPoules) + 1;
    }

    protected getHorizontalPoules(winnersOrLosers: number): HorizontalPoule[] {
        const horizontalPoules: HorizontalPoule[] = [];

        return horizontalPoules;
    }

    // protected movePoulePlace(round: Round, poulePlace: PoulePlace, toPoule: Poule, toNumber?: number) {
    //     const removed = poulePlace.getPoule().removePlace(poulePlace);
    //     if (!removed) {
    //         return false;
    //     }

    //     // zet poule and position
    //     poulePlace.setNumber(toPoule.getPlaces().length + 1);
    //     toPoule.addPlace(poulePlace);

    //     if (toNumber === undefined) {
    //         return true;
    //     }
    //     return toPoule.movePlace(poulePlace, toNumber);
    // }
}