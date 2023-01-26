import { FormationLine } from "./formation/line";

export class Formation {
    constructor(protected readonly lines: FormationLine[]) {
    }

    getLines(): FormationLine[] {
        return this.lines.slice();
    }

    getName(): string {
        return this.getLines().map((line: FormationLine) => line.getNrOfPersons()).join('-');
    }

    equals(formation: Formation): boolean {
        return formation.getLines().every((formationLine: FormationLine): boolean => {
            const thisLine = this.lines.find(line => line.getNumber() === formationLine.getNumber());
            return thisLine !== undefined && formationLine.equals(thisLine);
        }) && formation.getLines().length === this.getLines().length;
    } 
}