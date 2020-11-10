import { Game } from '../game';
import { Place } from '../place';

export class GamePlace {

    protected id: number = 0;

    constructor(protected game: Game, protected place: Place, protected homeaway: boolean) {
        this.game.getPlaces().push(this);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getGame(): Game {
        return this.game;
    }

    getPlace(): Place {
        return this.place;
    }

    getHomeaway(): boolean {
        return this.homeaway;
    }
}
