
import { Sport } from '../sport';
import { FormationLine } from './formation/line';

export class Formation {
    protected lines: FormationLine[] = [];

    constructor(protected sport: Sport, protected name: string) {
    }

    public getSport(): Sport {
        return this.sport;
    }

    public getName(): string {
        return this.name;
    }

    public getLines(): FormationLine[] {
        return this.lines;
    }
}

export enum FormationLineDef {
    Goalkeeper = 1,
    Defense = 2,
    Midfield = 4,
    Forward = 8,
    All = 15
};