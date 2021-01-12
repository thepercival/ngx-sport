import { Game } from '../game';
import { CompetitionSport } from '../competition/sport';
import { Place } from '../place';
import { Poule } from '../poule';
import { State } from '../state';
import { TogetherGamePlace } from './place/together';

export class TogetherGame extends Game {

    constructor(poule: Poule, batchNr: number, competitionSport: CompetitionSport) {
        super(poule, batchNr, competitionSport);
        poule.getGames().push(this);
        this.state = State.Created;
    }

    getTogetherPlaces(): TogetherGamePlace[] {
        return <TogetherGamePlace[]>this.places;
    }

    isParticipating(place: Place): boolean {
        return this.places.find(gamePlace => gamePlace.getPlace() === place) !== undefined;
    }
}
