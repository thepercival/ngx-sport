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

    create(competition: Competition, nrOfPlaces: number): Structure {
        const firstRoundNumber = new RoundNumber(competition);
        this.configService.createDefault(firstRoundNumber);
        const rootRound = new Round(firstRoundNumber, undefined);
        this.refillRound(rootRound, nrOfPlaces);
        return new Structure(firstRoundNumber, rootRound);
    }

    removePlaceFromRootRound(round: Round) {
        // console.log('removePoulePlace for round ' + round.getNumberAsValue());
        const nrOfPlaces = round.getNrOfPlaces();
        if (nrOfPlaces === round.getNrOfPlacesChildren()) {
            throw new Error('de deelnemer kan niet verwijderd worden, omdat alle deelnemer naar de volgende ronde gaan');
        }
        const newNrOfPlaces = nrOfPlaces - 1;
        if (newNrOfPlaces < this.competitorRange.min) {
            throw new Error('er moeten minimaal ' + this.competitorRange.min + ' deelnemers zijn');
        }
        if ((newNrOfPlaces / round.getPoules().length) < 2) {
            throw new Error('Er kan geen deelnemer verwijderd worden. De minimale aantal deelnemers per poule is 2.');
        }

        this.updateRound(round, newNrOfPlaces, round.getPoules().length);

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setPouleStructureNumbers();
    }

    addPlaceToRootRound(round: Round): PoulePlace {
        const newNrOfPlaces = round.getNrOfPlaces() + 1;
        if (newNrOfPlaces > this.competitorRange.max) {
            throw new Error('er mogen maximaal ' + this.competitorRange.max + ' deelnemers meedoen');
        }

        this.updateRound(round, newNrOfPlaces, round.getPoules().length);

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setPouleStructureNumbers();

        return round.getFirstHorizontalPoule(QualifyGroup.LOSERS).getFirstPlace();
    }

    removePouleFromRootRound(round: Round) {
        const poules = round.getPoules();
        if (poules.length <= 1) {
            throw new Error('er moet minimaal 1 poule overblijven');
        }
        const lastPoule = poules[poules.length - 1];
        const newNrOfPlaces = round.getNrOfPlaces() - lastPoule.getPlaces().length;
        this.updateRound(round, newNrOfPlaces, poules.length - 1);

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setPouleStructureNumbers();
    }


    addPouleToRootRound(round: Round): Poule {
        const poules = round.getPoules();
        const lastPoule = poules[poules.length - 1];
        const newNrOfPlaces = round.getNrOfPlaces() + lastPoule.getPlaces().length;
        if (newNrOfPlaces > this.competitorRange.max) {
            throw new Error('er mogen maximaal ' + this.competitorRange.max + ' deelnemers meedoen');
        }

        this.updateRound(round, newNrOfPlaces, poules.length + 1);

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setPouleStructureNumbers();

        const newPoules = round.getPoules();
        return newPoules[newPoules.length - 1];
    }

    removeQualifier(round: Round, winnersOrLosers: number) {

        const nrOfPlaces = round.getNrOfPlacesChildren(winnersOrLosers);
        const newNrOfPlaces = nrOfPlaces - (nrOfPlaces === 2 ? 2 : 1);
        this.updateQualifyGroups(round, winnersOrLosers, newNrOfPlaces);

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);

        const qualifyRuleService = new QualifyRuleService(round);
        // qualifyRuleService.recreateFrom();
        qualifyRuleService.recreateTo();

        structure.setPouleStructureNumbers();
    }

    addQualifier(round: Round, winnersOrLosers: number) {

        const nrOfPlaces = round.getNrOfPlacesChildren(winnersOrLosers);
        const newNrOfPlaces = nrOfPlaces + (nrOfPlaces === 0 ? 2 : 1);
        this.updateQualifyGroups(round, winnersOrLosers, newNrOfPlaces);

        const qualifyRuleService = new QualifyRuleService(round);
        qualifyRuleService.recreateTo();

        const rootRound = this.getRoot(round);
        const structure = new Structure(rootRound.getNumber(), rootRound);
        structure.setPouleStructureNumbers();
    }

    protected updateRound(round: Round, nrOfPlaces: number, nrOfPoules: number) {
        if (round.getNrOfPlaces() === nrOfPlaces && nrOfPoules === round.getPoules().length) {
            return;
        }
        this.refillRound(round, nrOfPlaces, nrOfPoules);

        const horizontalPouleService = new HorizontalPouleService(round);
        horizontalPouleService.recreate();

        [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
            this.updateQualifyGroups(round, winnersOrLosers, round.getNrOfPlacesChildren(winnersOrLosers));
        });

        const qualifyRuleService = new QualifyRuleService(round);
        qualifyRuleService.recreateTo();
    }

    protected updateQualifyGroups(round: Round, winnersOrLosers: number, nrOfPlaces: number) {
        if (nrOfPlaces > round.getNrOfPlaces()) {
            nrOfPlaces = round.getNrOfPlaces();
        }
        if (nrOfPlaces === 0 ) {
            return this.removeChildRound(round, winnersOrLosers);
        }
        const nrOfPoules = round.getPoules().length;
        const roundHorizontalPoules = round.getHorizontalPoules(winnersOrLosers).slice();

        const getNewQualifyGroup = (removedQualifyGroups): [any, any] => {
            let qualifyGroup = removedQualifyGroups.shift();
            let nrOfQualifiers;
            if (qualifyGroup === undefined) {
                qualifyGroup = new QualifyGroup(round, winnersOrLosers);
                if (!round.getNumber().hasNext()) {
                    this.configService.createFromPrevious(round.getNumber().createNext());
                }
                qualifyGroup.setChildRound(new Round(round.getNumber().getNext(), qualifyGroup));
                nrOfQualifiers = nrOfPlaces;
            } else {
                round.getQualifyGroups(winnersOrLosers).push(qualifyGroup);
                nrOfQualifiers = nrOfPoules * qualifyGroup.getHorizontalPoules().length;
                // qualifyGroupNrOfPlaces = qualifyGroup.getChildRound().getNrOfPlaces();
                if (nrOfQualifiers > nrOfPlaces) {
                    nrOfQualifiers = nrOfPlaces;
                } else if (nrOfQualifiers < nrOfPlaces && removedQualifyGroups[0] === undefined) {
                    nrOfQualifiers = nrOfPlaces;
                }
            }
            return [qualifyGroup, nrOfQualifiers];
        };

        const updateQualifyGroup = (qualifyGroup, qualifyGroupNrOfPlaces) => {
            const horizontalPoules = qualifyGroup.getHorizontalPoules();
            horizontalPoules.splice(0, horizontalPoules.length);
            let qualifyGroupNrOfPlacesAdded = 0;
            while (qualifyGroupNrOfPlacesAdded < qualifyGroupNrOfPlaces) {
                const roundHorizontalPoule = roundHorizontalPoules.shift();
                roundHorizontalPoule.setQualifyGroup(qualifyGroup);
                qualifyGroupNrOfPlacesAdded += roundHorizontalPoule.getPlaces().length;
            }
        };        

        const qualifyGroups = round.getQualifyGroups(winnersOrLosers);
        const removedQualifyGroups = qualifyGroups.splice(0, qualifyGroups.length);
        let qualifyGroupNumber = 1;
        while (nrOfPlaces > 0) {
            const newQualifyGroup = getNewQualifyGroup(removedQualifyGroups);
            const qualifyGroup = newQualifyGroup[0];
            const nrOfQualifiers = newQualifyGroup[1];
            qualifyGroup.setNumber(qualifyGroupNumber++);

            updateQualifyGroup(qualifyGroup, nrOfQualifiers);
            nrOfPlaces -= nrOfQualifiers;
            const newNrOfPoules = this.calculateNewNrOfPoules(
                qualifyGroup.getChildRound().getPoules().length,
                qualifyGroup.getChildRound().getNrOfPlaces(),
                nrOfQualifiers);
            this.updateRound(qualifyGroup.getChildRound(), nrOfQualifiers, newNrOfPoules);
        }
    }

    protected calculateNewNrOfPoules(oldNrOfPoules: number, oldNrOfPlaces: number, nrOfPlaces: number): number {
        if (oldNrOfPoules === 0) {
            return 1;
        }
        if (oldNrOfPlaces < nrOfPlaces) { // add
            if ((oldNrOfPlaces % oldNrOfPoules) > 0 || (oldNrOfPlaces / oldNrOfPoules) === 2) {
                return oldNrOfPoules;
            }
            return oldNrOfPoules + 1;
        }
        // remove
        if ((oldNrOfPlaces % oldNrOfPoules) > 0) {
            return oldNrOfPoules;
        }
        return oldNrOfPoules - 1;
    }

    //    @TODO mergeQualifyGroups(qualifyGroupA, qualifyGroupB) vanaf round naar beneden opnieuw genereren
    //    @TODO splitQualifyGroup(qualifyGroup) vanaf round naar beneden opnieuw genereren


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
        return round;
    }

    /**
     * if roundnumber has no rounds left, also remove round number
     * 
     * @param parentRound 
     * @param winnersOrLosers 
     */
    protected removeChildRound(parentRound: Round, winnersOrLosers: number) {
        console.error('removeChildRound');
        
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

    protected getRoot(round: Round) {
        if (!round.isRoot()) {
            return this.getRoot(round.getParent());
        }
        return round;
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