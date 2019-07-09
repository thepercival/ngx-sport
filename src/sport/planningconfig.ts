import { Sport } from '../sport';
import { RoundNumber } from '../round/number';

export class SportPlanningConfig {
    static readonly DEFAULTNROFGAMES = 1;

    protected id: number;
    protected nrOfGames: number;

    constructor(protected sport: Sport, protected roundNumber: RoundNumber) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getNrOfGames(): number {
        return this.nrOfGames;
    }

    setNrOfGames(nrOfGames: number) {
        this.nrOfGames = nrOfGames;
    }

    getSport(): Sport {
        return this.sport;
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }
}
