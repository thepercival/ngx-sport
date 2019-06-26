import { Sport } from '../sport';
import { RoundNumber } from '../round/number';

export class SportPlanningConfig {
    static readonly DEFAULTNROFHEADTOHEADMATCHES = 1;

    protected id: number;
    protected nrOfHeadtoheadMatches: number;

    constructor(protected sport: Sport, protected roundNumber: RoundNumber) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getNrOfHeadtoheadMatches(): number {
        return this.nrOfHeadtoheadMatches;
    }

    setNrOfHeadtoheadMatches(nrOfHeadtoheadMatches: number) {
        this.nrOfHeadtoheadMatches = nrOfHeadtoheadMatches;
    }

    getSport(): Sport {
        return this.sport;
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }
}
