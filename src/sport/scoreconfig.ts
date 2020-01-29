import { Sport } from '../sport';
import { RoundNumber } from '../round/number';

export class SportScoreConfig {
    static readonly UPWARDS = 1;
    static readonly DOWNWARDS = 2;

    protected id: number;
    protected previous: SportScoreConfig;
    protected direction: number;
    protected maximum: number;
    protected enabled: boolean;
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

    hasMaximum(): boolean {
        return this.maximum > 0;
    }

    getEnabled(): boolean {
        return this.enabled;
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
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

    getFirst() {
        if (this.hasPrevious()) {
            return this.getPrevious().getLast();
        }
        return this;
    }

    isFirst() {
        return !this.hasPrevious();
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

    getLast() {
        if (this.hasNext()) {
            return this.getNext().getLast();
        }
        return this;
    }

    isLast() {
        return !this.hasNext();
    }

    getCalculate(): SportScoreConfig {
        const first = this.getFirst();
        if (first.hasNext() && first.getNext().getEnabled()) {
            return first.getNext();
        }
        return this;
    }
}

