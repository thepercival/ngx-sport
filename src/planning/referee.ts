import { Game } from '../game';
import { PoulePlace } from '../pouleplace';
import { Referee } from '../referee';

export class PlanningReferee {
    constructor(
        private referee: Referee,
        private poulePlace: PoulePlace) {

    }

    getReferee(): Referee {
        return this.referee;
    }

    getPoulePlace(): PoulePlace {
        return this.poulePlace;
    }

    isSelf(): boolean {
        return this.poulePlace !== undefined;
    }

    assign(game: Game) {
        if (this.referee !== undefined) {
            game.setReferee(this.referee);
        } else if (this.poulePlace !== undefined) {
            game.setPoulePlaceReferee(this.poulePlace);
        }
    }
}

