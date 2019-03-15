import { Game } from '../game';
import { GameScoreHomeAway } from './score/homeaway';

export class GameScore extends GameScoreHomeAway {
    static readonly SCORED = 1;
    static readonly RECEIVED = 2;
    protected id: number;
    protected game: Game;
    protected number: number;

    constructor(game: Game, home: number, away: number, number?: number) {
        super(home, away);
        this.setGame(game);
        if (!number) {
            number = game.getScores().length;
        }
        this.setNumber(number);
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
        game.getScores().push(this);
        this.game = game;
    }

    getNumber(): number {
        return this.number;
    }

    private setNumber(number: number): void {
        this.number = number;
    }
}
