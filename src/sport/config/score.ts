import { SportConfig } from '../config';

export class SportConfigScore {
    static readonly UPWARDS = 1;
    static readonly DOWNWARDS = 2;

    protected id: number;
    protected sportConfig: SportConfig;
    protected parent: SportConfigScore;
    protected direction: number;
    protected maximum: number;
    protected child: SportConfigScore;

    constructor(sportConfig: SportConfig, parent: SportConfigScore) {
        this.setSportConfig(sportConfig);
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

    getSportConfig(): SportConfig {
        return this.sportConfig;
    }

    private setSportConfig(sportConfig: SportConfig) {
        this.sportConfig = sportConfig;
    }

    hasParent(): boolean {
        return this.parent !== undefined;
    }

    getParent(): SportConfigScore {
        return this.parent;
    }

    private setParent(parent: SportConfigScore) {
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

    getChild(): SportConfigScore {
        return this.child;
    }

    setChild(child: SportConfigScore) {
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

