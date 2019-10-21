import { QualifyGroup } from '../../src/qualify/group';
import { Competition } from '../competition';
import { Place } from '../place';
import { PlanningConfigService } from '../planning/config/service';
import { Poule } from '../poule';
import { HorizontalPoule } from '../poule/horizontal';
import { HorizontalPouleService } from '../poule/horizontal/service';
import { QualifyGroupService } from '../qualify/group/service';
import { QualifyRuleService } from '../qualify/rule/service';
import { Round } from '../round';
import { RoundNumber } from '../round/number';
import { SportConfigService } from '../sport/config/service';
import { SportPlanningConfigService } from '../sport/planningconfig/service';
import { SportScoreConfigService } from '../sport/scoreconfig/service';
import { Structure } from '../structure';
import { VoetbalRange } from '../range';

export class StructureService {
    private planningConfigService: PlanningConfigService;
    private sportConfigService: SportConfigService;

    constructor(
        private competitorRange?: VoetbalRange
    ) {
        this.planningConfigService = new PlanningConfigService();
        this.sportConfigService = new SportConfigService(new SportScoreConfigService(), new SportPlanningConfigService());
    }

    create(competition: Competition, nrOfPlaces: number, nrOfPoules?: number): Structure {
        const firstRoundNumber = new RoundNumber(competition);
        this.planningConfigService.createDefault(firstRoundNumber);
        const rootRound = new Round(firstRoundNumber, undefined);
        const nrOfPoulesToAdd = nrOfPoules ? nrOfPoules : this.getDefaultNrOfPoules(nrOfPlaces);
        this.updateRound(rootRound, nrOfPlaces, nrOfPoulesToAdd);
        const structure = new Structure(firstRoundNumber, rootRound);
        competition.getSportConfigs().forEach(sportConfig => {
            this.sportConfigService.addToStructure(sportConfig, structure);
        });
        structure.setStructureNumbers();
        return structure;
    }

    removePlaceFromRootRound(round: Round) {
        // console.log('removePlace for round ' + round.getNumberAsValue());
        const nrOfPlaces = round.getNrOfPlaces();
        if (nrOfPlaces === round.getNrOfPlacesChildren()) {
            throw new Error('de deelnemer kan niet verwijderd worden, omdat alle deelnemer naar de volgende ronde gaan');
        }
        const newNrOfPlaces = nrOfPlaces - 1;
        if (this.competitorRange && newNrOfPlaces < this.competitorRange.min) {
            throw new Error('er moeten minimaal ' + this.competitorRange.min + ' deelnemers zijn');
        }
        if ((newNrOfPlaces / round.getPoules().length) < 2) {
            throw new Error('Er kan geen deelnemer verwijderd worden. De minimale aantal deelnemers per poule is 2.');
        }

        this.updateRound(round, newNrOfPlaces, round.getPoules().length);

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setStructureNumbers();
    }

    addPlaceToRootRound(round: Round): Place {
        const newNrOfPlaces = round.getNrOfPlaces() + 1;
        if (this.competitorRange && newNrOfPlaces > this.competitorRange.max) {
            throw new Error('er mogen maximaal ' + this.competitorRange.max + ' deelnemers meedoen');
        }

        this.updateRound(round, newNrOfPlaces, round.getPoules().length);

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setStructureNumbers();

        return round.getFirstPlace(QualifyGroup.LOSERS);
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

        this.updateRound(round, newNrOfPlaces, poules.length - 1);
        if (!round.isRoot()) {
            const qualifyRuleService = new QualifyRuleService(round);
            qualifyRuleService.recreateFrom();
        }

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setStructureNumbers();
    }

    public addPoule(round: Round, modifyNrOfPlaces?: boolean): Poule {
        const poules = round.getPoules();
        const lastPoule = poules[poules.length - 1];
        const newNrOfPlaces = round.getNrOfPlaces() + (modifyNrOfPlaces ? lastPoule.getPlaces().length : 0);
        if (modifyNrOfPlaces && this.competitorRange && newNrOfPlaces > this.competitorRange.max) {
            throw new Error('er mogen maximaal ' + this.competitorRange.max + ' deelnemers meedoen');
        }
        this.updateRound(round, newNrOfPlaces, poules.length + 1);
        if (!round.isRoot()) {
            const qualifyRuleService = new QualifyRuleService(round);
            qualifyRuleService.recreateFrom();
        }

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setStructureNumbers();

        const newPoules = round.getPoules();
        return newPoules[newPoules.length - 1];
    }

    removeQualifier(round: Round, winnersOrLosers: number) {

        const nrOfPlaces = round.getNrOfPlacesChildren(winnersOrLosers);
        const borderQualifyGroup = round.getBorderQualifyGroup(winnersOrLosers);
        const newNrOfPlaces = nrOfPlaces - (borderQualifyGroup && borderQualifyGroup.getNrOfQualifiers() === 2 ? 2 : 1);
        this.updateQualifyGroups(round, winnersOrLosers, newNrOfPlaces);

        const qualifyRuleService = new QualifyRuleService(round);
        // qualifyRuleService.recreateFrom();
        qualifyRuleService.recreateTo();

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setStructureNumbers();
    }

    addQualifiers(round: Round, winnersOrLosers: number, nrOfQualifiers: number) {
        if (round.getBorderQualifyGroup(winnersOrLosers) === undefined) {
            if (nrOfQualifiers < 2) {
                throw Error('Voeg miniaal 2 gekwalificeerden toe');
            }
            nrOfQualifiers--;
        }
        for (let qualifier = 0; qualifier < nrOfQualifiers; qualifier++) {
            this.addQualifier(round, winnersOrLosers);
        }
    }

    addQualifier(round: Round, winnersOrLosers: number) {
        if (round.getNrOfPlacesChildren() >= round.getNrOfPlaces()) {
            throw new Error('er mogen maximaal ' + round.getNrOfPlacesChildren() + ' deelnemers naar de volgende ronde');
        }
        const nrOfPlaces = round.getNrOfPlacesChildren(winnersOrLosers);
        const newNrOfPlaces = nrOfPlaces + (nrOfPlaces === 0 ? 2 : 1);
        this.updateQualifyGroups(round, winnersOrLosers, newNrOfPlaces);

        const qualifyRuleService = new QualifyRuleService(round);
        qualifyRuleService.recreateTo();

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setStructureNumbers();
    }

    isQualifyGroupSplittable(previous: HorizontalPoule, current: HorizontalPoule): boolean {
        if (!previous || !previous.getQualifyGroup() || previous.getQualifyGroup() !== current.getQualifyGroup()) {
            return false;
        }
        if (current.isBorderPoule() && current.getNrOfQualifiers() < 2) {
            return false;
        }
        return true;
    }

    splitQualifyGroup(qualifyGroup: QualifyGroup, pouleOne: HorizontalPoule, pouleTwo: HorizontalPoule) {
        if (!this.isQualifyGroupSplittable(pouleOne, pouleTwo)) {
            throw new Error('de kwalificatiegroepen zijn niet splitsbaar');
        }
        const round = qualifyGroup.getRound();

        const firstHorPoule = pouleOne.getNumber() <= pouleTwo.getNumber() ? pouleOne : pouleTwo;
        const secondHorPoule = (firstHorPoule === pouleOne) ? pouleTwo : pouleOne;

        const nrOfPlacesChildrenBeforeSplit = round.getNrOfPlacesChildren(qualifyGroup.getWinnersOrLosers());
        const qualifyGroupService = new QualifyGroupService(this);
        qualifyGroupService.splitFrom(secondHorPoule);

        this.updateQualifyGroups(round, qualifyGroup.getWinnersOrLosers(), nrOfPlacesChildrenBeforeSplit);

        const qualifyRuleService = new QualifyRuleService(round);
        qualifyRuleService.recreateTo();

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setStructureNumbers();
    }

    areQualifyGroupsMergable(previous: QualifyGroup, current: QualifyGroup): boolean {
        return (previous !== undefined && current !== undefined && previous.getWinnersOrLosers() !== QualifyGroup.DROPOUTS
            && previous.getWinnersOrLosers() === current.getWinnersOrLosers() && previous !== current);
    }

    mergeQualifyGroups(qualifyGroupOne: QualifyGroup, qualifyGroupTwo: QualifyGroup) {
        if (!this.areQualifyGroupsMergable(qualifyGroupOne, qualifyGroupTwo)) {
            throw new Error('de kwalificatiegroepen zijn niet te koppelen');
        }
        const round = qualifyGroupOne.getRound();
        const winnersOrLosers = qualifyGroupOne.getWinnersOrLosers();

        const firstQualifyGroup = qualifyGroupOne.getNumber() <= qualifyGroupTwo.getNumber() ? qualifyGroupOne : qualifyGroupTwo;
        const secondQualifyGroup = (firstQualifyGroup === qualifyGroupOne) ? qualifyGroupTwo : qualifyGroupOne;

        const nrOfPlacesChildrenBeforeMerge = round.getNrOfPlacesChildren(winnersOrLosers);
        const qualifyGroupService = new QualifyGroupService(this);
        qualifyGroupService.merge(firstQualifyGroup, secondQualifyGroup);

        this.updateQualifyGroups(round, winnersOrLosers, nrOfPlacesChildrenBeforeMerge);

        const qualifyRuleService = new QualifyRuleService(round);
        qualifyRuleService.recreateTo();

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setStructureNumbers();
    }

    updateRound(round: Round, newNrOfPlaces: number, newNrOfPoules: number) {

        if (round.getNrOfPlaces() === newNrOfPlaces && newNrOfPoules === round.getPoules().length) {
            return;
        }
        this.refillRound(round, newNrOfPlaces, newNrOfPoules);

        const horizontalPouleService = new HorizontalPouleService(round);
        horizontalPouleService.recreate();

        [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
            let nrOfPlacesWinnersOrLosers = round.getNrOfPlacesChildren(winnersOrLosers);
            // als aantal plekken minder wordt, dan is nieuwe aantal plekken max. aantal plekken van de ronde
            if (nrOfPlacesWinnersOrLosers > newNrOfPlaces) {
                nrOfPlacesWinnersOrLosers = newNrOfPlaces;
            }
            this.updateQualifyGroups(round, winnersOrLosers, nrOfPlacesWinnersOrLosers);
        });

        const qualifyRuleService = new QualifyRuleService(round);
        qualifyRuleService.recreateTo();
    }

    protected updateQualifyGroups(round: Round, winnersOrLosers: number, newNrOfPlacesChildren: number) {
        const roundNrOfPlaces = round.getNrOfPlaces();
        if (newNrOfPlacesChildren > roundNrOfPlaces) {
            newNrOfPlacesChildren = roundNrOfPlaces;
        }
        // dit kan niet direct door de gebruiker maar wel een paar dieptes verder op
        if (roundNrOfPlaces < 4 && newNrOfPlacesChildren >= 2) {
            newNrOfPlacesChildren = 0;
        }
        const getNewQualifyGroup = (removedQualifyGroups): HorizontolPoulesCreator => {
            let qualifyGroup = removedQualifyGroups.shift();
            let nrOfQualifiers;
            if (qualifyGroup === undefined) {
                qualifyGroup = new QualifyGroup(round, winnersOrLosers);
                const nextRoundNumber = round.getNumber().hasNext() ? round.getNumber().getNext() : this.createRoundNumber(round);
                const tmp = new Round(nextRoundNumber, qualifyGroup);
                nrOfQualifiers = newNrOfPlacesChildren;
            } else {
                round.getQualifyGroups(winnersOrLosers).push(qualifyGroup);
                // warning: cannot make use of qualifygroup.horizontalpoules yet!

                // add and remove qualifiers
                nrOfQualifiers = qualifyGroup.getChildRound().getNrOfPlaces();

                if (nrOfQualifiers < round.getPoules().length && newNrOfPlacesChildren > nrOfQualifiers) {
                    nrOfQualifiers = round.getPoules().length;
                }
                if (nrOfQualifiers > newNrOfPlacesChildren) {
                    nrOfQualifiers = newNrOfPlacesChildren;
                } else if (nrOfQualifiers < newNrOfPlacesChildren && removedQualifyGroups.length === 0) {
                    nrOfQualifiers = newNrOfPlacesChildren;
                }
                if (newNrOfPlacesChildren - nrOfQualifiers === 1) {
                    nrOfQualifiers = newNrOfPlacesChildren;
                }
            }
            return { qualifyGroup: qualifyGroup, nrOfQualifiers: nrOfQualifiers };
        };


        const horizontolPoulesCreators: HorizontolPoulesCreator[] = [];
        const qualifyGroups = round.getQualifyGroups(winnersOrLosers);
        const initRemovedQualifyGroups = qualifyGroups.splice(0, qualifyGroups.length);
        let qualifyGroupNumber = 1;
        while (newNrOfPlacesChildren > 0) {
            const horizontolPoulesCreator = getNewQualifyGroup(initRemovedQualifyGroups);
            horizontolPoulesCreator.qualifyGroup.setNumber(qualifyGroupNumber++);
            horizontolPoulesCreators.push(horizontolPoulesCreator);
            newNrOfPlacesChildren -= horizontolPoulesCreator.nrOfQualifiers;
        }
        this.updateQualifyGroupsHorizontalPoules(round.getHorizontalPoules(winnersOrLosers).slice(), horizontolPoulesCreators);

        horizontolPoulesCreators.forEach(creator => {
            const newNrOfPoules = this.calculateNewNrOfPoules(creator.qualifyGroup, creator.nrOfQualifiers);
            this.updateRound(creator.qualifyGroup.getChildRound(), creator.nrOfQualifiers, newNrOfPoules);
        });
        this.cleanupRemovedQualifyGroups(round, initRemovedQualifyGroups);
    }

    updateQualifyGroupsHorizontalPoules(roundHorizontalPoules: HorizontalPoule[], horizontolPoulesCreators: HorizontolPoulesCreator[]) {
        horizontolPoulesCreators.forEach(creator => {
            creator.qualifyGroup.getHorizontalPoules().splice(0);
            let qualifiersAdded = 0;
            while (qualifiersAdded < creator.nrOfQualifiers) {
                const roundHorizontalPoule = roundHorizontalPoules.shift();
                roundHorizontalPoule.setQualifyGroup(creator.qualifyGroup);
                qualifiersAdded += roundHorizontalPoule.getPlaces().length;
            }
        });
        roundHorizontalPoules.forEach(roundHorizontalPoule => roundHorizontalPoule.setQualifyGroup(undefined));
    }

    /**
     * if roundnumber has no rounds left, also remove round number
     *
     * @param round
     * @param removedQualifyGroups
     */
    protected cleanupRemovedQualifyGroups(round: Round, removedQualifyGroups: QualifyGroup[]) {
        const nextRoundNumber = round.getNumber().getNext();
        if (nextRoundNumber === undefined) {
            return;
        }
        removedQualifyGroups.forEach(removedQualifyGroup => {
            removedQualifyGroup.getHorizontalPoules().forEach(horizontalPoule => {
                horizontalPoule.setQualifyGroup(undefined);
            });
            const idx = nextRoundNumber.getRounds().indexOf(removedQualifyGroup.getChildRound());
            if (idx > -1) {
                nextRoundNumber.getRounds().splice(idx, 1);
            }

        });
        if (nextRoundNumber.getRounds().length === 0) {
            round.getNumber().removeNext();
        }
    }

    calculateNewNrOfPoules(parentQualifyGroup: QualifyGroup, newNrOfPlaces: number): number {

        const round = parentQualifyGroup.getChildRound();
        const oldNrOfPlaces = round ? round.getNrOfPlaces() : parentQualifyGroup.getNrOfPlaces();
        const oldNrOfPoules = round ? round.getPoules().length : this.getDefaultNrOfPoules(oldNrOfPlaces);

        if (oldNrOfPoules === 0) {
            return 1;
        }
        if (oldNrOfPlaces < newNrOfPlaces) { // add
            if ((oldNrOfPlaces % oldNrOfPoules) > 0 || (oldNrOfPlaces / oldNrOfPoules) === 2) {
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

    createRoundNumber(parentRound: Round): RoundNumber {
        return parentRound.getNumber().createNext();
    }

    private refillRound(round: Round, nrOfPlaces: number, nrOfPoules: number): Round {
        if (nrOfPlaces <= 0) {
            return;
        }

        if (((nrOfPlaces / nrOfPoules) < 2)) {
            throw new Error('De minimale aantal deelnemers per poule is 2.');
        }
        const poules = round.getPoules();
        poules.splice(0, poules.length);

        while (nrOfPlaces > 0) {
            const nrOfPlacesToAdd = this.getNrOfPlacesPerPoule(nrOfPlaces, nrOfPoules);
            const poule = new Poule(round);
            for (let i = 0; i < nrOfPlacesToAdd; i++) {
                const tmp = new Place(poule);
            }
            nrOfPlaces -= nrOfPlacesToAdd;
            nrOfPoules--;
        }
        return round;
    }

    protected getRoot(round: Round): Round {
        if (!round.isRoot()) {
            return this.getRoot(round.getParent());
        }
        return round;
    }

    getNrOfPlacesPerPoule(nrOfPlaces: number, nrOfPoules: number): number {
        const nrOfPlaceLeft = (nrOfPlaces % nrOfPoules);
        if (nrOfPlaceLeft === 0) {
            return nrOfPlaces / nrOfPoules;
        }
        return ((nrOfPlaces - nrOfPlaceLeft) / nrOfPoules) + 1;
    }

    getDefaultNrOfPoules(nrOfPlaces): number {
        const min = this.competitorRange ? this.competitorRange.min : 2;
        const max = this.competitorRange ? this.competitorRange.max : undefined;
        if (nrOfPlaces < min) {
            throw new Error('Het aantal deelnemers is kleiner dan ' + min);
        } else if (max && nrOfPlaces > max) {
            throw new Error('Het aantal deelnemers is groter dan ' + max);
        }
        switch (nrOfPlaces) {
            case 2:
            case 3:
            case 4:
            case 5:
            case 7: {
                return 1;
            }
            case 6:
            case 8:
            case 10:
            case 11: {
                return 2;
            }
            case 9:
            case 12:
            case 13:
            case 14:
            case 15: {
                return 3;
            }
            case 16:
            case 17:
            case 18:
            case 19: {
                return 4;
            }
            case 20:
            case 21:
            case 22:
            case 23:
            case 25: {
                return 5;
            }
            case 24:
            case 26:
            case 29:
            case 30:
            case 33:
            case 34:
            case 36: {
                return 6;
            }
            case 28:
            case 31:
            case 35:
            case 37:
            case 38:
            case 39: {
                return 7;
            }
            case 27: {
                return 9;
            }
        }
        return 8;
    }
}

interface HorizontolPoulesCreator {
    qualifyGroup: QualifyGroup;
    nrOfQualifiers: number;
}
