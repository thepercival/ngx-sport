import { Game } from './game';
import { Identifiable } from './identifiable';

export class Score extends Identifiable {

    constructor(protected phase: number, protected number: number) {
        super();
    }

    getPhase(): number {
        return this.phase;
    }


    getNumber(): number {
        return this.number;
    }
}
