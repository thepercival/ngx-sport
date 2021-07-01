import { GamePhase } from './game/phase';
import { Identifiable } from './identifiable';

export class Score extends Identifiable {

    constructor(protected phase: GamePhase, protected number: number) {
        super();
    }

    getPhase(): GamePhase {
        return this.phase;
    }


    getNumber(): number {
        return this.number;
    }
}
