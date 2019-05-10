import { HorizontalPoule } from '../poule/horizontal';
import { PoulePlace } from '../pouleplace';
import { Round } from '../round';

export class QualifyGroup {
    static readonly NEUTRAL = 0;
    static readonly WINNERS = 1;
    static readonly DROPOUTS = 2;
    static readonly LOSERS = 3;

    protected round: Round;

    protected id: number;
    protected winnersOrLosers: number;
    protected number: number;
    protected nrOfHorizontalPoules: number;
    protected childRound: Round;

    constructor(round: Round) {
        this.setRound(round);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getRound(): Round {
        return this.round;
    }

    setRound(round: Round) {
        // if (this.round !== undefined && this.round !== round) {
        //     const index = this.fromRound.getToQualifyRules().indexOf(this);
        //     if (index > -1) {
        //         this.fromRound.getToQualifyRules().splice(index, 1);
        //     }
        // }
        // if (round !== undefined) {
        round.getQualifyGroups().push(this);
        // }
        this.round = round;
    }

    getWinnersOrLosers(): number {
        return this.winnersOrLosers;
    }

    setWinnersOrLosers(winnersOrLosers: number): void {
        this.winnersOrLosers = winnersOrLosers;
    }

    getNumber(): number {
        return this.number;
    }

    setNumber(number: number): void {
        this.number = number;
    }

    getNrOfHorizontalPoules(): number {
        return this.nrOfHorizontalPoules;
    }

    setNrOfHorizontalPoules(nrOfHorizontalPoules: number): void {
        this.nrOfHorizontalPoules = nrOfHorizontalPoules;
    }

    getChildRound(): Round {
        return this.childRound;
    }

    setChildRound(childRound: Round): void {
        // if (this.ChildRound !== undefined && this.ChildRound !== round) {
        //     const index = this.ChildRound.getFromQualifyRules().indexOf(this);
        //     if (index > -1) {
        //         this.ChildRound.getFromQualifyRules().splice(index, 1);
        //     }
        // }
        // if (round !== undefined) {
        //     round.getFromQualifyRules().push(this);
        // }
        this.childRound = childRound;
    }

    getHorizontalPoules(): HorizontalPoule[] {
        return [];
    }

    isBorderGroup(): boolean {
        const qualifyGroups = this.getRound().getQualifyGroups(this.getWinnersOrLosers());
        return this === qualifyGroups[qualifyGroups.length - 1];
    }

    isBorderPoule(poule: HorizontalPoule): boolean {
        if (!this.isBorderGroup()) {
            return false;
        }
        return this.getNrOfHorizontalPoules() === poule.getPlaceNumber();
    }

    isInBorderHoritontalPoule(place: PoulePlace): boolean {
        const horizontalPoules = this.getHorizontalPoules();
        const borderHorizontalPoule = horizontalPoules[horizontalPoules.length - 1];
        return borderHorizontalPoule.hasPlace(place);
    }

    getNrOfToPlacesShort(): number {
        const nrOfPlaces = this.getHorizontalPoules().length * this.getRound().getPoules().length;
        return nrOfPlaces - this.getChildRound().getNrOfPlaces();
    }

    // de horizontale poules moeten kunnen herberekend kunnen worden
    // net zoals welke place welke qualifiers heeft  

    // fromround get places by horiontalpoules
    // toround -> getplaces by horizontal
    // als laatste fromround.horiontalpoule meer plaatsen bevat als aantal toroundplaces dan is het incomplete

    // incomplete

    // 1 horizontale poule is gekoppeld aan een aantal plekken uit de volgende ronde!!!!!!!!

    // SNEL kunnen achter welke pouleplace aan welke qualificationgroups hangen

    // ik moet weten: 
    // a is in incomplete rule
    // b wat welke fromPlace hoort erbij


}

