import { Sport } from '../sport';
import { RoundNumber } from '../round/number';

export class SportScoreConfig {
    static readonly UPWARDS = 1;
    static readonly DOWNWARDS = 2;

    protected id: number;
    protected parent: SportScoreConfig;
    protected direction: number;
    protected maximum: number;
    protected child: SportScoreConfig;

    constructor(protected sport: Sport, protected roundNumber: RoundNumber, parent: SportScoreConfig) {
        this.setParent(parent);
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

    hasParent(): boolean {
        return this.parent !== undefined;
    }

    getParent(): SportScoreConfig {
        return this.parent;
    }

    private setParent(parent: SportScoreConfig) {
        this.parent = parent;
        if (this.parent !== undefined) {
            this.parent.setChild(this);
        }
    }

    getRoot() {
        const parent = this.getParent();
        if (parent !== undefined) {
            return parent.getRoot();
        }
        return this;
    }

    getChild(): SportScoreConfig {
        return this.child;
    }

    setChild(child: SportScoreConfig) {
        this.child = child;
    }

    isInput() {
        if (this.getParent() === undefined || this.getParent().getMaximum() === 0) {
            if (this.getMaximum() !== 0 || this.getChild() === undefined) {
                return true;
            }
        }
        return false;
    }
}

