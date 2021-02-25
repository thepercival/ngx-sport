import { AgainstSide } from '../../against/side';
import { Place } from '../../place';
import { AgainstGame } from '../against';
import { GamePlace } from '../place';

export class AgainstGamePlace extends GamePlace {

    constructor(game: AgainstGame, place: Place, protected side: AgainstSide) {
        super(game, place);
        game.getPlaces().push(this);
    }

    getSide(): AgainstSide {
        return this.side;
    }
}
