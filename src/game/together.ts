import { Game } from '../game';
import { CompetitionSport } from '../competition/sport';
import { Place } from '../place';
import { Poule } from '../poule';
import { TogetherGamePlace } from './place/together';
import { GameState } from './state';

export class TogetherGame extends Game {

    constructor(poule: Poule, batchNr: number, protected startDateTime: Date, competitionSport: CompetitionSport) {
        super(poule, batchNr, startDateTime, competitionSport);
        poule.getTogetherGames().push(this);
        this.state = GameState.Created;
    }

    getTogetherPlaces(): TogetherGamePlace[] {
        return <TogetherGamePlace[]>this.places;
    }

    isParticipating(place: Place): boolean {
        return this.places.find(gamePlace => gamePlace.getPlace() === place) !== undefined;
    }
}
