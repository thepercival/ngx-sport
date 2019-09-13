import { Sport } from '../sport';
import { RoundNumber } from '../round/number';

export class SportScoreConfig {
    static readonly UPWARDS = 1;
    static readonly DOWNWARDS = 2;

    protected id: number;
    protected previous: SportScoreConfig;
    protected direction: number;
    protected maximum: number;
    protected next: SportScoreConfig;

    constructor(protected sport: Sport, protected roundNumber: RoundNumber, previous: SportScoreConfig) {
        if (previous === undefined) {
            roundNumber.getSportScoreConfigs().push(this);
        } else {
            this.setPrevious(previous);
        }
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getDirection(): number {
        return this.direction;
    }

    setDirection(direction: number) {
        this.direction = direction;
    }

    getMaximum(): number {
        return this.maximum;
    }

    setMaximum(maximum: number) {
        this.maximum = maximum;
    }

    getSport(): Sport {
        return this.sport;
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }

    hasPrevious(): boolean {
        return this.previous !== undefined;
    }

    getPrevious(): SportScoreConfig {
        return this.previous;
    }

    private setPrevious(previous: SportScoreConfig) {
        this.previous = previous;
        if (this.previous !== undefined) {
            this.previous.setNext(this);
        }
    }

    getRoot() {
        const previous = this.getPrevious();
        if (previous !== undefined) {
            return previous.getRoot();
        }
        return this;
    }

    getNext(): SportScoreConfig {
        return this.next;
    }

    setNext(next: SportScoreConfig) {
        this.next = next;
    }

    hasNext(): boolean {
        return this.next !== undefined;
    }

    isInput() {
        if (this.getPrevious() === undefined || this.getPrevious().getMaximum() === 0) {
            if (this.getMaximum() !== 0 || this.getNext() === undefined) {
                return true;
            }
        }
        return false;
    }
}

