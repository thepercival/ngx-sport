import { Competition } from './competition';
import { Sport } from './sport';
import { SportConfig } from './sport/config';

export class Field {
    static readonly MIN_LENGTH_NAME = 1;
    static readonly MAX_LENGTH_NAME = 3;

    protected id: number = 0;
    protected name: string | undefined;

    constructor(protected sportConfig: SportConfig, protected priority: number) {
        this.sportConfig.getFields().push(this);
        this.setPriority(priority);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getSportConfig(): SportConfig {
        return this.sportConfig;
    }

    getPriority(): number {
        return this.priority;
    }

    setPriority(priority: number): void {
        this.priority = priority;
    }

    getName(): string | undefined {
        return this.name;
    }

    setName(name: string | undefined): void {
        this.name = name;
    }
}
