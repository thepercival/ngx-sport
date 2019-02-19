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
        game.setReferee(this.referee ? this.referee : undefined);
        game.setRefereePoulePlace(this.poulePlace ? this.poulePlace : undefined);
    }
}

