import { QualifyGroup, Round } from '../qualify/group';
import { Competition } from '../competition';
import { Place } from '../place';
import { Poule } from '../poule';
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
import { QualifyRuleSingle } from '../qualify/rule/single';

@Injectable({
    providedIn: 'root'
})
export class StructureEditor {
    private horPouleCreator: HorizontalPouleCreator;
    private rulesCreator: QualifyRuleCreator;


    constructor(
        private competitionSportService: CompetitionSportService,
        private planningConfigMapper: PlanningConfigMapper,
        @Inject('placeRanges') private placeRanges: PlaceRange[]) {
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
        if (rootRound.getNrOfDropoutPlaces() <= 0) {
            throw new Error('de deelnemer kan niet verwijderd worden, omdat alle deelnemer naar de volgende ronde gaan');
        }
        const newNrOfPlaces = rootRound.getNrOfPlaces() - 1;
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
        this.rulesCreator.remove(parentRound);
        // begin editing
        this.removePlaceFromRound(childRound);
        // end editing
        this.rulesCreator.create(parentRound);
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

    protected getNrOfQualifiersPrevious(singleRule: QualifyRuleSingle): number {
        return singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Winners);
    }

    protected getNrOfQualifiersNext(singleRule: QualifyRuleSingle): number {
        return singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Losers);
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

    isQualifyGroupSplittableAt(singleRule: QualifyRuleSingle): boolean {
        const next = singleRule.getNext();
        if (next === undefined) {
            return false;
        }
        return this.getNrOfQualifiersPrevious(singleRule) >= 2 && this.getNrOfQualifiersNext(next) >= 2;
    }

    // horizontalPoule is split-points, from which qualifyGroup
    splitQualifyGroupFrom(qualifyGroup: QualifyGroup, singleRule: QualifyRuleSingle) {
        const parentRound = qualifyGroup.getParentRound();
        if (parentRound === undefined) {
            return;
        }
        const nrOfToPlaces = singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Winners);
        const borderSideNrOfToPlaces = singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Losers);
        if (nrOfToPlaces < 2 || borderSideNrOfToPlaces < 2) {
            throw new Error('de kwalificatiegroep is niet splitsbaar');
        }
        const childRound = qualifyGroup.getChildRound();
        this.rulesCreator.remove(parentRound);
        // begin editing

        // STEP 1 : insert new round
        const newQualifyGroup = this.insertAfterQualifyGroup(parentRound, qualifyGroup);
        // STEP 2 : update existing qualifyGroup        
        while (childRound.getNrOfPlaces() > (nrOfToPlaces)) {
            this.removePlaceFromRound(childRound);
        }
        // STEP 3 : fill new qualifyGroup
        const newChildRound = newQualifyGroup.getChildRound();
        const nrOfPoulePlaces = childRound.getFirstPoule().getPlaces().length;
        const newNrOfPoules = this.calculateNrOfPoulesInsertedQualifyGroup(borderSideNrOfToPlaces, nrOfPoulePlaces);
        const balancedPouleStructure = this.createBalanced(borderSideNrOfToPlaces, newNrOfPoules)
        this.fillRound(newChildRound, balancedPouleStructure);
        this.horPouleCreator.create(newChildRound);
        // end editing
        this.rulesCreator.create(parentRound);
    }

    // horizontalPoule is split-points, from which qualifyGroup
    protected insertAfterQualifyGroup(parentRound: Round, qualifyGroup: QualifyGroup): QualifyGroup {

        const childRound = qualifyGroup.getChildRound();

        const newQualifyGroup = new QualifyGroup(
            parentRound,
            qualifyGroup.getTarget(),
            childRound.getNumber(),
            qualifyGroup.getNumber()
        );
        this.renumber(parentRound, qualifyGroup.getTarget());
        return newQualifyGroup;
    }

    protected calculateNrOfPoulesInsertedQualifyGroup(nrOfToPlaces: number, nrOfPoulePlaces: number): number {
        let nrOfPoules = 0;
        while ((nrOfToPlaces - nrOfPoulePlaces) >= 0) {
            nrOfPoules++;
            nrOfToPlaces -= nrOfPoulePlaces;
        }
        if (nrOfToPlaces === 1) {
            nrOfPoules--;
        }
        return nrOfPoules;
    }

    /**
     * recalc horPoules and rules only downwards
     * @param round 
     */
    protected removePlaceFromRound(round: Round): void {
        this.horPouleCreator.remove(round);
        this.rulesCreator.remove(round);
        // begin editing
        const nrOfPlacesRemoved = round.removePlace();
        if (nrOfPlacesRemoved > 1 && round.getPoules().length >= 1) {
            round.addPlace();
        }
        this.horPouleCreator.create(round);
        // === because nrOfQualifiers should always go down with at leat one
        if (round.getNrOfDropoutPlaces() <= 0) {
            const losersBorderQualifyGroup = round.getBorderQualifyGroup(QualifyTarget.Losers);
            const childQualifyTarget = losersBorderQualifyGroup !== undefined ? QualifyTarget.Losers : QualifyTarget.Winners;
            this.removeQualifier(round, childQualifyTarget);
        } else {
            this.rulesCreator.create(round);
        }
    }

    areQualifyGroupsMergable(previous: QualifyGroup, current: QualifyGroup): boolean {
        return previous.getTarget() === current.getTarget() && previous.getNumber() + 1 === current.getNumber();
    }

    mergeQualifyGroups(firstQualifyGroup: QualifyGroup, secondQualifyGroup: QualifyGroup) {
        const parentRound = firstQualifyGroup.getParentRound();
        const childRound = firstQualifyGroup.getChildRound();
        this.horPouleCreator.remove(childRound);
        this.rulesCreator.remove(parentRound);
        // begin editing        
        const nrOfPlacesToAdd = secondQualifyGroup.getChildRound().getNrOfPlaces();
        secondQualifyGroup.detach();
        this.renumber(parentRound, secondQualifyGroup.getTarget());
        for (let counter = 0; counter < nrOfPlacesToAdd; counter++) {
            firstQualifyGroup.getChildRound().addPlace();
        }
        // end editing
        this.horPouleCreator.create(childRound);
        this.rulesCreator.create(parentRound);
    }

    protected renumber(round: Round, qualifyTarget: QualifyTarget) {
        let number = 1;
        round.getQualifyGroups(qualifyTarget).forEach(qualifyGroup => {
            qualifyGroup.setNumber(number++);
        });
    }
}

export interface PlaceRange extends VoetbalRange {
    placesPerPoule: VoetbalRange;
}
