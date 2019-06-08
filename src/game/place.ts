import { Game } from '../game';
import { Place } from '../place';

export class GamePlace {

    protected id: number;
    protected game: Game;
    protected place: Place;
    protected homeaway: boolean;

    constructor(game: Game, place: Place, homeaway: boolean) {
        this.setGame(game);
        this.setPlace(place);
        this.setHomeaway(homeaway);
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

    private setGame(game: Game) {
        game.getPlaces().push(this);
        this.game = game;
    }

    getPlace(): Place {
        return this.place;
    }

    private setPlace(place: Place) {
        this.place = place;
    }

    getHomeaway(): boolean {
        return this.homeaway;
    }

    private setHomeaway(homeaway: boolean): void {
        this.homeaway = homeaway;
    }
}
