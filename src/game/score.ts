import { Game } from '../game';
import { GameScoreHomeAway } from './score/homeaway';

export class GameScore extends GameScoreHomeAway {
    static readonly SCORED = 1;
    static readonly RECEIVED = 2;
    protected id: number;
    protected game: Game;
    protected phase: number;
    protected number: number;

    constructor(game: Game, home: number, away: number, phase: number, number?: number) {
        super(home, away);
        this.setGame(game);
        this.setPhase(phase);
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

    getPhase(): number {
        return this.phase;
    }

    private setPhase(phase: number): void {
        this.phase = phase;
    }

    getNumber(): number {
        return this.number;
    }

    private setNumber(number: number): void {
        this.number = number;
    }
}
