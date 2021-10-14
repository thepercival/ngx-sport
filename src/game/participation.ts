import { Identifiable } from '../identifiable';
import { AgainstGamePlace } from './place/against';
import { TogetherGamePlace } from './place/together';

export class GameParticipation extends Identifiable {


    constructor(protected gamePlace: TogetherGamePlace | AgainstGamePlace, protected gameRoundNumber: number) {
        super();
        gamePlace.getParticipations().push(this);
    }

    getGamePlace(): TogetherGamePlace | AgainstGamePlace {
        return this.gamePlace;
    }

    // getScores(): TogetherScore[] {
    //     return this.scores;
    // }
}