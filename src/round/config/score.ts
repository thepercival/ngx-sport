import { RoundConfig } from '../config';

export class RoundConfigScore {
    static readonly UPWARDS = 1;
    static readonly DOWNWARDS = 2;

    protected id: number;
    protected config: RoundConfig;
    protected parent: RoundConfigScore;
    protected name: string;
    protected direction: number;
    protected maximum: number;
    protected child: RoundConfigScore;

    // constructor
    constructor(config: RoundConfig, parent: RoundConfigScore) {
        this.setConfig(config);
        this.setParent(parent);
    }

    static getDirectionDescription(direction: number) {
        return direction === RoundConfigScore.UPWARDS ? 'naar' : 'vanaf';
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

    getNameSingle(): string {
        return this.getName().substring(0, this.getName().length - 1);
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

    getConfig(): RoundConfig {
        return this.config;
    }

    private setConfig(config: RoundConfig) {
        this.config = config;
    }

    getParent(): RoundConfigScore {
        return this.parent;
    }

    private setParent(parent: RoundConfigScore) {
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

    getChild(): RoundConfigScore {
        return this.child;
    }

    setChild(child: RoundConfigScore) {
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

