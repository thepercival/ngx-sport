import { Place } from '../../place';
import { AgainstGame } from '../against';
import { GamePlace } from '../place';

export class AgainstGamePlace extends GamePlace {

    constructor(game: AgainstGame, place: Place, protected homeAway: boolean) {
        super(game, place);
        game.getPlaces().push(this);
    }

    getHomeAway(): boolean {
        return this.homeAway;
    }
}
