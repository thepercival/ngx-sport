/**
 * Created by coen on 15-10-17.
 */
import { PoulePlace } from './pouleplace';
import { Round } from './round';


export class QualifyRule {
    static readonly SOCCERWORLDCUP = 1;
    static readonly SOCCEREUROPEANCUP = 2;

    protected id: number;
    protected fromRound: Round;
    protected toRound: Round;
    protected configNr: number;
    protected fromPoulePlaces: PoulePlace[] = [];
    protected toPoulePlaces: PoulePlace[] = [];

    // constructor
    constructor(fromRound: Round, toRound: Round) {
        this.setFromRound(fromRound);
        this.setToRound(toRound);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getFromRound(): Round {
        return this.fromRound;
    }

    setFromRound(round: Round): void {
        if (this.fromRound !== undefined && this.fromRound !== round) {
            const index = this.fromRound.getToQualifyRules().indexOf(this);
            if (index > -1) {
                this.fromRound.getToQualifyRules().splice(index, 1);
            }
        }
        if (round !== undefined) {
            round.getToQualifyRules().push(this);
        }
        this.fromRound = round;
    }

    getToRound(): Round {
        return this.toRound;
    }

    setToRound(round: Round): void {
        if (this.toRound !== undefined && this.toRound !== round) {
            const index = this.toRound.getFromQualifyRules().indexOf(this);
            if (index > -1) {
                this.toRound.getFromQualifyRules().splice(index, 1);
            }
        }
        if (round !== undefined) {
            round.getFromQualifyRules().push(this);
        }
        this.toRound = round;
    }

    getFromPoulePlaces(): PoulePlace[] {
        return this.fromPoulePlaces;
    }

    addFromPoulePlace(poulePlace: PoulePlace): void {
        if (poulePlace === undefined) { return; }
        poulePlace.setToQualifyRule(this.getWinnersOrLosers(), this);
        this.fromPoulePlaces.push(poulePlace);
    }

    removeFromPoulePlace(poulePlace?: PoulePlace): void {
        const fromPoulePlaces = this.getFromPoulePlaces();
        if (poulePlace === undefined) {
            poulePlace = fromPoulePlaces[fromPoulePlaces.length - 1];
        }
        const index = fromPoulePlaces.indexOf(poulePlace);
        if (index > -1) {
            this.getFromPoulePlaces().splice(index, 1);
            poulePlace.setToQualifyRule(this.getWinnersOrLosers(), undefined);
        }
    }

    getToPoulePlaces(): PoulePlace[] {
        return this.toPoulePlaces;
    }

    addToPoulePlace(poulePlace: PoulePlace): void {
        if (poulePlace === undefined) { return; }
        poulePlace.setFromQualifyRule(this);
        this.toPoulePlaces.push(poulePlace);
    }

    removeToPoulePlace(poulePlace?: PoulePlace): void {
        const toPoulePlaces = this.getToPoulePlaces();
        if (poulePlace === undefined) {
            poulePlace = toPoulePlaces[toPoulePlaces.length - 1];
        }
        const index = this.getToPoulePlaces().indexOf(poulePlace);
        if (index > -1) {
            this.getToPoulePlaces().splice(index, 1);
            poulePlace.setFromQualifyRule(undefined);
        }
    }

    isMultiple(): boolean {
        return this.fromPoulePlaces.length > this.toPoulePlaces.length;
    }

    getWinnersOrLosers(): number {
        return this.getToRound().getWinnersOrLosers();
    }
}

