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
import { SingleQualifyRule } from '../qualify/rule/single';
import { BalancedPouleStructureCreator } from '../poule/structure/balancedCreator';
import { PlaceRanges } from './placeRanges';

@Injectable({
    providedIn: 'root'
})
export class StructureEditor {
    private horPouleCreator: HorizontalPouleCreator;
    private rulesCreator: QualifyRuleCreator;
    private placeRanges: PlaceRanges | undefined;

    constructor(
        private competitionSportService: CompetitionSportService,
        private planningConfigMapper: PlanningConfigMapper/*,
        @Inject('placeRanges') private placeRanges: PlaceRanges*/) {
        this.horPouleCreator = new HorizontalPouleCreator();
        this.rulesCreator = new QualifyRuleCreator();
    }

    setPlaceRanges(placeRanges: PlaceRanges): void {
        this.placeRanges = placeRanges;
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
        this.placeRanges?.validateStructure(balancedPouleStructure);
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
        const newNrOfPlaces = rootRound.getNrOfPlaces() + 1;
        const nrOfPoules = rootRound.getPoules().length;
        this.validate(newNrOfPlaces, nrOfPoules);

        this.horPouleCreator.remove(rootRound);
        this.rulesCreator.remove(rootRound);
        // begin editing        
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
        this.validate(newNrOfPlaces, rootRound.getPoules().length);
        this.horPouleCreator.remove(rootRound);
        this.rulesCreator.remove(rootRound);
        // begin editing
        rootRound.removePlace();
        // end editing
        this.horPouleCreator.create(rootRound);
        this.rulesCreator.create(rootRound);
    }

    public addPouleToRootRound(rootRound: Round): Poule {
        const lastPoule = rootRound.getFirstPoule();
        const newNrOfPlaces = rootRound.getNrOfPlaces() + lastPoule.getPlaces().length;
        this.validate(newNrOfPlaces, rootRound.getPoules().length + 1);

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
        // end editing
        this.horPouleCreator.create(rootRound);
        this.rulesCreator.create(rootRound);
    }

    public incrementNrOfPoules(round: Round) {
        this.validate(round.getNrOfPlaces(), round.getPoules().length + 1);

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

    addQualifiers(parentRound: Round, qualifyTarget: QualifyTarget, nrOfToPlacesToAdd: number) {
        const nrOfPlaces = parentRound.getNrOfPlaces();
        const nrOfToPlaces = parentRound.getNrOfPlacesChildren();
        if ((nrOfToPlaces + nrOfToPlacesToAdd) > nrOfPlaces) {
            throw new Error('er mogen maximaal ' + (nrOfPlaces - nrOfToPlaces) + ' deelnemers naar de volgende ronde');
        }

        let qualifyGroup = parentRound.getBorderQualifyGroup(qualifyTarget);
        const addChildRound = qualifyGroup === undefined;
        if (addChildRound) {
            const minNrOfPlacesPerPoule = this.placeRanges?.getPlacesPerPouleSmall().min ?? PlaceRanges.MinNrOfPlacesPerPoule;
            if (nrOfToPlacesToAdd < minNrOfPlacesPerPoule) {
                throw new Error('er moeten minimaal ' + minNrOfPlacesPerPoule + ' deelnemers naar de volgende ronde, vanwege het aantal deelnemers per wedstrijd');
            }
            const newStructure = new BalancedPouleStructure(minNrOfPlacesPerPoule);
            this.placeRanges?.validateStructure(newStructure);
            this.horPouleCreator.remove(parentRound);
            this.rulesCreator.remove(parentRound);
            // begin editing
            qualifyGroup = this.addChildRoundHelper(parentRound, qualifyTarget, newStructure);
            nrOfToPlacesToAdd -= minNrOfPlacesPerPoule;
            const childRound = qualifyGroup.getChildRound();
            while (nrOfToPlacesToAdd-- > 0) {
                childRound.addPlace();
            }
            // end editing
            this.horPouleCreator.create(parentRound, childRound);
            this.rulesCreator.create(parentRound, childRound);
        } else {
            const childRound = qualifyGroup.getChildRound();
            this.validate(childRound.getNrOfPlaces() + nrOfToPlacesToAdd, childRound.getPoules().length);
            this.horPouleCreator.remove(childRound);
            this.rulesCreator.remove(parentRound, childRound);
            // begin editing        
            while (nrOfToPlacesToAdd-- > 0) {
                childRound.addPlace();
            }
            // end editing
            this.horPouleCreator.create(childRound);
            this.rulesCreator.create(parentRound, childRound);
        }
    }

    removeQualifier(parentRound: Round, qualifyTarget: QualifyTarget): boolean {
        const qualifyGroup = parentRound.getBorderQualifyGroup(qualifyTarget);
        if (qualifyGroup === undefined) {
            return false;
        }
        const childRound = qualifyGroup.getChildRound();
        this.rulesCreator.remove(parentRound);
        // begin editing
        if (childRound.getNrOfPlaces() <= this.getMinPlacesPerPouleSmall()) {
            qualifyGroup.detach();
        } else {
            this.removePlaceFromRound(childRound);
        }
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

    protected getNrOfQualifiersPrevious(singleRule: SingleQualifyRule): number {
        return singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Winners);
    }

    protected getNrOfQualifiersNext(singleRule: SingleQualifyRule): number {
        return singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Losers);
    }

    protected getRoot(round: Round): Round {
        const parent = round.getParent();
        return parent ? this.getRoot(parent) : round;
    }

    createBalanced(nrOfPlaces: number, nrOfPoules: number): BalancedPouleStructure {
        const creator = new BalancedPouleStructureCreator()
        return creator.create(nrOfPlaces, nrOfPoules);
    }

    isQualifyGroupSplittableAt(singleRule: SingleQualifyRule): boolean {
        const next = singleRule.getNext();
        if (next === undefined) {
            return false;
        }
        return this.getNrOfQualifiersPrevious(singleRule) >= this.getMinPlacesPerPouleSmall()
            && this.getNrOfQualifiersNext(next) >= this.getMinPlacesPerPouleSmall();
    }

    // horizontalPoule is split-points, from which qualifyGroup
    splitQualifyGroupFrom(qualifyGroup: QualifyGroup, singleRule: SingleQualifyRule) {
        const parentRound = qualifyGroup.getParentRound();
        if (parentRound === undefined) {
            return;
        }
        const nrOfToPlaces = singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Winners);
        const borderSideNrOfToPlaces = singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Losers);
        if (nrOfToPlaces < this.getMinPlacesPerPouleSmall() || borderSideNrOfToPlaces < this.getMinPlacesPerPouleSmall()) {
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
            qualifyGroup.getNumber() + 1
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

    validate(nrOfPlaces: number, nrOfPoules: number) {
        if (this.placeRanges) {
            this.placeRanges.validate(nrOfPlaces, nrOfPoules);
        }
        if (nrOfPlaces < PlaceRanges.MinNrOfPlacesPerPoule) {
            throw new Error('het minimaal aantal deelnemers is ' + PlaceRanges.MinNrOfPlacesPerPoule);
        }
    }

    getMinPlacesPerPouleSmall(): number {
        return this.placeRanges ? this.placeRanges.getPlacesPerPouleSmall().min : PlaceRanges.MinNrOfPlacesPerPoule;
    }
}

export interface PlaceRange extends VoetbalRange {
    placesPerPoule: VoetbalRange;

}
