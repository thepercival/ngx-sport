import { QualifyGroup, Round } from '../qualify/group';
import { Competition } from '../competition';
import { Place } from '../place';
import { Poule } from '../poule';
import { RoundNumber } from '../round/number';
import { Structure } from '../structure';
import { VoetbalRange } from '../range';
import { JsonPlanningConfig } from '../planning/config/json';
import { Injectable } from '@angular/core';
import { QualifyTarget } from '../qualify/target';
import { BalancedPouleStructure } from '../poule/structure/balanced';
import { PlanningConfigMapper } from '../planning/config/mapper';
import { HorizontalPouleCreator } from '../poule/horizontal/creator';
import { QualifyRuleCreator } from '../qualify/rule/creator';
import { BalancedPouleStructureCreator } from '../poule/structure/balancedCreator';
import { PlaceRanges } from './placeRanges';
import { QualifyGroupNrOfPlacesMap, RemovalValidator } from './removalValidator';
import { Category } from '../category';
import { CompetitionSport } from '../competition/sport';
import { StructureCell } from './cell';
import { QualifyDistribution } from '../qualify/distribution';
import { HorizontalSingleQualifyRule } from '../qualify/rule/horizontal/single';
import { CompetitionSportEditor } from '../competition/sport/editor';
import { CompetitionSportGetter } from '../competition/sport/getter';
import { VerticalSingleQualifyRule } from '../qualify/rule/vertical/single';

@Injectable({
    providedIn: 'root'
})
export class StructureEditor {
    private horPouleCreator: HorizontalPouleCreator;
    private rulesCreator: QualifyRuleCreator;
    private removalValidator: RemovalValidator;
    private placeRanges: PlaceRanges | undefined;

    constructor(
        private competitionSportEditor: CompetitionSportEditor,
        private planningConfigMapper: PlanningConfigMapper/*,
        @Inject('placeRanges') private placeRanges: PlaceRanges*/) {
        this.horPouleCreator = new HorizontalPouleCreator();
        this.rulesCreator = new QualifyRuleCreator();
        this.removalValidator = new RemovalValidator();
    }

    setPlaceRanges(placeRanges: PlaceRanges): void {
        this.placeRanges = placeRanges;
    }

    create(
        competition: Competition,
        pouleStructure: number[],
        jsonPlanningConfig?: JsonPlanningConfig | undefined,
        categoryName?: string | undefined,): Structure {

        const firstRoundNumber = new RoundNumber(competition, undefined);
        this.planningConfigMapper.toObject(jsonPlanningConfig, firstRoundNumber);

        const category = this.addCategoryHelper(
            categoryName ?? Category.DefaultName, 1, firstRoundNumber,
            new BalancedPouleStructure(...pouleStructure)
        );

        const structure = new Structure([category], firstRoundNumber);
        competition.getSports().forEach(competitionSport => {
            this.competitionSportEditor.addToStructure(competitionSport, structure);
        });

        const rootRound = category.getRootRound();
        this.horPouleCreator.create(rootRound);
        this.rulesCreator.create(rootRound);

        return new Structure([category], firstRoundNumber);
    }

    public addCategory(
        name: string,
        number: number,
        firstRoundNumber: RoundNumber,
        pouleStructure: BalancedPouleStructure): Category {

        // begin editing
        const category = this.addCategoryHelper(name, number, firstRoundNumber, pouleStructure);
        firstRoundNumber.getCompetitionSports().forEach((competitionSport: CompetitionSport) => {
            this.competitionSportEditor.addToCategory(competitionSport, category);
        });
        // end editing
        const rootRound = category.getRootRound();
        this.horPouleCreator.create(rootRound);
        this.rulesCreator.create(rootRound);
        return category;
    }

    public addCategoryHelper(
        name: string,
        number: number,
        firstRoundNumber: RoundNumber,
        pouleStructure: BalancedPouleStructure): Category {

        // begin editing
        const competition = firstRoundNumber.getCompetition();

        const category = new Category(competition, name, number);
        const structureCell = new StructureCell(category, firstRoundNumber);
        const rootRound = new Round(structureCell, undefined);

        this.fillRound(rootRound, pouleStructure);
        return category;
    }

    addChildRound(
        parentRound: Round, 
        qualifyTarget: QualifyTarget, 
        pouleStructure: number[],
        distribution: QualifyDistribution = QualifyDistribution.HorizontalSnake): Round {
        const balancedPouleStructure = new BalancedPouleStructure(...pouleStructure);
        this.placeRanges?.validateStructure(balancedPouleStructure);
        this.rulesCreator.remove(parentRound);
        // begin editing

        const qualifyGroup = this.addChildRoundHelper(
            parentRound,
            qualifyTarget,
            balancedPouleStructure,
            distribution
        );
        // end editing
        this.horPouleCreator.create(qualifyGroup.getChildRound());
        this.rulesCreator.create(parentRound);
        return qualifyGroup.getChildRound();
    }

    private addChildRoundHelper(
        parentRound: Round, 
        qualifyTarget: QualifyTarget, 
        pouleStructure: BalancedPouleStructure,
        distribution: QualifyDistribution): QualifyGroup {
        let nextStructureCell = parentRound.getStructureCell().getNext();
        if (nextStructureCell === undefined) {
            nextStructureCell = parentRound.getStructureCell().createNext();
        }
        const qualifyGroup = new QualifyGroup(parentRound, qualifyTarget, nextStructureCell);
        qualifyGroup.setDistribution(distribution);
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
        this.validate(rootRound.getCompetition(), newNrOfPlaces, nrOfPoules);

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
        this.validate(rootRound.getCompetition(), newNrOfPlaces, rootRound.getPoules().length);
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
        this.validate(rootRound.getCompetition(), newNrOfPlaces, rootRound.getPoules().length + 1);

        this.horPouleCreator.remove(rootRound);
        this.rulesCreator.remove(rootRound);
        // begin editing
        rootRound.addPoule();
        this.addChildRoundPlacesForNonCrossFinals(rootRound);
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
        // const lastPoule = rootRound.getLastPoule();
        // const newNrOfPlaces = rootRound.getNrOfPlaces() - lastPoule.getPlaces().length;

        // if (newNrOfPlaces < rootRound.getNrOfPlacesChildren()) {
        //     throw new Error('de poule kan niet verwijderd worden, omdat er te weinig deelnemers '
        //         + 'overblijven om naar de volgende ronde gaan');
        // }

        const places = rootRound.getLastPoule().getPlaces();
        const nrOfPlacesToRemoveMap = this.removalValidator.getNrOfPlacesToRemoveMap(rootRound, places);
        this.removalValidator.willStructureBeValid(rootRound, nrOfPlacesToRemoveMap, this.getMinPlacesPerPouleSmall());

        this.horPouleCreator.remove(rootRound);
        this.rulesCreator.remove(rootRound);
        // begin editing
        rootRound.removePoule();
        this.removeChildRoundPlaces(rootRound, nrOfPlacesToRemoveMap);
        // end editing
        this.horPouleCreator.create(rootRound);
        this.rulesCreator.create(rootRound);
    }

    private removeChildRoundPlaces(parentRound: Round, nrOfPlacesToRemoveMap: QualifyGroupNrOfPlacesMap): void {
        [QualifyTarget.Winners, QualifyTarget.Losers].forEach((qualifyTarget: QualifyTarget) => {
            const qualifyGroups = parentRound.getQualifyGroups(qualifyTarget);
            if (qualifyGroups.length < 2) { // kan weg?
                return;
            }
            qualifyGroups.forEach((qualifyGroup: QualifyGroup) => {
                const qualifyGroupIdx = this.removalValidator.getQualifyGroupIndex(qualifyGroup);
                let nrOfPlacesToRemove = nrOfPlacesToRemoveMap[qualifyGroupIdx];
                while (nrOfPlacesToRemove--) {
                    this.removePlaceFromRound(qualifyGroup.getChildRound(), false);
                }
            });
        });
    }

    public incrementNrOfPoules(round: Round) {
        this.validate(round.getCompetition(), round.getNrOfPlaces(), round.getPoules().length + 1);

        this.horPouleCreator.remove(round);
        this.rulesCreator.remove(round);
        // begin editing
        const nrOfPlacesToRemove = round.addPoule().getPlaces().length;
        for (let i = 0; i < nrOfPlacesToRemove; i++) {
            round.removePlace();
        }
        this.addChildRoundPlacesForNonCrossFinals(round);
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

    addQualifiers(parentRound: Round, qualifyTarget: QualifyTarget, nrOfToPlacesToAdd: number, distribution: QualifyDistribution, maxNrOfPoulePlaces?: number) {
        const nrOfPlaces = parentRound.getNrOfPlaces();
        const nrOfToPlaces = parentRound.getNrOfPlacesChildren();
        if ((nrOfToPlaces + nrOfToPlacesToAdd) > nrOfPlaces) {
            throw new Error('er mogen maximaal ' + (nrOfPlaces - nrOfToPlaces) + ' deelnemers naar de volgende ronde');
        }

        const sportVariants = parentRound.getCompetition().getSportVariants();
        let qualifyGroup = parentRound.getBorderQualifyGroup(qualifyTarget);
        const addChildRound = qualifyGroup === undefined;
        if (addChildRound) {
            let minNrOfPlacesPerPoule = this.placeRanges?.getPlacesPerPouleSmall().min;
            if( minNrOfPlacesPerPoule === undefined) {
               minNrOfPlacesPerPoule = (new CompetitionSportGetter()).getMinNrOfPlacesPerPoule(sportVariants);
            }
            if (nrOfToPlacesToAdd < minNrOfPlacesPerPoule) {
                throw new Error('er moeten minimaal ' + minNrOfPlacesPerPoule + ' deelnemers naar de volgende ronde, vanwege het aantal deelnemers per wedstrijd');
            }
            const newStructure = new BalancedPouleStructure(minNrOfPlacesPerPoule);
            this.placeRanges?.validateStructure(newStructure);
            this.horPouleCreator.remove(parentRound);
            this.rulesCreator.remove(parentRound);

            // begin editing
            qualifyGroup = this.addChildRoundHelper(parentRound, qualifyTarget, newStructure, distribution);
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
            this.validate(childRound.getCompetition(), 
            childRound.getNrOfPlaces() + nrOfToPlacesToAdd, childRound.getPoules().length);
            this.horPouleCreator.remove(childRound);
            this.rulesCreator.remove(parentRound, childRound);
            // begin editing
            let pouleAdded = false;
            while (nrOfToPlacesToAdd-- > 0) {
                const pouleStructure = childRound.createPouleStructure();
                if (maxNrOfPoulePlaces && this.canAddPouleByAddingOnePlace(pouleStructure, maxNrOfPoulePlaces)) {
                    const nrOfPlacesToRemove = childRound.addPoule().getPlaces().length;
                    for (let i = 0; i < nrOfPlacesToRemove - 1; i++) {
                        childRound.removePlace();
                    }
                    pouleAdded = true;
                } else {
                    childRound.addPlace();
                }
            }
            if (pouleAdded) {
                this.addChildRoundPlacesForNonCrossFinals(childRound);
            }
            // end editing
            this.horPouleCreator.create(childRound);
            this.rulesCreator.create(parentRound, childRound);
        }
    }

    protected canAddPouleByAddingOnePlace(pouleStructure: BalancedPouleStructure, maxNrOfPoulePlaces: number): boolean {
        let nrOfPlacesForNewPoule = 0;
        pouleStructure.forEach((nrOfPoulePlaces: number) => {
            const nrOfPoulePlacesForNewPoule = nrOfPoulePlaces - maxNrOfPoulePlaces;
            if (nrOfPoulePlacesForNewPoule > 0) {
                nrOfPlacesForNewPoule += nrOfPoulePlacesForNewPoule;
            }
        });
        return (nrOfPlacesForNewPoule + 1) >= maxNrOfPoulePlaces;
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
            this.removePlaceFromRound(childRound, false);
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

    protected getNrOfQualifiersPrevious(singleRule: HorizontalSingleQualifyRule | VerticalSingleQualifyRule): number {
        return singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Winners);
    }

    protected getNrOfQualifiersNext(singleRule: HorizontalSingleQualifyRule | VerticalSingleQualifyRule): number {
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

    isQualifyGroupSplittableAt(singleRule: HorizontalSingleQualifyRule | VerticalSingleQualifyRule): boolean {
        const next = singleRule.getNext();
        if (next === undefined) {
            return false;
        }
        return this.getNrOfQualifiersPrevious(singleRule) >= this.getMinPlacesPerPouleSmall()
            && this.getNrOfQualifiersNext(next) >= this.getMinPlacesPerPouleSmall();
    }

    // horizontalPoule is split-points, from which qualifyGroup
    splitQualifyGroupFrom(qualifyGroup: QualifyGroup, singleRule: HorizontalSingleQualifyRule | VerticalSingleQualifyRule) {
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
            childRound.getStructureCell(),
            qualifyGroup.getNumber() + 1
        );
        newQualifyGroup.setDistribution(qualifyGroup.getDistribution());
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
        if (nrOfPoules === 0) {
            nrOfPoules++;
        }
        return nrOfPoules;
    }

    /**
     * recalc horPoules and rules only downwards
     */
    protected removePlaceFromRound(round: Round, canHaveZeroDropoutPlaces: boolean = true): void {
        this.horPouleCreator.remove(round);
        this.rulesCreator.remove(round);
        // begin editing
        const nrOfPlacesRemoved = round.removePlace();
        if (nrOfPlacesRemoved > 1 && round.getPoules().length >= 1) {
            round.addPlace();
        }
        this.horPouleCreator.create(round);
        const nrOfDropoutPlaces = round.getNrOfDropoutPlaces();
        if (nrOfDropoutPlaces < 0 || (!canHaveZeroDropoutPlaces && round.getNrOfDropoutPlaces() === 0)) {
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

    validate(competition: Competition, nrOfPlaces: number, nrOfPoules: number) {
        if (this.placeRanges) {
            this.placeRanges.validate(nrOfPlaces, nrOfPoules);
        }
        const m = (new CompetitionSportGetter()).getMinNrOfPlacesPerPoule(competition.getSportVariants());
        if (nrOfPlaces < m) {
            throw new Error('het minimaal aantal deelnemers is ' + m);
        }
    }

    getMinPlacesPerPouleSmall(): number {
        return this.placeRanges ? this.placeRanges.getPlacesPerPouleSmall().min : PlaceRanges.MinNrOfPlacesPerPoule;
    }

    private addChildRoundPlacesForNonCrossFinals(parentRound: Round): void {
        [QualifyTarget.Winners, QualifyTarget.Losers].forEach((qualifyTarget: QualifyTarget) => {
            const qualifyGroups = parentRound.getQualifyGroups(qualifyTarget);
            if (qualifyGroups.length < 2) {
                return;
            }

            const nrOfPoulesBeforeAdd = parentRound.getPoules().length - 1;

            const maxNrOfPlaces = parentRound.getNrOfPlaces();
            let currentNrOfPlaces = 0;
            qualifyGroups.forEach((qualifyGroup: QualifyGroup) => {
                const childRound = qualifyGroup.getChildRound();
                this.horPouleCreator.remove(childRound);
                this.rulesCreator.remove(childRound);

                if (maxNrOfPlaces - currentNrOfPlaces < this.getMinPlacesPerPouleSmall()) {
                    qualifyGroup.detach();
                    return;
                }

                const nrOfPlacesToAdd = childRound.getNrOfPlaces() / nrOfPoulesBeforeAdd;
                for (let i = 1; i <= nrOfPlacesToAdd; i++) {
                    childRound.addPlace();
                }
                currentNrOfPlaces += childRound.getNrOfPlaces();
                this.horPouleCreator.create(childRound);
                this.rulesCreator.create(childRound);
            });
        });
    }
}

export interface PlaceRange extends VoetbalRange {
    placesPerPoule: VoetbalRange;

}

export enum ExpandDirection {
    Horizontal, Vertical
}