import { Sport } from '../sport';
import { RoundNumber } from '../round/number';

export class SportScoreConfig {
    static readonly UPWARDS = 1;
    static readonly DOWNWARDS = 2;

    protected id: number = 0;
    protected previous: SportScoreConfig | undefined;
    protected direction: number = SportScoreConfig.UPWARDS;
    protected maximum: number = 0;
    protected enabled: boolean = true;
    protected next: SportScoreConfig | undefined;

    constructor(protected sport: Sport, protected roundNumber: RoundNumber, previous?: SportScoreConfig) {
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

    // moet direction opgenomen worden in constructor
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

    setSport(sport: Sport) {
        this.sport = sport;
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }

    hasPrevious(): boolean {
        return this.previous !== undefined;
    }

    getPrevious(): SportScoreConfig | undefined {
        return this.previous;
    }

    private setPrevious(previous: SportScoreConfig) {
        this.previous = previous;
        if (this.previous !== undefined) {
            this.previous.setNext(this);
        }
    }

    getFirst(): SportScoreConfig {
        const previous = this.getPrevious();
        return previous ? previous.getLast() : this;
    }

    isFirst(): boolean {
        return !this.hasPrevious();
    }

    getNext(): SportScoreConfig | undefined {
        return this.next;
    }

    setNext(next: SportScoreConfig) {
        this.next = next;
    }

    hasNext(): boolean {
        return this.next !== undefined;
    }

    getLast(): SportScoreConfig {
        const next = this.getNext();
        return next ? next.getLast() : this;
    }

    isLast(): boolean {
        return !this.hasNext();
    }

    getCalculate(): SportScoreConfig {
        const firstNext = this.getFirst().getNext();
        return firstNext?.getEnabled() ? firstNext : this;
    }

    useSubScore(): boolean {
        return (this !== this.getCalculate());
    }
}

