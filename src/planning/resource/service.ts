import { Field } from '../../field';
import { Game } from '../../game';
import { PoulePlace } from '../../pouleplace';
import { Referee } from '../../referee';

export class PlanningResourceService {

    private usedResources: GameResources;

    constructor() {
        this.usedResources = {
            poulePlaces: [],
            fields: [],
            referees: []
        };
    }

    public inUse(game: Game) {
        const homePoulePlace = game.getHomePoulePlace();
        const awayPoulePlace = game.getAwayPoulePlace();
        const field = game.getField();
        const referee = game.getReferee();
        if (this.poulePlaceInUse(homePoulePlace)
            || this.poulePlaceInUse(awayPoulePlace)
            || (field !== undefined && this.fieldInUse(field))
            || (referee !== undefined && this.refereeInUse(referee))
        ) {
            return true;
        }
        return false;
    }

    protected poulePlaceInUse(poulePlace: PoulePlace) {
        return this.usedResources.poulePlaces.find(poulePlaceIt => poulePlaceIt === poulePlace) !== undefined;
    }

    protected fieldInUse(field: Field) {
        return this.usedResources.fields.find(fieldIt => fieldIt === field) !== undefined;
    }

    protected refereeInUse(referee: Referee) {
        return this.usedResources.referees.find(refereeIt => refereeIt === referee) !== undefined;
    }

    public add(game: Game) {
        this.usedResources.poulePlaces.push(game.getHomePoulePlace());
        this.usedResources.poulePlaces.push(game.getAwayPoulePlace());
        if (game.getField() !== undefined) {
            this.usedResources.fields.push(game.getField());
        }
        if (game.getReferee() !== undefined) {
            this.usedResources.referees.push(game.getReferee());
        }
    }
}

export interface GameResources {
    poulePlaces: PoulePlace[];
    fields: Field[];
    referees: Referee[];
}
