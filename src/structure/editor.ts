import { QualifyGroup, Round } from '../qualify/group';
import { Competition } from '../competition';
import { Place } from '../place';
import { Poule } from '../poule';
import { QualifyGroupEditor } from '../qualify/group/editor';
import { RoundNumber } from '../round/number';
import { Structure } from '../structure';
import { VoetbalRange } from '../range';
import { JsonPlanningConfig } from '../planning/config/json';
import { CompetitionSportService } from '../competition/sport/service';
import { Inject, Injectable } from '@angular/core';
import { QualifyTarget } from '../qualify/target';
import { BalancedPouleStructure } from '../poule/structure/balanced';
import { PlanningConfigMapper } from '../planning/config/mapper';
import { HorizontalPouleCreator } from '../poule/horizontal/creator';
import { QualifyRuleCreator } from '../qualify/rule/creator';

@Injectable({
    providedIn: 'root'
})
export class StructureEditor {
    private qualifyGroupEditor: QualifyGroupEditor;
    private horPouleCreator: HorizontalPouleCreator;
    private rulesCreator: QualifyRuleCreator;


    constructor(
        private competitionSportService: CompetitionSportService,
        private planningConfigMapper: PlanningConfigMapper,
        @Inject('placeRanges') private placeRanges: PlaceRange[]) {
        this.qualifyGroupEditor = new QualifyGroupEditor(this);
        this.horPouleCreator = new HorizontalPouleCreator();
        this.rulesCreator = new QualifyRuleCreator();
    }

    create(competition: Competition, jsonPlanningConfig: JsonPlanningConfig, pouleStructure: number[]): Structure {
        const balancedPouleStructure = new BalancedPouleStructure(...pouleStructure);
        // begin editing
        const firstRoundNumber = new RoundNumber(competition);
        this.planningConfigMapper.toObject(jsonPlanningConfig, firstRoundNumber);

        const rootRound = new Round(firstRoundNumber, undefined);
        this.fillRound(rootRound, balancedPouleStructure);
        const structure = new Structure(firstRoundNumber, rootRound);
        competition.getSports().forEach(competitionSport => {
            this.competitionSportService.addToStructure(competitionSport, structure);
        });
        // end editing
        this.horPouleCreator.create(rootRound);
        this.rulesCreator.create(rootRound);
        return structure;
    }

    addChildRound(parentRound: Round, qualifyTarget: QualifyTarget, pouleStructure: number[]): Round {
        const balancedPouleStructure = new BalancedPouleStructure(...pouleStructure);
        this.rulesCreator.remove(parentRound);
        // begin editing

        const qualifyGroup = this.addChildRoundHelper(
            parentRound,
            qualifyTarget,
            balancedPouleStructure
        );
        // end editing
        this.horPouleCreator.create(qualifyGroup.getChildRound());
        this.rulesCreator.create(parentRound);
        return qualifyGroup.getChildRound();
    }

    private addChildRoundHelper(parentRound: Round, qualifyTarget: QualifyTarget, pouleStructure: BalancedPouleStructure): QualifyGroup {
        let nextRoundNumber = parentRound.getNumber().getNext();
        if (!nextRoundNumber) {
            nextRoundNumber = parentRound.getNumber().createNext();
        }
        const qualifyGroup = new QualifyGroup(parentRound, qualifyTarget, nextRoundNumber);
        this.fillRound(qualifyGroup.getChildRound(), pouleStructure);
        return qualifyGroup;
    }


    /**
     * voor een ronde kun je:
     * A een plek toevoegen(in rootround, of in een volgende ronde, via addqualifier) KAN GEEN INVLOED HEBBEN OP HET AANTAL QUALIFYGROUPS
     * B een plek verwijderen(in rootround, of in een volgende ronde, via removequalifier) 
     * C het aantal poules verkleinen met 1     - refillRound, update horpoules and update previousround qualifyrules
     * D C het aantal poules vergroten met 1    - refillRound, update horpoules and update previousround qualifyrules
     * 
     * C, D hebben geen invloed op het aantal plekken in volgende ronden
     */
    // in root only a poule can be added
    // options:
    // 3,3 => 4, 5
    addPlaceToRootRound(rootRound: Round): Place {
        this.horPouleCreator.remove(rootRound);
        this.rulesCreator.remove(rootRound);
        // begin editing        
        const newNrOfPlaces = rootRound.getNrOfPlaces() + 1;
        const nrOfPoules = rootRound.getPoules().length;
        this.checkRanges(newNrOfPlaces, nrOfPoules);

        // const pouleStructure = new BalancedPouleStructure(newNrOfPlaces, nrOfPoules);
        // const pouleNr = pouleStructure.getFirstLesserPlacesPouleNr();
        // new Place(round.getPoule(pouleNr));

        rootRound.addPlace();
        // end editing
        this.horPouleCreator.create(rootRound);
        this.rulesCreator.create(rootRound);

        return rootRound.getFirstPlace(QualifyTarget.Losers);
    }

    removePlaceFromRootRound(rootRound: Round) {
        const nrOfPlaces = rootRound.getNrOfPlaces();
        if (nrOfPlaces === rootRound.getNrOfPlacesChildren()) {
            throw new Error('de deelnemer kan niet verwijderd worden, omdat alle deelnemer naar de volgende ronde gaan');
        }
        const newNrOfPlaces = nrOfPlaces - 1;
        this.checkRanges(newNrOfPlaces);
        if ((newNrOfPlaces / rootRound.getPoules().length) < 2) {
            throw new Error('Er kan geen deelnemer verwijderd worden. De minimale aantal deelnemers per poule is 2.');
        }
        this.horPouleCreator.remove(rootRound);
        this.rulesCreator.remove(rootRound);
        // begin editing
        rootRound.removePlace();
        // end editing
        this.horPouleCreator.create(rootRound);
        this.rulesCreator.create(rootRound);

        return rootRound.getFirstPlace(QualifyTarget.Losers);
    }

    public addPouleToRootRound(rootRound: Round): Poule {
        const lastPoule = rootRound.getFirstPoule();
        const newNrOfPlaces = rootRound.getNrOfPlaces() + lastPoule.getPlaces().length;
        this.checkRanges(newNrOfPlaces, rootRound.getPoules().length + 1);

        this.horPouleCreator.remove(rootRound);
        this.rulesCreator.remove(rootRound);
        // begin editing
        rootRound.addPoule();
        // end editing
        this.horPouleCreator.create(rootRound);
        this.rulesCreator.create(rootRound);

        return rootRound.getLastPoule();
    }

    removePouleFromRootRound(rootRound: Round) {
        const poules = rootRound.getPoules();
        if (poules.length <= 1) {
            throw new Error('er moet minimaal 1 poule overblijven');
        }
        const lastPoule = rootRound.getLastPoule();
        const newNrOfPlaces = rootRound.getNrOfPlaces() - lastPoule.getPlaces().length;

        if (newNrOfPlaces < rootRound.getNrOfPlacesChildren()) {
            throw new Error('de poule kan niet verwijderd worden, omdat er te weinig deelnemers '
                + 'overblijven om naar de volgende ronde gaan');
        }

        this.horPouleCreator.remove(rootRound);
        this.rulesCreator.remove(rootRound);
        // begin editing


        rootRound.removePoule();
        // this.updateRound(round, new BalancedPouleStructure(newNrOfPlaces, poules.length - 1));

        // recreate horizontalpoules for this round
        // recalculate rules recursive from parentround(or this round if parentround is null)
        // end editing
        this.horPouleCreator.create(rootRound);
        this.rulesCreator.create(rootRound);
    }

    public incrementNrOfPoules(round: Round) {
        this.checkRanges(round.getNrOfPlaces(), round.getPoules().length + 1);

        this.horPouleCreator.remove(round);
        this.rulesCreator.remove(round);
        // begin editing
        const nrOfPlacesToRemove = round.addPoule().getPlaces().length;
        for (let i = 0; i < nrOfPlacesToRemove; i++) {
            round.removePlace();
        }
        // end editing
        this.horPouleCreator.create(round);
        this.rulesCreator.create(round.getParent(), round);
    }

    public decrementNrOfPoules(round: Round) {
        const poules = round.getPoules();
        if (poules.length <= 1) {
            throw new Error('er moet minimaal 1 poule overblijven');
        }

        this.horPouleCreator.remove(round);
        this.rulesCreator.remove(round);
        // begin editing        
        const nrOfPlacesToAdd = round.removePoule().getPlaces().length;
        for (let i = 0; i < nrOfPlacesToAdd; i++) {
            round.addPlace();
        }
        // end editing
        this.horPouleCreator.create(round);
        this.rulesCreator.create(round.getParent(), round);
    }

    addQualifiers(parentRound: Round, qualifyTarget: QualifyTarget, nrOfQualifiers: number) {
        const nrOfPlaces = parentRound.getNrOfPlaces();
        const nrOfToPlaces = parentRound.getNrOfPlacesChildren();
        if ((nrOfToPlaces + nrOfQualifiers) > nrOfPlaces) {
            throw new Error('er mogen maximaal ' + (nrOfPlaces - nrOfToPlaces) + ' deelnemers naar de volgende ronde');
        }
        this.horPouleCreator.remove(parentRound);
        this.rulesCreator.remove(parentRound);
        // begin editing
        let qualifyGroup = parentRound.getBorderQualifyGroup(qualifyTarget);
        if (qualifyGroup === undefined) {
            if (nrOfQualifiers < 2) {
                throw Error('Voeg miniaal 2 gekwalificeerden toe');
            }
            qualifyGroup = this.addChildRoundHelper(parentRound, qualifyTarget, new BalancedPouleStructure(2));
            nrOfQualifiers -= 2;
        }
        const childRound = qualifyGroup.getChildRound();
        this.horPouleCreator.remove(childRound);
        this.rulesCreator.remove(childRound);
        for (let qualifier = 0; qualifier < nrOfQualifiers; qualifier++) {
            this.checkRanges(childRound.getNrOfPlaces() + 1, childRound.getPoules().length);
            childRound.addPlace();
        }
        // end editing
        this.horPouleCreator.create(childRound.getParent(), childRound);
        this.rulesCreator.create(childRound.getParent(), childRound);
    }

    // removeQualifiers(parentRound: Round, qualifyTarget: QualifyTarget, nrOfRemovals: number) {
    //     const qualifyGroup = parentRound.getBorderQualifyGroup(qualifyTarget);
    //     if (qualifyGroup === undefined) {
    //         return;
    //     }
    //     const nrOfPlaces = parentRound.getNrOfPlaces();
    //     const nrOfToPlaces = parentRound.getNrOfPlacesChildren();
    //     if ((nrOfToPlaces - nrOfRemovals) > 1) {
    //         throw new Error('er kunnen maximaal ' + (nrOfToPlaces - 1) + ' deelnemers weggehaald worden');
    //     }
    //     const childRound = qualifyGroup.getChildRound();
    //     this.horPouleCreator.remove(parentRound, childRound);
    //     this.rulesCreator.remove(parentRound, childRound);
    //     // begin editing

    //     getNrOfDropoutPlaces()

    //     while (this.removeQualifier(parentRound, qualifyTarget)) {
    //         const r = 1;
    //     }

    //     // end editing
    //     this.horPouleCreator.create(parentRound);
    //     this.rulesCreator.create(parentRound);
    // }

    removeQualifier(parentRound: Round, qualifyTarget: QualifyTarget): boolean {
        const qualifyGroup = parentRound.getBorderQualifyGroup(qualifyTarget);
        if (qualifyGroup === undefined) {
            return false;
        }
        const childRound = qualifyGroup.getChildRound();
        this.horPouleCreator.remove(childRound);
        this.rulesCreator.remove(parentRound);
        // begin editing        
        const nrOfPlacesRemoved = childRound.removePlace();
        if (nrOfPlacesRemoved > 1 && childRound.getPoules().length >= 1) {
            childRound.addPlace()
        }

        this.horPouleCreator.create(childRound);
        this.rulesCreator.create(parentRound);

        if (childRound.getNrOfDropoutPlaces() <= 0) {
            const losersBorderQualifyGroup = childRound.getBorderQualifyGroup(QualifyTarget.Losers);
            const childQualifyTarget = losersBorderQualifyGroup !== undefined ? QualifyTarget.Losers : QualifyTarget.Winners;
            this.removeQualifier(childRound, childQualifyTarget);
        } else {
            this.rulesCreator.create(childRound);
        }
        return true;

    }

    private fillRound(round: Round, pouleStructure: BalancedPouleStructure) {
        pouleStructure.forEach((nrOfPlaces: number) => {
            const poule = new Poule(round);
            for (let placeNr = 1; placeNr <= nrOfPlaces; placeNr++) {
                new Place(poule)
            }
        });
    }

    // isQualifyGroupSplittable(previousSingleRule: QualifyRuleSingle, currentSingleRule: QualifyRuleSingle): boolean {
    //     if (currentSingleRule.getNext() && currentSingleRule.getNrOfToPlaces() < 2) {
    //         return false;
    //     }
    //     if (this.getNrOfQualifiersPrevious(previousSingleRule) < 2 || this.getNrOfQualifiersNext(currentSingleRule) < 2) {
    //         return false;
    //     }
    //     return true;
    // }

    // protected getNrOfQualifiersPrevious(singleRule: QualifyRuleSingle): number {
    //     return singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Winners);
    // }

    // protected getNrOfQualifiersNext(singleRule: QualifyRuleSingle): number {
    //     return singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Losers);
    // }

    // splitQualifyGroup(qualifyGroup: QualifyGroup, singleRuleOne: QualifyRuleSingle, singleRuleTwo: QualifyRuleSingle) {
    //     if (!this.isQualifyGroupSplittable(singleRuleOne, singleRuleTwo)) {
    //         throw new Error('de kwalificatiegroepen zijn niet splitsbaar');
    //     }
    //     const parentRound = qualifyGroup.getParentRound();

    //     const firstSingleRule = singleRuleOne.getNumber() <= singleRuleTwo.getNumber() ? singleRuleOne : singleRuleTwo;
    //     const secondSingleRule = (firstSingleRule === singleRuleOne) ? singleRuleTwo : singleRuleOne;

    //     const nrOfPlacesChildrenBeforeSplit = parentRound.getNrOfPlacesChildren(qualifyGroup.getTarget());
    //     this.qualifyGroupEditor.splitQualifyGroupFrom(qualifyGroup, secondSingleRule);

    //     this.updateQualifyGroups(parentRound, qualifyGroup.getTarget(), nrOfPlacesChildrenBeforeSplit);

    //     const qualifyRuleService = new QualifyRuleService();
    //     qualifyRuleService.recreateTo(parentRound);
    // }

    // areQualifyGroupsMergable(previous: QualifyGroup, current: QualifyGroup): boolean {
    //     return (previous !== undefined && current !== undefined && previous.getTarget() !== QualifyTarget.Dropouts
    //         && previous.getTarget() === current.getTarget() && previous !== current);
    // }

    // mergeQualifyGroups(qualifyGroupOne: QualifyGroup, qualifyGroupTwo: QualifyGroup) {
    //     if (!this.areQualifyGroupsMergable(qualifyGroupOne, qualifyGroupTwo)) {
    //         throw new Error('de kwalificatiegroepen zijn niet te koppelen');
    //     }
    //     const parentRound = qualifyGroupOne.getParentRound();
    //     const qualifyTarget = qualifyGroupOne.getTarget();

    //     const firstQualifyGroup = qualifyGroupOne.getNumber() <= qualifyGroupTwo.getNumber() ? qualifyGroupOne : qualifyGroupTwo;
    //     const secondQualifyGroup = (firstQualifyGroup === qualifyGroupOne) ? qualifyGroupTwo : qualifyGroupOne;
    //     const nrOfPlacesQualifyGroups = firstQualifyGroup.getChildRound().getNrOfPlaces()
    //         + secondQualifyGroup.getChildRound().getNrOfPlaces();
    //     const nrOfPoulesFirstQualifyGroup = firstQualifyGroup.getChildRound().getPoules().length;
    //     const nrOfPlacesChildrenBeforeMerge = parentRound.getNrOfPlacesChildren(qualifyTarget);
    //     this.qualifyGroupEditor.mergeQualifyGroups(firstQualifyGroup, secondQualifyGroup);
    //     // first update places, before updateQualifyGroups
    //     const pouleStructure = new BalancedPouleStructure(nrOfPlacesQualifyGroups, nrOfPoulesFirstQualifyGroup);
    //     this.refillRound(firstQualifyGroup.getChildRound(), pouleStructure);

    //     const horizontalPouleService = new HorizontalPouleService();
    //     horizontalPouleService.recreate(firstQualifyGroup.getChildRound());
    //     secondQualifyGroup.detach(); // is already done in groupeditor


    //     this.updateQualifyGroups(parentRound, qualifyTarget, nrOfPlacesChildrenBeforeMerge);

    //     const qualifyRuleService = new QualifyRuleService();
    //     qualifyRuleService.recreateTo(parentRound);
    // }

    /*updateRound(round: Round, pouleStructure: BalancedPouleStructure) {
        this.refillRound(round, pouleStructure);

        const horizontalPouleService = new HorizontalPouleService();
        horizontalPouleService.recreate(round);

        [QualifyTarget.Winners, QualifyTarget.Losers].forEach((qualifyTarget: QualifyTarget) => {
            let nrOfPlacesQualifyTarget = round.getNrOfPlacesChildren(qualifyTarget);
            // als aantal plekken minder wordt, dan is nieuwe aantal plekken max. aantal plekken van de ronde
            const newNrOfPlaces = pouleStructure.getNrOfPlaces();
            if (nrOfPlacesQualifyTarget > newNrOfPlaces) {
                nrOfPlacesQualifyTarget = newNrOfPlaces;
            }
            this.updateQualifyGroups(round, qualifyTarget, nrOfPlacesQualifyTarget);
        });

        const qualifyRuleService = new QualifyRuleService();
        qualifyRuleService.recreateTo(round);
    }*/

    // protected updateQualifyGroups(round: Round, qualifyTarget: QualifyTarget, newNrOfPlacesChildren: number) {
    //     const roundNrOfPlaces = round.getNrOfPlaces();
    //     if (newNrOfPlacesChildren > roundNrOfPlaces) {
    //         newNrOfPlacesChildren = roundNrOfPlaces;
    //     }
    //     // dit kan niet direct door de gebruiker maar wel een paar dieptes verder op
    //     if (roundNrOfPlaces < 4 && newNrOfPlacesChildren >= 2) {
    //         newNrOfPlacesChildren = 0;
    //     }

    //     const pouleStructures = round.getQualifyGroups(qualifyTarget).map((qualifyGroup: QualifyGroup): BalancedPouleStructure => {
    //         return qualifyGroup.getChildRound().createPouleStructure();
    //     });
    //     round.getQualifyGroups(qualifyTarget).forEach((qualifyGroup: QualifyGroup) => qualifyGroup.detach());

    //     while (newNrOfPlacesChildren > 1) {
    //         // create qualifyGroups here
    //         const horizontolPoulesCreator = getNewQualifyGroup(initRemovedQualifyGroups);
    //         horizontolPoulesCreator.qualifyGroup.setNumber(qualifyGroupNumber++);
    //         horizontolPoulesCreators.push(horizontolPoulesCreator);
    //         newNrOfPlacesChildren -= horizontolPoulesCreator.nrOfQualifiers;
    //     }


    //     // const getNewQualifyGroup = (removedQualifyGroups: QualifyGroup[]): HorizontolPoulesCreator => {
    //     //     let qualifyGroup = removedQualifyGroups.shift();
    //     //     let nrOfQualifiers: number;
    //     //     if (qualifyGroup === undefined) {
    //     //         let nextRoundNumber = round.getNumber().getNext();
    //     //         if (!nextRoundNumber) {
    //     //             nextRoundNumber = this.createRoundNumber(round);
    //     //         }
    //     //         qualifyGroup = new QualifyGroup(round, qualifyTarget, nextRoundNumber);
    //     //         nrOfQualifiers = newNrOfPlacesChildren;
    //     //     } else {
    //     //         round.getQualifyGroups(qualifyTarget).push(qualifyGroup);
    //     //         // warning: cannot make use of qualifygroup.horizontalpoules yet!

    //     //         // add and remove qualifiers
    //     //         nrOfQualifiers = qualifyGroup.getChildRound().getNrOfPlaces();
    //     //         const nrOfPoules = round.getPoules().length;

    //     //         if (nrOfQualifiers > nrOfPoules && (nrOfQualifiers % nrOfPoules) > 0) { // when decrease nrofpoules
    //     //             nrOfQualifiers = nrOfQualifiers - (nrOfQualifiers % nrOfPoules);
    //     //         }
    //     //         if (nrOfQualifiers < nrOfPoules && newNrOfPlacesChildren > nrOfQualifiers) {
    //     //             nrOfQualifiers = nrOfPoules;
    //     //         }
    //     //         if (nrOfQualifiers > newNrOfPlacesChildren) {
    //     //             nrOfQualifiers = newNrOfPlacesChildren;
    //     //         } else if (nrOfQualifiers < newNrOfPlacesChildren && removedQualifyGroups.length === 0) {
    //     //             nrOfQualifiers = newNrOfPlacesChildren;
    //     //         }
    //     //         if (newNrOfPlacesChildren - nrOfQualifiers === 1) {
    //     //             nrOfQualifiers = newNrOfPlacesChildren;
    //     //         }
    //     //     }
    //     //     return { qualifyGroup, nrOfQualifiers };
    //     // };


    //     // const horizontolPoulesCreators: HorizontolPoulesCreator[] = [];
    //     // const qualifyGroups = round.getQualifyGroups(qualifyTarget);
    //     // const initRemovedQualifyGroups = qualifyGroups.splice(0, qualifyGroups.length);
    //     // let qualifyGroupNumber = 1;
    //     // while (newNrOfPlacesChildren > 1) {
    //     //     const horizontolPoulesCreator = getNewQualifyGroup(initRemovedQualifyGroups);
    //     //     horizontolPoulesCreator.qualifyGroup.setNumber(qualifyGroupNumber++);
    //     //     horizontolPoulesCreators.push(horizontolPoulesCreator);
    //     //     newNrOfPlacesChildren -= horizontolPoulesCreator.nrOfQualifiers;
    //     // }
    //     // // const horizontalPouleService = new HorizontalPouleService(round);
    //     // // horizontalPouleService.updateQualifyGroups(round.getHorizontalPoules(qualifyTarget).slice(), horizontolPoulesCreators);

    //     // horizontolPoulesCreators.forEach(creator => {
    //     //     const newNrOfPoules = this.calculateNewNrOfPoules(creator.qualifyGroup, creator.nrOfQualifiers);
    //     //     this.updateRound(creator.qualifyGroup.getChildRound(), creator.nrOfQualifiers, newNrOfPoules);
    //     // });

    // }

    /*calculateNewNrOfPoules(parentQualifyGroup: QualifyGroup, newNrOfPlaces: number): number {

        const childRound = parentQualifyGroup.getChildRound();
        const oldNrOfPlaces = childRound.getNrOfPlaces();
        const oldNrOfPoules = childRound.getPoules().length;

        if (oldNrOfPoules === 0) {
            return 1;
        }
        if (oldNrOfPlaces < newNrOfPlaces) { // add
            const unevenPlaces = (oldNrOfPlaces % oldNrOfPoules) > 0;
            if (oldNrOfPoules > 1 && unevenPlaces
                && childRound.getPoule(1).getPlaces().length === 3
                && childRound.getPoule(2).getPlaces().length === 2
            ) {
                return oldNrOfPoules + 1;
            }
            if (unevenPlaces || (oldNrOfPlaces / oldNrOfPoules) === 2) {
                return oldNrOfPoules;
            }
            return oldNrOfPoules + 1;
        }
        // remove
        if ((newNrOfPlaces / oldNrOfPoules) < 2) {
            return oldNrOfPoules - 1;
        }
        return oldNrOfPoules;
    }*/



    protected getRoot(round: Round): Round {
        const parent = round.getParent();
        return parent ? this.getRoot(parent) : round;
    }

    protected checkRanges(nrOfPlaces: number, nrOfPoules?: number) {
        if (this.placeRanges === undefined || this.placeRanges.length === 0) {
            return;
        }
        const placeRange = this.placeRanges.find(placeRangeIt => {
            return nrOfPlaces >= placeRangeIt.min && nrOfPlaces <= placeRangeIt.max;
        });
        if (placeRange === undefined) {
            throw new Error('het aantal deelnemers is kleiner dan het minimum of groter dan het maximum');
        }
        if (nrOfPoules === undefined) {
            return;
        }
        const pouleStructure = this.createBalanced(nrOfPlaces, nrOfPoules);
        const smallestNrOfPlacesPerPoule = pouleStructure.getSmallestPoule();
        if (smallestNrOfPlacesPerPoule < placeRange.placesPerPoule.min) {
            throw new Error('vanaf ' + placeRange.min + ' deelnemers moeten er minimaal ' + placeRange.placesPerPoule.min + ' deelnemers per poule zijn');
        }
        const biggestNrOfPlacesPerPoule = pouleStructure.getBiggestPoule();
        if (biggestNrOfPlacesPerPoule > placeRange.placesPerPoule.max) {
            throw new Error('vanaf ' + placeRange.min + ' deelnemers mogen er maximaal ' + placeRange.placesPerPoule.max + ' deelnemers per poule zijn');
        }
    }

    createBalanced(nrOfPlaces: number, nrOfPoules: number): BalancedPouleStructure {
        const calculateNrOfPlacesPerPoule = (nrOfPlaces: number, nrOfPoules: number): number => {
            const nrOfPlaceLeft = (nrOfPlaces % nrOfPoules);
            if (nrOfPlaceLeft === 0) {
                return nrOfPlaces / nrOfPoules;
            }
            return ((nrOfPlaces - nrOfPlaceLeft) / nrOfPoules);
        }

        const nrOfPlacesPerPoule = calculateNrOfPlacesPerPoule(nrOfPlaces, nrOfPoules)
        const innerData: number[] = [];
        while (nrOfPlaces > 0) {
            const nrOfPlacesToAdd = nrOfPlaces >= nrOfPlacesPerPoule ? nrOfPlacesPerPoule : nrOfPlaces;
            innerData.push(nrOfPlacesToAdd);
            nrOfPlaces -= nrOfPlacesPerPoule;
        }
        return new BalancedPouleStructure(...innerData)
    }
}

export interface PlaceRange extends VoetbalRange {
    placesPerPoule: VoetbalRange;
}
