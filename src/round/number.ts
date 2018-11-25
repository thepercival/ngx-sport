import { Competition } from '../competition';
import { Round } from '../round';
import { RoundNumberConfig } from '../round/number/config';

/**
 * Created by coen on 27-2-17.
 */

export class RoundNumber {
    protected competition: Competition;
    protected number: number;
    protected previous: RoundNumber;
    protected next: RoundNumber;
    protected rounds: Round[] = [];
    protected config: RoundNumberConfig;

    constructor(competition: Competition, previous?: RoundNumber) {
        this.competition = competition;
        this.previous = previous;
        this.number = previous === undefined ? 1 : previous.getNumber() + 1;
        this.competition = competition;
    }

    hasNext(): boolean {
        return this.next !== undefined;
    }

    getNext(): RoundNumber {
        return this.next;
    }

    removeNext() {
        this.next = undefined;
    }

    getPrevious(): RoundNumber {
        return this.previous;
    }

    createNext(): RoundNumber {
        this.next = new RoundNumber(this.getCompetition(), this);
        return this.getNext();
    }

    getCompetition(): Competition {
        return this.competition;
    }

    getNumber(): number {
        return this.number;
    }

    getFirst() {
        if (this.getPrevious() !== undefined) {
            return this.getPrevious().getFirst();
        }
        return this;
    }

    isFirst() {
        return (this.getPrevious() === undefined);
    }

    getRounds() {
        return this.rounds;
    }

    getARound(): Round {
        return this.getRounds()[0];
    }

    getConfig(): RoundNumberConfig {
        return this.config;
    }

    setConfig(config: RoundNumberConfig) {
        this.config = config;
    }

    needsRanking(): boolean {
        return this.getRounds().some(round => round.needsRanking());
    }
}
