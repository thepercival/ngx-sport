import { CountConfig } from '../count';

export class ConfigScore {
    static readonly UPWARDS = 1;
    static readonly DOWNWARDS = 2;

    protected id: number;
    protected countConfig: CountConfig;
    protected parent: ConfigScore;
    protected name: string;
    protected direction: number;
    protected maximum: number;
    protected child: ConfigScore;

    constructor(countConfig: CountConfig, parent: ConfigScore) {
        this.setCountConfig(countConfig);
        this.setParent(parent);
    }

    static getDirectionDescription(direction: number) {
        return direction === ConfigScore.UPWARDS ? 'naar' : 'vanaf';
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
        if (this.getName().endsWith('en')) {
            return this.getName().substring(0, this.getName().length - 2);
        }
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

    getCountConfig(): CountConfig {
        return this.countConfig;
    }

    private setCountConfig(countConfig: CountConfig) {
        this.countConfig = countConfig;
    }

    getParent(): ConfigScore {
        return this.parent;
    }

    private setParent(parent: ConfigScore) {
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

    getChild(): ConfigScore {
        return this.child;
    }

    setChild(child: ConfigScore) {
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

