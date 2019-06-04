import { Game } from '../game';
import { Place } from '../place';
import { Referee } from '../referee';

export class PlanningReferee {
    constructor(
        private referee: Referee,
        private place: Place) {

    }

    getReferee(): Referee {
        return this.referee;
    }

    getPlace(): Place {
        return this.place;
    }

    isSelf(): boolean {
        return this.place !== undefined;
    }

    assign(game: Game) {
        game.setReferee(this.referee ? this.referee : undefined);
        game.setRefereePlace(this.place ? this.place : undefined);
    }
}

