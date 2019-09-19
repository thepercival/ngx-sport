import { Game } from '../../game';

export class GameScoreHomeAway {

    protected home: number;
    protected away: number;

    constructor(home: number, away: number) {
        this.setHome(home);
        this.setAway(away);
    }

    getHome(): number {
        return this.home;
    }

    setHome(home: number): void {
        this.home = home;
    }

    getAway(): number {
        return this.away;
    }

    setAway(away: number): void {
        this.away = away;
    }

    getResult(): number {
        if (this.getHome() === this.getAway()) {
            return Game.RESULT_DRAW;
        }
        return (this.getHome() > this.getAway()) ? Game.RESULT_HOME : Game.RESULT_DRAW;
    }
}
