import { Place } from '../../place';
import { AgainstGame, HomeOrAway } from '../against';
import { GamePlace } from '../place';

export class AgainstGamePlace extends GamePlace {

    constructor(game: AgainstGame, place: Place, protected homeAway: HomeOrAway) {
        super(game, place);
        game.getPlaces().push(this);
    }

    getHomeAway(): HomeOrAway {
        return this.homeAway;
    }
}
