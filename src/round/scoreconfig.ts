import { Round } from '../round';

export class RoundScoreConfig {
    static readonly UPWARDS = 1;
    static readonly DOWNWARDS = 2;

    protected id: number;
    protected round: Round;
    protected parent: RoundScoreConfig;
    protected name: string;
    protected direction: number;
    protected maximum: number;
    protected child: RoundScoreConfig;

    // constructor
    constructor(round: Round, parent: RoundScoreConfig) {
        this.setRound(round);
        this.setParent(parent);
    }

    static getDirectionDescription(direction: number) {
        return direction === RoundScoreConfig.UPWARDS ? 'naar' : 'vanaf';
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
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

    getRound(): Round {
        return this.round;
    }

    private setRound(round: Round) {
        this.round = round;
    }

    getParent(): RoundScoreConfig {
        return this.parent;
    }

    private setParent(parent: RoundScoreConfig) {
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

    getChild(): RoundScoreConfig {
        return this.child;
    }

    setChild(child: RoundScoreConfig) {
        this.child = child;
    }
}

