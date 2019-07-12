import { Game } from '../../game';
import { Place } from '../../place';
import { Poule } from '../../poule';

export class PlanningResourceBatch {

    private games: Game[] = [];
    private poules: Poule[] = [];
    private places: Place[] = [];

    constructor() {
    }

    add(game: Game) {
        this.games.push(game);
        if (this.poules.find(pouleIt => game.getPoule() === pouleIt) === undefined) {
            this.poules.push(game.getPoule());
        }
        this.getPlaces(game).forEach(place => {
            if (this.places.find(placeIt => place === placeIt) === undefined) {
                this.places.push(place);
            }
        });
        if (game.getRefereePlace()) {
            this.places.push(game.getRefereePlace());
        }
    }

    remove(game: Game) {
        this.games.splice(this.games.indexOf(game), 1);

        if (!this.games.some(gameIt => gameIt.getPoule() === game.getPoule())) {
            this.poules.splice(this.poules.indexOf(game.getPoule()), 1);
        }

        this.getPlaces(game).forEach(placeIt => {
            this.places.splice(this.places.indexOf(placeIt), 1);
        });
        if (game.getRefereePlace()) {
            this.places.splice(this.places.indexOf(game.getRefereePlace()), 1);
        }
    }

    protected getPlaces(game: Game): Place[] {
        return game.getPlaces().map(gamePlace => gamePlace.getPlace());
    }

    getGames(): Game[] {
        return this.games;
    }

    getNrOfPlaces(): number {
        return this.places.length;
    }

    getNrOfPoules(): number {
        return this.poules.length;
    }

    hasSomePlace(places: Place[]): boolean {
        return places.some(place => this.hasPlace(place));
    }

    hasPlace(place: Place): boolean {
        return this.places.some(placeIt => placeIt === place);
    }

    getLastAssignedRefereePlace(): Place {
        if (this.games.length === 0) {
            return undefined;
        }
        return this.games[this.games.length - 1].getRefereePlace();
    }

    isParticipating(place: Place): boolean {
        return this.getGames().some(game => game.isParticipating(place));
    }
}

