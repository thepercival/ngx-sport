import { Identifiable } from '../identifiable';
import { Place } from '../place';
import { AgainstGame } from './against';
import { TogetherGame } from './together';
import { GameParticipation } from './participation';

export abstract class GamePlace extends Identifiable {
    protected participations: GameParticipation[] = [];

    constructor(protected game: AgainstGame | TogetherGame, protected place: Place) {
        super();
    }

    getPlace(): Place {
        return this.place;
    }

    getGame(): AgainstGame | TogetherGame {
        return this.game;
    }

    getParticipations(): GameParticipation[] {
        return this.participations;
    }
}
