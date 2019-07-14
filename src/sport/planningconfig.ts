import { Sport } from '../sport';
import { RoundNumber } from '../round/number';

export class SportPlanningConfig {
    static readonly DEFAULTNROFGAMES = 1;

    protected id: number;
    protected minNrOfGames: number;

    constructor(protected sport: Sport, protected roundNumber: RoundNumber) {
        roundNumber.getSportPlanningConfigs().push(this);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getMinNrOfGames(): number {
        return this.minNrOfGames;
    }

    setMinNrOfGames(minNrOfGames: number) {
        this.minNrOfGames = minNrOfGames;
    }

    getSport(): Sport {
        return this.sport;
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }

    getNrOfGamePlaces( teamup: boolean ): number {
        const nrOfGamePlaces = this.roundNumber.getSportConfig(this.getSport()).getNrOfGamePlaces();
        return teamup ? nrOfGamePlaces * 2 : nrOfGamePlaces;
    }
}
