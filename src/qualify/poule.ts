import { PoulePlace } from '../pouleplace';
import { Round } from '../round';

export class QualifyPoule {
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
            round.getQualifyPoules().push(this);
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
}

