import { Identifiable } from '../identifiable';
import { Place } from '../place';
import { AgainstGame } from './against';
import { TogetherGame } from './together';

export abstract class GamePlace extends Identifiable {
    constructor(protected game: AgainstGame | TogetherGame, protected place: Place) {
        super();
    }

    getPlace(): Place {
        return this.place;
    }

    getGame(): AgainstGame | TogetherGame {
        return this.game;
    }
}
