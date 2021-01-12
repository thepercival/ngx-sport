import { Identifiable } from '../identifiable';
import { Place } from '../place';
import { AgainstGame } from './against';
import { AgainstGamePlace } from './place/against';
import { TogetherGamePlace } from './place/together';
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

    getGames(): (AgainstGame | TogetherGame)[] {
        return this.getGame().getPoule().getGames().filter((gameIt: TogetherGame | AgainstGame) => {
            return gameIt.getPlaces().find((gamePlace: (AgainstGamePlace | TogetherGamePlace)) => gamePlace.getPlace() === this.place) !== undefined;
        });
    }
}
