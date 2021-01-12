import { TogetherGamePlace } from '../game/place/together';
import { Score } from '../score';

export class TogetherScore extends Score {
    constructor(protected gamePlace: TogetherGamePlace, protected score: number, phase: number, number?: number) {
        super(phase, number ? number : gamePlace.getScores().length + 1);
        this.gamePlace.getScores().push(this);
    }

    getGamePlace(): TogetherGamePlace {
        return this.gamePlace;
    }

    getScore(): number {
        return this.score;
    }
}
