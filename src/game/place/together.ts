import { Place } from 'src/place';
import { TogetherScore } from 'src/score/together';
import { GamePlace } from '../place';
import { TogetherGame } from '../together';

export class TogetherGamePlace extends GamePlace {
    protected scores: TogetherScore[] = [];

    constructor(game: TogetherGame, place: Place, protected gameRoundNumber: number) {
        super(game, place);
        game.getPlaces().push(this);
    }

    getGameRoundNumber(): number {
        return this.gameRoundNumber;
    }

    getScores(): TogetherScore[] {
        return this.scores;
    }
}
