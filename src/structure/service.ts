import { Competition } from '../competition';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { QualifyRule } from '../qualify/rule';
import { QualifyService } from '../qualify/service';
import { Round } from '../round';
import { RoundNumber } from '../round/number';
import { RoundNumberConfigService } from '../round/number/config/service';
import { Structure } from '../structure';

/**
 * Created by coen on 22-3-17.
 */

export interface IRoundStructure {
    nrofpoules: number;
    nrofwinners: number;
}

export interface ICompetitorRange {
    min: number;
    max: number;
}

export class StructureService {

    static readonly DEFAULTS: IRoundStructure[] = [
        undefined, undefined,
        { nrofpoules: 1, nrofwinners: 1 }, // 2
        { nrofpoules: 1, nrofwinners: 1 },
        { nrofpoules: 1, nrofwinners: 1 },
        { nrofpoules: 1, nrofwinners: 2 },
        { nrofpoules: 2, nrofwinners: 2 }, // 6
        { nrofpoules: 1, nrofwinners: 1 },
        { nrofpoules: 2, nrofwinners: 2 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 2, nrofwinners: 2 }, // 10
        { nrofpoules: 2, nrofwinners: 2 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 4, nrofwinners: 4 },
        { nrofpoules: 4, nrofwinners: 4 },
        { nrofpoules: 4, nrofwinners: 8 },
        { nrofpoules: 4, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 7, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 7, nrofwinners: 8 },
        { nrofpoules: 8, nrofwinners: 16 }, // 32
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 7, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 }
    ];

    private configService: RoundNumberConfigService;

    constructor(
        private competitorRange: ICompetitorRange
    ) {
        this.configService = new RoundNumberConfigService();
    }

    create(competition: Competition, nrOfPlaces: number): Structure {
        const firstRoundNumber = new RoundNumber(competition);
        this.configService.createConfig(firstRoundNumber);
        const rootRound = new Round(firstRoundNumber, undefined, 0);
        this.fillRound(rootRound, nrOfPlaces);
        return new Structure(firstRoundNumber, rootRound);
    }

    addRound(parentRound: Round, winnersOrLosers: number, nrOfPlaces: number): Round {
        let nextRoundNumber = parentRound.getNumber().getNext();
        if (nextRoundNumber === undefined) {
            nextRoundNumber = parentRound.getNumber().createNext();
            this.configService.createConfig(nextRoundNumber);
        }
        const round = new Round(nextRoundNumber, parentRound, winnersOrLosers);
        return this.fillRound(round, nrOfPlaces);
    }

    private fillRound(round: Round, nrOfPlaces: number/*, opposing: number*/): Round {
        if (nrOfPlaces <= 0) {
            return;
        }
        const roundStructure = this.getDefaultRoundStructure(round.getNumberAsValue(), nrOfPlaces);
        if (roundStructure === undefined) {
            return;
        }
        const nrOfPlacesPerPoule = this.getNrOfPlacesPerPoule(nrOfPlaces, roundStructure.nrofpoules);
        while (nrOfPlaces > 0) {
            const nrOfPlacesToAdd = nrOfPlaces < nrOfPlacesPerPoule ? nrOfPlaces : nrOfPlacesPerPoule;
            const poule = new Poule(round);
            for (let i = 0; i < nrOfPlacesToAdd; i++) {
                const tmp = new PoulePlace(poule);
            }
            nrOfPlaces -= nrOfPlacesPerPoule;
        }
        if (!round.isRoot()) {
            const qualifyService = new QualifyService(round.getParent(), round);
            qualifyService.removeRules();
            qualifyService.createRules();
        }
        return round;
    }

    protected removeRound(parentRound: Round, winnersOrLosers: number, recalcQualify: boolean = true): Round {
        const childRound = parentRound.getChildRound(winnersOrLosers);

        if (childRound !== undefined) {
            const roundNumber = childRound.getNumber();
            const numberRounds = roundNumber.getRounds();
            const indexNumber = numberRounds.indexOf(childRound);
            if (indexNumber > -1) {
                // console.log('removeRound from number, number: ' + childRound.getNumberAsValue());
                numberRounds.splice(indexNumber, 1);
                if (numberRounds.length === 0) {
                    parentRound.getNumber().removeNext();
                    // console.log('removeRoundNumber, number: ' + childRound.getNumberAsValue());
                }
            }
        }

        const index = parentRound.getChildRounds().indexOf(childRound);
        if (index > -1) {
            // console.log('removeRound from parent, number: ' + childRound.getNumberAsValue());
            parentRound.getChildRounds().splice(index, 1);
            if (recalcQualify === true) {
                this.recalculateQualifyRulesForRound(childRound, false);
            }
            return childRound;
        }
        return undefined;
    }

    addPoule(round: Round, fillPouleToMinimum: boolean = true, recalcQualify: boolean = true): number {
        // console.log('addPoule for round ' + round.getNumberAsValue());
        const poules = round.getPoules();
        const places = round.getPoulePlaces();
        const nrOfPlacesNotEvenOld = places.length % poules.length;
        const placesPerPouleOld = (places.length - nrOfPlacesNotEvenOld) / poules.length;
        const newPoule = new Poule(round);
        const nrOfPlacesNotEven = places.length % poules.length;
        let placesToAddToNewPoule = (places.length - nrOfPlacesNotEven) / poules.length;

        if (placesPerPouleOld === 2 && nrOfPlacesNotEvenOld < 2) {
            placesToAddToNewPoule = nrOfPlacesNotEvenOld;
        }

        const poulePlacesOrderedByPlace = round.getPoulePlaces(Round.ORDER_HORIZONTAL);
        while (placesToAddToNewPoule > 0) {

            poulePlacesOrderedByPlace.forEach(function (poulePlaceIt) {
                if (poulePlaceIt.getNumber() === 1 || placesToAddToNewPoule === 0) {
                    return;
                }
                round.movePoulePlace(poulePlaceIt, newPoule);
                placesToAddToNewPoule--;
            });
        }

        // there could be a place left in the last placenumber which does not start at the first poule
        const poulePlacesPerNumberParentRound = round.getPoulePlacesPerNumber(Round.WINNERS);
        const lastPoulePlaces = poulePlacesPerNumberParentRound.pop();
        let pouleIt = round.getPoules()[0];
        lastPoulePlaces.forEach(function (lastPoulePlaceIt) {
            if (lastPoulePlaceIt.getPoule() !== pouleIt) {
                round.movePoulePlace(lastPoulePlaceIt, pouleIt);
            }
            pouleIt = pouleIt.next();
        });

        if (fillPouleToMinimum === true) {
            while (newPoule.getPlaces().length < 2) {
                const tmp = new PoulePlace(newPoule);
            }
        }

        if (recalcQualify === true) {
            this.recalculateQualifyRulesForRound(round);
        }
        return newPoule.getPlaces().length;
    }

    removePoule(round: Round, recalcQualify: boolean = true): boolean {
        // console.log('removePoule for round ' + round.getNumberAsValue());
        const poules = round.getPoules();
        const roundPlaces = round.getPoulePlaces();
        if (poules.length === 1) {
            throw new Error('er moet minimaal 1 poule zijn');
        }
        const lastPoule = poules[poules.length - 1];
        const places = lastPoule.getPlaces();
        while (places.length > 0) {
            const place = places[places.length - 1];
            const nrOfPlacesNotEven = ((roundPlaces.length - lastPoule.getPlaces().length) % (poules.length - 1)) + 1;
            const poule = poules.find(pouleIt => nrOfPlacesNotEven === pouleIt.getNumber());
            if (!round.movePoulePlace(place, poule)) {
                throw new Error('de pouleplek kan niet verplaatst worden');
            }
        }
        try {
            this.removePouleHelper(lastPoule);
        } catch (e) {
            throw new Error('er moet minimaal 1 poule zijn');
        }

        if (recalcQualify === true) {
            this.recalculateQualifyRulesForRound(round);
        }
        return true;
    }

    private removePouleHelper(poule: Poule): boolean {
        if (poule.getGames().length > poule.getGamesWithState(Game.STATE_CREATED).length) {
            throw new Error('de poule kan niet verwijderd worden, omdat er al gestarte wedstrijden aanwezig aan');
        }

        const poules = poule.getRound().getPoules();
        const index = poules.indexOf(poule);
        if (index > -1) {
            poules.splice(index, 1);
            return true;
        }
        return false;
    }

    recalculateQualifyRulesForRound(round: Round, recalculateChildRounds: boolean = true) {
        if (round.getParent() !== undefined) {
            const qualifyService = new QualifyService(round.getParent(), round);
            qualifyService.removeRules();
            qualifyService.createRules();
        }
        if (recalculateChildRounds) {
            round.getChildRounds().forEach(function (childRound) {
                const qualifyService = new QualifyService(childRound.getParent(), childRound);
                qualifyService.removeRules();
                qualifyService.createRules();
            });
        }
    }

    removePoulePlace(round, recalcQualify: boolean = true): number {
        // console.log('removePoulePlace for round ' + round.getNumberAsValue());
        const places = round.getPoulePlaces();
        const poules = round.getPoules();
        if (poules.length === 0) {
            throw new Error('er moet minimaal 1 poule aanwezig zijn');
        }

        const nrOfPlacesNotEven = places.length % poules.length;
        let pouleToRemoveFrom = poules[poules.length - 1];
        if (nrOfPlacesNotEven > 0) {
            pouleToRemoveFrom = poules.find(pouleIt => nrOfPlacesNotEven === pouleIt.getNumber());
        }

        const placesTmp = pouleToRemoveFrom.getPlaces();
        if (round.getNumber().isFirst()) {
            if (this.competitorRange.min && placesTmp.length === this.competitorRange.min) {
                throw new Error('er moeten minimaal ' + this.competitorRange.min + ' deelnemers per poule zijn');
            }
        }

        // if (places.length === 1) {
        //     this.removeRound(round.getParent(), round.getWinnersOrLosers());
        //     return 1;
        // }

        let nrOfRemovedPlaces = 1;
        pouleToRemoveFrom.removePlace(placesTmp[placesTmp.length - 1]);
        if (placesTmp.length === 1 && poules.length > 1) {
            this.removePoule(round, !recalcQualify);
            nrOfRemovedPlaces++;
        }

        const tooMuchChildRoundPlaces = round.getNrOfPlacesChildRounds() > round.getPoulePlaces().length;
        if (recalcQualify === true) {
            this.recalculateQualifyRulesForRound(round);
        }

        if (tooMuchChildRoundPlaces) {
            let childRoundToRemovePlace = round.getChildRound(Round.LOSERS);
            if (childRoundToRemovePlace === undefined) {
                childRoundToRemovePlace = round.getChildRound(Round.WINNERS);
            }
            if (childRoundToRemovePlace !== undefined) {
                // this.changeNrOfPlacesChildRound( childRoundToRemovePlace.getPoulePlaces().length - 1,
                // round, childRoundToRemovePlace.getWinnersOrLosers()
                // );
                this.removePoulePlace(childRoundToRemovePlace, recalcQualify);
            }
        }

        // remove childrounds with no pouleplaces
        if (round.getPoulePlaces().length < 1) {
            round.getChildRounds().forEach(function (childRound) {
                this.removeRound(round, childRound.getWinnersOrLosers());
            }, this);
            this.removeRound(round.getParent(), round.getWinnersOrLosers());
        }

        return nrOfRemovedPlaces;
    }

    /**
     * when removePoulePlace is rescursively called, qualifyRules are not always uptodate
     * that's why this function is introduced, realtime qualifyrules are better!
     *
     * @param round Round
     * @param childRound Round
     */
    protected removePoulePlaceHelper(round: Round, childRound: Round) {
        const poulePlacesToRound = childRound.getPoulePlaces();
        round.getToQualifyRules(childRound.getWinnersOrLosers()).forEach(toQualifyRule => {
            const toPoulePlaces = toQualifyRule.getToPoulePlaces();
            toPoulePlaces.forEach(toPoulePlace => {
                const index = poulePlacesToRound.indexOf(toPoulePlace);
                if (index === -1) {
                    toPoulePlaces.splice(index, 1);
                }
            });
        });
    }

    addPoulePlace(round, recalcQualify: boolean = true): PoulePlace {
        // console.log('addPoulePlace for round ' + round.getNumberAsValue());
        const poules = round.getPoules();
        if (poules.length === 0) {
            throw new Error('er moet minimaal 1 poule aanwezig zijn');
        }
        const places = round.getPoulePlaces();
        if (places.length > this.competitorRange.max) {
            throw new Error('er mogen maximaal ' + this.competitorRange.max + ' deelnemers meedoen');
        }

        const nrOfPlacesNotEven = places.length % poules.length;

        let pouleToAddTo = poules[0];
        if (nrOfPlacesNotEven > 0) {
            pouleToAddTo = poules.find(pouleIt => (nrOfPlacesNotEven + 1) === pouleIt.getNumber());
        }
        const poulePlace = new PoulePlace(pouleToAddTo);

        if (recalcQualify === true) {
            this.recalculateQualifyRulesForRound(round);
        }
        return poulePlace;
    }

    changeNrOfPlacesChildRound(nrOfChildPlacesNew: number, parentRound: Round, winnersOrLosers: number, checkOpposingQualifiers = true) {
        // console.log('changeNrOfPlacesChildRound(' + nrOfChildPlacesNew + ', parentRound: ' + parentRound.getNumber()
        //     + ', winnersOrLosers: ' + winnersOrLosers + ')');
        let childRound = parentRound.getChildRound(winnersOrLosers);
        let add = (childRound === undefined && nrOfChildPlacesNew > 0);
        if (childRound !== undefined && childRound.getPoulePlaces().length > 0 && nrOfChildPlacesNew === 2) {
            const qualifyServiceIn = new QualifyService(childRound.getParent(), childRound);
            qualifyServiceIn.removeRules();
            this.removeRound(parentRound, winnersOrLosers);
            childRound = undefined;
            add = true;
        }

        if (add) {
            childRound = this.addRound(parentRound, winnersOrLosers, nrOfChildPlacesNew);
            const qualifyServiceIn2 = new QualifyService(childRound.getParent(), childRound);
            qualifyServiceIn2.removeRules();
            qualifyServiceIn2.createRules();
            if (checkOpposingQualifiers) {
                this.checkOpposingQualifiers(parentRound, winnersOrLosers);
            }
            return;
        }
        if (childRound === undefined) {
            return;
        }

        // check wat the last number was
        const nrOfPlacesChildRound = childRound.getPoulePlaces().length;
        let nrOfPlacesDifference = nrOfChildPlacesNew - nrOfPlacesChildRound;
        if (nrOfPlacesDifference === 0) {
            //     const removedChildRound = this.removeRound(parentRound, winnersOrLosers);
            //     const qualifyService = new QualifyService(removedChildRound.getParent(), removedChildRound);
            //     qualifyService.removeRules();
            //     qualifyService.createRules();
            return;
        }
        if (nrOfPlacesDifference < 0) {
            while (nrOfPlacesDifference < 0) {
                nrOfPlacesDifference += this.removePoulePlace(childRound);
            }
        } else {
            const needsRanking = nrOfPlacesChildRound !== 1 && !childRound.needsRanking();
            const addPoules = (needsRanking && ((nrOfPlacesChildRound + nrOfPlacesDifference) % 2) === 0);
            for (let nI = 0; nI < nrOfPlacesDifference; nI++) {
                if (addPoules) {
                    this.addPoule(childRound, true, true);
                    nI++;
                } else {
                    this.addPoulePlace(childRound, true);
                }
            }
        }
        // qualifyService.createRules();

        if (checkOpposingQualifiers) {
            this.checkOpposingQualifiers(parentRound, winnersOrLosers);
        }
    }

    private checkOpposingQualifiers(parentRound: Round, winnersOrLosers: number) {
        let nrOfPlacesLeftForOpposing;
        if (this.isNrOfPlacesPerPouleEqual(parentRound)) {
            nrOfPlacesLeftForOpposing = this.checkOpposingQualifiersBase(parentRound, winnersOrLosers);
        } else {
            nrOfPlacesLeftForOpposing = this.checkOpposingQualifiersExt(parentRound, winnersOrLosers);
        }
        if (nrOfPlacesLeftForOpposing < 0) {
            return;
        }
        if (nrOfPlacesLeftForOpposing === 1) {
            nrOfPlacesLeftForOpposing = 0;
        }
        this.changeNrOfPlacesChildRound(nrOfPlacesLeftForOpposing, parentRound, Round.getOpposing(winnersOrLosers), false);

        /* else if (nrOfPlacesLeftForOpposing === nrOfChildPlacesOpposing) {
           const childRound = parentRound.getChildRound(winnersOrLosers);
           const qualifyService = new QualifyService(childRound.getParent(), childRound);
           qualifyService.theMultipleToSingle();
       }*/
    }


    private checkOpposingQualifiersBase(parentRound: Round, winnersOrLosers: number) {
        const opposing = Round.getOpposing(winnersOrLosers);
        const nrOfChildPlaces = parentRound.getNrOfPlacesChildRound(winnersOrLosers);
        const nrOfPlacesLeftForOpposing = parentRound.getPoulePlaces().length - nrOfChildPlaces;
        const nrOfChildPlacesOpposing = parentRound.getNrOfPlacesChildRound(opposing);
        if (nrOfPlacesLeftForOpposing < nrOfChildPlacesOpposing) {
            return nrOfPlacesLeftForOpposing;
        }
        return -1;
    }

    private checkOpposingQualifiersExt(parentRound: Round, winnersOrLosers: number) {
        const nrOfPoulesWithLessPlaces = this.getNrOfPoulesWithLessPlaces(parentRound);
        const overlappingQualifyRules = this.getOverlappingRules(parentRound);
        if (overlappingQualifyRules.length !== 2) {
            return;
        }
        const winnersRule = overlappingQualifyRules.find(rule => rule.getWinnersOrLosers() === Round.WINNERS);
        const losersRule = overlappingQualifyRules.find(rule => rule.getWinnersOrLosers() === Round.LOSERS);
        const nrOfWinnersToPlaces = winnersRule.getToPoulePlaces().length;
        let nrOfLosersToPlaces = losersRule.getToPoulePlaces().length;
        if (losersRule.isMultiple() === false) {
            const deltaTmp = winnersOrLosers === Round.WINNERS ? 1 : nrOfWinnersToPlaces;
            return parentRound.getNrOfPlacesChildRound(Round.getOpposing(winnersOrLosers)) - deltaTmp;
        }

        if (losersRule.getToPoulePlaces().length > nrOfPoulesWithLessPlaces) {
            nrOfLosersToPlaces = nrOfPoulesWithLessPlaces;
        }
        const delta = parentRound.getPoules().length - (nrOfWinnersToPlaces + nrOfLosersToPlaces);
        if (delta >= 0) {
            return -1;
        }
        return parentRound.getNrOfPlacesChildRound(Round.getOpposing(winnersOrLosers)) - Math.abs(delta);
    }

    private getNrOfPoulesWithLessPlaces(round: Round) {
        if (this.isNrOfPlacesPerPouleEqual(round)) {
            return 0;
        }
        return round.getPoules().length - (round.getPoulePlaces().length % round.getPoules().length);
    }

    private isNrOfPlacesPerPouleEqual(round: Round) {
        return (round.getPoulePlaces().length % round.getPoules().length) === 0;
    }

    private getOverlappingRules(round: Round): QualifyRule[] {
        const poulePlace = round.getPoulePlaces().find(poulePlaceIt => poulePlaceIt.getToQualifyRules().length > 1);
        if (poulePlace === undefined) {
            return [];
        }
        return poulePlace.getToQualifyRules();
    }

    getDefaultRoundStructure(roundNr, nrOfTeams): IRoundStructure {
        if (nrOfTeams < 1) {
            return undefined;
        } else if (nrOfTeams === 1) {
            return { nrofpoules: 1, nrofwinners: 0 };
        }
        if (roundNr > 1 && (nrOfTeams % 2) === 0) {
            return { nrofpoules: nrOfTeams / 2, nrofwinners: nrOfTeams / 2 };
        }
        // if (nrOfTeams > 32) {
        //     const nrOfPoules = ((nrOfTeams % 5) === 0 ? nrOfTeams : (nrOfTeams + 5 - (nrOfTeams % 5))) / 5;
        //     return { nrofpoules: nrOfPoules, nrofwinners: nrOfPoules };
        // }
        const roundStructure = StructureService.DEFAULTS[nrOfTeams];
        if (roundStructure === undefined) {
            throw new Error('het aantal teams moet minimaal ' + (this.competitorRange.min - 1) +
                ' zijn en mag maximaal ' + this.competitorRange.max + ' zijn');
        }
        return roundStructure;
    }

    getNrOfPlacesPerPoule(nrOfPlaces, nrOfPoules) {
        const nrOfPlaceLeft = (nrOfPlaces % nrOfPoules);
        return (nrOfPlaces + nrOfPlaceLeft) / nrOfPoules;
    }
}
