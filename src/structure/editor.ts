import { QualifyGroup, Round } from '../qualify/group';
import { Competition } from '../competition';
import { Place } from '../place';
import { Poule } from '../poule';
import { HorizontalPoule } from '../poule/horizontal';
import { HorizontalPouleService, HorizontolPoulesCreator } from '../poule/horizontal/service';
import { QualifyGroupEditor } from '../qualify/group/editor';
import { QualifyRuleService } from '../qualify/rule/service';
import { RoundNumber } from '../round/number';
import { Structure } from '../structure';
import { VoetbalRange } from '../range';
import { PlanningConfig } from '../planning/config';
import { JsonPlanningConfig } from '../planning/config/json';
import { CompetitionSportService } from '../competition/sport/service';
import { Inject, Injectable } from '@angular/core';
import { QualifyTarget } from '../qualify/target';
import { QualifyRuleSingle } from '../qualify/rule/single';
import { BalancedPouleStructure } from '../poule/structure/balanced';

@Injectable({
    providedIn: 'root'
})
export class StructureEditor {
    private qualifyGroupEditor: QualifyGroupEditor;
    constructor(
        private competitionSportService: CompetitionSportService,
        @Inject('placeRanges') private placeRanges: PlaceRange[]) {
        this.qualifyGroupEditor = new QualifyGroupEditor(this);
    }

    create(competition: Competition, jsonPlanningConfig: JsonPlanningConfig, pouleStructure: BalancedPouleStructure): Structure {
        const firstRoundNumber = new RoundNumber(competition);
        new PlanningConfig(firstRoundNumber,
            jsonPlanningConfig.creationStrategy,
            jsonPlanningConfig.extension,
            jsonPlanningConfig.enableTime,
            jsonPlanningConfig.minutesPerGame,
            jsonPlanningConfig.minutesPerGameExt,
            jsonPlanningConfig.minutesBetweenGames,
            jsonPlanningConfig.minutesAfter,
            jsonPlanningConfig.selfReferee);
        const rootRound = new Round(firstRoundNumber, undefined);
        this.updateRound(rootRound, pouleStructure);
        const structure = new Structure(firstRoundNumber, rootRound);
        competition.getSports().forEach(competitionSport => {
            this.competitionSportService.addToStructure(competitionSport, structure);
        });
        return structure;
    }

    removePlaceFromRootRound(round: Round) {
        const nrOfPlaces = round.getNrOfPlaces();
        if (nrOfPlaces === round.getNrOfPlacesChildren()) {
            throw new Error('de deelnemer kan niet verwijderd worden, omdat alle deelnemer naar de volgende ronde gaan');
        }
        const newNrOfPlaces = nrOfPlaces - 1;
        this.checkRanges(newNrOfPlaces);
        if ((newNrOfPlaces / round.getPoules().length) < 2) {
            throw new Error('Er kan geen deelnemer verwijderd worden. De minimale aantal deelnemers per poule is 2.');
        }

        this.updateRound(round, new BalancedPouleStructure(newNrOfPlaces, round.getPoules().length));
    }

    addPlaceToRootRound(round: Round): Place {
        const newNrOfPlaces = round.getNrOfPlaces() + 1;
        const nrOfPoules = round.getPoules().length;
        this.checkRanges(newNrOfPlaces, nrOfPoules);

        this.updateRound(round, new BalancedPouleStructure(newNrOfPlaces, nrOfPoules));

        return round.getFirstPlace(QualifyTarget.Losers);
    }

    removePoule(round: Round, modifyNrOfPlaces?: boolean) {
        const poules = round.getPoules();
        if (poules.length <= 1) {
            throw new Error('er moet minimaal 1 poule overblijven');
        }
        const lastPoule = poules[poules.length - 1];
        const newNrOfPlaces = round.getNrOfPlaces() - (modifyNrOfPlaces ? lastPoule.getPlaces().length : 0);

        if (newNrOfPlaces < round.getNrOfPlacesChildren()) {
            throw new Error('de poule kan niet verwijderd worden, omdat er te weinig deelnemers '
                + 'overblijven om naar de volgende ronde gaan');
        }

        this.updateRound(round, new BalancedPouleStructure(newNrOfPlaces, poules.length - 1));
        if (!round.isRoot()) {
            const qualifyRuleService = new QualifyRuleService();
            qualifyRuleService.recreateFrom(round);
        }
    }

    public addPoule(round: Round, modifyNrOfPlaces?: boolean): Poule {
        const poules = round.getPoules();
        const lastPoule = poules[poules.length - 1];
        const newNrOfPlaces = round.getNrOfPlaces() + (modifyNrOfPlaces ? lastPoule.getPlaces().length : 0);
        if (modifyNrOfPlaces) {
            this.checkRanges(newNrOfPlaces, poules.length + 1);
        }
        this.updateRound(round, new BalancedPouleStructure(newNrOfPlaces, poules.length + 1));
        if (!round.isRoot()) {
            const qualifyRuleService = new QualifyRuleService();
            qualifyRuleService.recreateFrom(round);
        }

        const newPoules = round.getPoules();
        return newPoules[newPoules.length - 1];
    }

    removeQualifier(round: Round, qualifyTarget: QualifyTarget) {

        const qualifyGroup = round.getBorderQualifyGroup(qualifyTarget);
        const childRound = qualifyGroup.getChildRound();
        const childPouleStructure = childRound.createPouleStructure();
        if (childPouleStructure.getNrOfPlaces() < 2) {
            qualifyGroup.detach();
            return;
        }
        const newChildPouleStructure = childPouleStructure.removePlace();
        this.refillRound(childRound, newChildPouleStructure);
        // pouleStructure van de qualifyGroup kl


        // const nrOfPlaces = round.getNrOfPlacesChildren(qualifyTarget);
        // const borderQualifyGroup = round.getBorderQualifyGroup(qualifyTarget);
        // const newNrOfPlaces = nrOfPlaces - (borderQualifyGroup && borderQualifyGroup.getNrOfToPlaces() === 2 ? 2 : 1);
        // this.updateQualifyGroups(round, qualifyTarget, newNrOfPlaces);

        const qualifyRuleService = new QualifyRuleService();
        // qualifyRuleService.recreateFrom();
        qualifyRuleService.recreateTo(round);
    }

    createChildRound(parentRound: Round, qualifyTarget: QualifyTarget, pouleStructure: BalancedPouleStructure): Round {
        let nextRoundNumber = parentRound.getNumber().getNext();
        if (!nextRoundNumber) {
            nextRoundNumber = parentRound.getNumber().createNext();
        }
        const qualifyGroup = new QualifyGroup(parentRound, qualifyTarget, nextRoundNumber);
        this.refillRound(qualifyGroup.getChildRound(), pouleStructure);
        const qualifyRuleService = new QualifyRuleService();
        qualifyRuleService.recreateTo(parentRound);
        return parentRound;
    }

    addQualifiers(round: Round, qualifyTarget: QualifyTarget, nrOfQualifiers: number) {
        if (round.getBorderQualifyGroup(qualifyTarget) === undefined) {
            if (nrOfQualifiers < 2) {
                throw Error('Voeg miniaal 2 gekwalificeerden toe');
            }
            nrOfQualifiers--;
        }
        for (let qualifier = 0; qualifier < nrOfQualifiers; qualifier++) {
            this.addQualifier(round, qualifyTarget);
        }
    }

    addQualifier(round: Round, qualifyTarget: QualifyTarget) {
        const nrOfPlaces = round.getNrOfPlacesChildren(qualifyTarget);
        const placesToAdd = nrOfPlaces === 0 ? 2 : 1;

        if ((round.getNrOfPlacesChildren() + placesToAdd) > round.getNrOfPlaces()) {
            throw new Error('er mogen maximaal ' + round.getNrOfPlacesChildren() + ' deelnemers naar de volgende ronde');
        }

        const newNrOfPlaces = nrOfPlaces + placesToAdd;
        this.updateQualifyGroups(round, qualifyTarget, newNrOfPlaces);

        const qualifyRuleService = new QualifyRuleService();
        qualifyRuleService.recreateTo(round);
    }

    isQualifyGroupSplittable(previousSingleRule: QualifyRuleSingle, currentSingleRule: QualifyRuleSingle): boolean {
        if (currentSingleRule.getNext() && currentSingleRule.getNrOfToPlaces() < 2) {
            return false;
        }
        if (this.getNrOfQualifiersPrevious(previousSingleRule) < 2 || this.getNrOfQualifiersNext(currentSingleRule) < 2) {
            return false;
        }
        return true;
    }

    protected getNrOfQualifiersPrevious(singleRule: QualifyRuleSingle): number {
        return singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Winners);
    }

    protected getNrOfQualifiersNext(singleRule: QualifyRuleSingle): number {
        return singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Losers);
    }

    splitQualifyGroup(qualifyGroup: QualifyGroup, singleRuleOne: QualifyRuleSingle, singleRuleTwo: QualifyRuleSingle) {
        if (!this.isQualifyGroupSplittable(singleRuleOne, singleRuleTwo)) {
            throw new Error('de kwalificatiegroepen zijn niet splitsbaar');
        }
        const parentRound = qualifyGroup.getParentRound();

        const firstSingleRule = singleRuleOne.getNumber() <= singleRuleTwo.getNumber() ? singleRuleOne : singleRuleTwo;
        const secondSingleRule = (firstSingleRule === singleRuleOne) ? singleRuleTwo : singleRuleOne;

        const nrOfPlacesChildrenBeforeSplit = parentRound.getNrOfPlacesChildren(qualifyGroup.getTarget());
        this.qualifyGroupEditor.splitQualifyGroupFrom(qualifyGroup, secondSingleRule);

        this.updateQualifyGroups(parentRound, qualifyGroup.getTarget(), nrOfPlacesChildrenBeforeSplit);

        const qualifyRuleService = new QualifyRuleService();
        qualifyRuleService.recreateTo(parentRound);
    }

    areQualifyGroupsMergable(previous: QualifyGroup, current: QualifyGroup): boolean {
        return (previous !== undefined && current !== undefined && previous.getTarget() !== QualifyTarget.Dropouts
            && previous.getTarget() === current.getTarget() && previous !== current);
    }

    mergeQualifyGroups(qualifyGroupOne: QualifyGroup, qualifyGroupTwo: QualifyGroup) {
        if (!this.areQualifyGroupsMergable(qualifyGroupOne, qualifyGroupTwo)) {
            throw new Error('de kwalificatiegroepen zijn niet te koppelen');
        }
        const parentRound = qualifyGroupOne.getParentRound();
        const qualifyTarget = qualifyGroupOne.getTarget();

        const firstQualifyGroup = qualifyGroupOne.getNumber() <= qualifyGroupTwo.getNumber() ? qualifyGroupOne : qualifyGroupTwo;
        const secondQualifyGroup = (firstQualifyGroup === qualifyGroupOne) ? qualifyGroupTwo : qualifyGroupOne;
        const nrOfPlacesQualifyGroups = firstQualifyGroup.getChildRound().getNrOfPlaces()
            + secondQualifyGroup.getChildRound().getNrOfPlaces();
        const nrOfPoulesFirstQualifyGroup = firstQualifyGroup.getChildRound().getPoules().length;
        const nrOfPlacesChildrenBeforeMerge = parentRound.getNrOfPlacesChildren(qualifyTarget);
        this.qualifyGroupEditor.mergeQualifyGroups(firstQualifyGroup, secondQualifyGroup);
        // first update places, before updateQualifyGroups
        const pouleStructure = new BalancedPouleStructure(nrOfPlacesQualifyGroups, nrOfPoulesFirstQualifyGroup);
        this.refillRound(firstQualifyGroup.getChildRound(), pouleStructure);

        const horizontalPouleService = new HorizontalPouleService();
        horizontalPouleService.recreate(firstQualifyGroup.getChildRound());
        secondQualifyGroup.detach(); // is already done in groupeditor


        this.updateQualifyGroups(parentRound, qualifyTarget, nrOfPlacesChildrenBeforeMerge);

        const qualifyRuleService = new QualifyRuleService();
        qualifyRuleService.recreateTo(parentRound);
    }

    updateRound(round: Round, pouleStructure: BalancedPouleStructure) {
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
    }

    protected updateQualifyGroups(round: Round, qualifyTarget: QualifyTarget, newNrOfPlacesChildren: number) {
        const roundNrOfPlaces = round.getNrOfPlaces();
        if (newNrOfPlacesChildren > roundNrOfPlaces) {
            newNrOfPlacesChildren = roundNrOfPlaces;
        }
        // dit kan niet direct door de gebruiker maar wel een paar dieptes verder op
        if (roundNrOfPlaces < 4 && newNrOfPlacesChildren >= 2) {
            newNrOfPlacesChildren = 0;
        }

        const pouleStructures = round.getQualifyGroups(qualifyTarget).map((qualifyGroup: QualifyGroup): BalancedPouleStructure => {
            return qualifyGroup.getChildRound().createPouleStructure();
        });
        round.getQualifyGroups(qualifyTarget).forEach((qualifyGroup: QualifyGroup) => qualifyGroup.detach());

        while (newNrOfPlacesChildren > 1) {
            // create qualifyGroups here
            const horizontolPoulesCreator = getNewQualifyGroup(initRemovedQualifyGroups);
            horizontolPoulesCreator.qualifyGroup.setNumber(qualifyGroupNumber++);
            horizontolPoulesCreators.push(horizontolPoulesCreator);
            newNrOfPlacesChildren -= horizontolPoulesCreator.nrOfQualifiers;
        }


        // const getNewQualifyGroup = (removedQualifyGroups: QualifyGroup[]): HorizontolPoulesCreator => {
        //     let qualifyGroup = removedQualifyGroups.shift();
        //     let nrOfQualifiers: number;
        //     if (qualifyGroup === undefined) {
        //         let nextRoundNumber = round.getNumber().getNext();
        //         if (!nextRoundNumber) {
        //             nextRoundNumber = this.createRoundNumber(round);
        //         }
        //         qualifyGroup = new QualifyGroup(round, qualifyTarget, nextRoundNumber);
        //         nrOfQualifiers = newNrOfPlacesChildren;
        //     } else {
        //         round.getQualifyGroups(qualifyTarget).push(qualifyGroup);
        //         // warning: cannot make use of qualifygroup.horizontalpoules yet!

        //         // add and remove qualifiers
        //         nrOfQualifiers = qualifyGroup.getChildRound().getNrOfPlaces();
        //         const nrOfPoules = round.getPoules().length;

        //         if (nrOfQualifiers > nrOfPoules && (nrOfQualifiers % nrOfPoules) > 0) { // when decrease nrofpoules
        //             nrOfQualifiers = nrOfQualifiers - (nrOfQualifiers % nrOfPoules);
        //         }
        //         if (nrOfQualifiers < nrOfPoules && newNrOfPlacesChildren > nrOfQualifiers) {
        //             nrOfQualifiers = nrOfPoules;
        //         }
        //         if (nrOfQualifiers > newNrOfPlacesChildren) {
        //             nrOfQualifiers = newNrOfPlacesChildren;
        //         } else if (nrOfQualifiers < newNrOfPlacesChildren && removedQualifyGroups.length === 0) {
        //             nrOfQualifiers = newNrOfPlacesChildren;
        //         }
        //         if (newNrOfPlacesChildren - nrOfQualifiers === 1) {
        //             nrOfQualifiers = newNrOfPlacesChildren;
        //         }
        //     }
        //     return { qualifyGroup, nrOfQualifiers };
        // };


        // const horizontolPoulesCreators: HorizontolPoulesCreator[] = [];
        // const qualifyGroups = round.getQualifyGroups(qualifyTarget);
        // const initRemovedQualifyGroups = qualifyGroups.splice(0, qualifyGroups.length);
        // let qualifyGroupNumber = 1;
        // while (newNrOfPlacesChildren > 1) {
        //     const horizontolPoulesCreator = getNewQualifyGroup(initRemovedQualifyGroups);
        //     horizontolPoulesCreator.qualifyGroup.setNumber(qualifyGroupNumber++);
        //     horizontolPoulesCreators.push(horizontolPoulesCreator);
        //     newNrOfPlacesChildren -= horizontolPoulesCreator.nrOfQualifiers;
        // }
        // // const horizontalPouleService = new HorizontalPouleService(round);
        // // horizontalPouleService.updateQualifyGroups(round.getHorizontalPoules(qualifyTarget).slice(), horizontolPoulesCreators);

        // horizontolPoulesCreators.forEach(creator => {
        //     const newNrOfPoules = this.calculateNewNrOfPoules(creator.qualifyGroup, creator.nrOfQualifiers);
        //     this.updateRound(creator.qualifyGroup.getChildRound(), creator.nrOfQualifiers, newNrOfPoules);
        // });

    }

    calculateNewNrOfPoules(parentQualifyGroup: QualifyGroup, newNrOfPlaces: number): number {

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
    }

    private refillRound(round: Round, pouleStructure: BalancedPouleStructure) {
        pouleStructure.forEach((nrOfPlaces: number) => {
            const poule = new Poule(round);
            for (let placeNr = 1; placeNr <= nrOfPlaces; placeNr++) {
                new Place(poule)
            }
        });
    }

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
        const pouleStructure = new BalancedPouleStructure(nrOfPlaces, nrOfPoules);
        const smallestNrOfPlacesPerPoule = pouleStructure.getSmallestPoule();
        if (smallestNrOfPlacesPerPoule < placeRange.placesPerPoule.min) {
            throw new Error('vanaf ' + placeRange.min + ' deelnemers moeten er minimaal ' + placeRange.placesPerPoule.min + ' deelnemers per poule zijn');
        }
        const biggestNrOfPlacesPerPoule = pouleStructure.getBiggestPoule();
        if (biggestNrOfPlacesPerPoule > placeRange.placesPerPoule.max) {
            throw new Error('vanaf ' + placeRange.min + ' deelnemers mogen er maximaal ' + placeRange.placesPerPoule.max + ' deelnemers per poule zijn');
        }
    }
}

export interface PlaceRange extends VoetbalRange {
    placesPerPoule: VoetbalRange;
}
