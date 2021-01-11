import { Game } from 'src/game';
import { CompetitionSport } from 'src/competition/sport';
import { Place } from 'src/place';
import { Poule } from 'src/poule';
import { State } from 'src/state';
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
