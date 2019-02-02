import { Game } from '../game';
import { PoulePlace } from '../pouleplace';

export class GamePoulePlace {

    protected id: number;
    protected game: Game;
    protected poulePlace: PoulePlace;
    protected homeaway: boolean;

    constructor(game: Game, poulePlace: PoulePlace, homeaway: boolean) {
        this.setGame(game);
        this.setPoulePlace(poulePlace);
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
        game.getPoulePlaces().push(this);
        this.game = game;
    }

    getPoulePlace(): PoulePlace {
        return this.poulePlace;
    }

    private setPoulePlace(poulePlace: PoulePlace) {
        this.poulePlace = poulePlace;
    }

    getHomeaway(): boolean {
        return this.homeaway;
    }

    private setHomeaway(homeaway: boolean): void {
        this.homeaway = homeaway;
    }
}