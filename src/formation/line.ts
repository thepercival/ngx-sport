import { Formation } from "../formation";
import { FootballLine } from "../sport/football";

export class FormationLine {
    constructor(
        protected formation: Formation,
        protected number: FootballLine,
        protected nrOfPersons: number
    ) {
        this.formation.getLines().push(this);
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
}