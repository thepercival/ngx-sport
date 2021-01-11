import { Place } from 'src/place';
import { AgainstGame } from '../against';
import { GamePlace } from '../place';

export class AgainstGamePlace extends GamePlace {

    constructor(game: AgainstGame, place: Place, protected homeaway: boolean | undefined) {
        super(game, place);
        game.getPlaces().push(this);
    }

    getHomeaway(): boolean | undefined {
        return this.homeaway;
    }
}
