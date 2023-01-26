import { FootballLine } from "../sport/football";

export class FormationLine {
    constructor(
        protected readonly number: FootballLine,
        protected readonly nrOfPersons: number
    ) {        
    }

    getNumber(): FootballLine {
        return this.number;
    }

    getNrOfPersons(): number {
        return this.nrOfPersons;
    }

    getNumbers(): number[] {
        const numbers: number[] = [];
        for (let number = 1; number <= this.nrOfPersons; number++) {
            numbers.push(number);
        }
        return numbers;
    }

    equals(formationLine: FormationLine): boolean {
        return this.getNumber() === formationLine.getNumber() && this.getNrOfPersons() === this.getNrOfPersons();
    } 
}