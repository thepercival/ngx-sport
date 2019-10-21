import { Game } from '../../game';
import { Place } from '../../place';
import { Poule } from '../../poule';

export class PlanningResourceBatch {
    private number: number;
    private next: PlanningResourceBatch;
    dateTime: Date;
    private games: Game[] = [];
    private poules: Poule[] = [];
    private places: Place[] = [];

    constructor(private previous?: PlanningResourceBatch) {
        this.number = previous === undefined ? 1 : previous.getNumber() + 1;
    }

    getNumber(): number {
        return this.number;
    }

    hasNext(): boolean {
        return this.next !== undefined;
    }

    getNext(): PlanningResourceBatch {
        return this.next;
    }

    createNext(): PlanningResourceBatch {
        this.next = new PlanningResourceBatch(this);
        return this.getNext();
    }

    removeNext() {
        this.next = undefined;
    }

    hasPrevious(): boolean {
        return this.previous !== undefined;
    }

    getPrevious(): PlanningResourceBatch {
        return this.previous;
    }

    getRoot(): PlanningResourceBatch {
        return this.hasPrevious() ? this.previous.getRoot() : this;
    }

    getLeaf(): PlanningResourceBatch {
        return this.hasNext() ? this.next.getLeaf() : this;
    }

    getDateTime(): Date {
        return this.dateTime;
    }

    setDateTime(dateTime: Date) {
        this.dateTime = dateTime;
    }

    getGamesInARow(place: Place): number {
        const hasPlace = this.hasPlace(place);
        if (!hasPlace) {
            return 0;
        }
        if (!this.hasPrevious()) {
            return 1;
        }
        return this.getPrevious().getGamesInARow(place) + 1;
    }

    add(game: Game) {
        this.games.push(game);
        if (this.poules.find(pouleIt => game.getPoule() === pouleIt) === undefined) {
            this.poules.push(game.getPoule());
        }
        this.getPlacesForGame(game).forEach(place => {
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

        this.getPlacesForGame(game).forEach(placeIt => {
            this.places.splice(this.places.indexOf(placeIt), 1);
        });
        if (game.getRefereePlace()) {
            this.places.splice(this.places.indexOf(game.getRefereePlace()), 1);
        }
    }

    getPlaces(): Place[] {
        return this.places;
    }

    protected getPlacesForGame(game: Game): Place[] {
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

