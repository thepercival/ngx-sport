import { HorizontalPoule } from '../poule/horizontal';
import { Round } from '../round';

export class QualifyGroup {
    static readonly WINNERS = 1;
    static readonly DROPOUTS = 2;
    static readonly LOSERS = 3;

    protected round: Round;

    protected id: number;
    protected winnersOrLosers: number;
    protected number: number;
    protected childRound: Round;
    protected horizontalPoules: HorizontalPoule[] = [];

    constructor(round: Round, winnersOrLosers: number, number?: number) {
        this.setWinnersOrLosers(winnersOrLosers);
        if (number === undefined) {
            this.setRound(round);
        } else {
            this.insertRoundAt(round, number);
        }

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

    protected insertRoundAt(round: Round, insertAt: number) {

        // if (this.round !== undefined && this.round !== round) {
        //     const index = this.fromRound.getToQualifyRules().indexOf(this);
        //     if (index > -1) {
        //         this.fromRound.getToQualifyRules().splice(index, 1);
        //     }
        // }
        // if (round !== undefined) {
        round.getQualifyGroups(this.getWinnersOrLosers()).splice(insertAt, 0, this);
        // }
        this.round = round;
    }

    setRound(round: Round) {
        round.getQualifyGroups(this.getWinnersOrLosers()).push(this);
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
        return this.horizontalPoules;
    }

    isBorderGroup(): boolean {
        const qualifyGroups = this.getRound().getQualifyGroups(this.getWinnersOrLosers());
        return this === qualifyGroups[qualifyGroups.length - 1];
    }

    // isInBorderHoritontalPoule(place: Place): boolean {
    //     const horizontalPoules = this.getHorizontalPoules();
    //     const borderHorizontalPoule = horizontalPoules[horizontalPoules.length - 1];
    //     return borderHorizontalPoule.hasPlace(place);
    // }

    getBorderPoule(): HorizontalPoule {
        return this.horizontalPoules[this.horizontalPoules.length - 1];
    }

    getNrOfPlaces() {
        return this.getHorizontalPoules().length * this.getRound().getPoules().length;
    }

    getNrOfToPlacesTooMuch(): number {
        return this.getNrOfPlaces() - this.getChildRound().getNrOfPlaces();
    }

    getNrOfQualifiers(): number {
        let nrOfQualifiers = 0;
        this.getHorizontalPoules().forEach(horizontalPoule => nrOfQualifiers += horizontalPoule.getNrOfQualifiers());
        return nrOfQualifiers;
    }
}

