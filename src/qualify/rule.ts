import { Round } from '../round';

export abstract class QualifyRule {
    constructor() { }

    abstract getFromRound(): Round;
    abstract isMultiple(): boolean;
    abstract isSingle(): boolean;
    abstract getWinnersOrLosers(): number;

    abstract getFromPlaceNumber(): number;    
}

