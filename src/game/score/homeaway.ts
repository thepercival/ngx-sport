import { Game } from '../../game';

export class GameScoreHomeAway {

    constructor(protected home: number, protected away: number) {
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
        return (this.getHome() > this.getAway()) ? Game.RESULT_HOME : Game.RESULT_AWAY;
    }
}
