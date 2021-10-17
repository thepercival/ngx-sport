import { FormationLine } from "./formation/line";

export class Formation {
    protected lines: FormationLine[] = [];
    constructor(
    ) {
    }

    getLines(): FormationLine[] {
        return this.lines;
    }

    getName(): string {
        return this.getLines().map((line: FormationLine) => line.getNrOfPersons()).join('-');
    }
}