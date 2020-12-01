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

    getResult(homeAway: boolean): number {
        if (this.getHome() === this.getAway()) {
            return Game.Result_Draw;
        }
        if (homeAway === Game.Home) {
            return (this.getHome() > this.getAway()) ? Game.Result_Win : Game.Result_Lost;
        }
        return (this.getAway() > this.getHome()) ? Game.Result_Win : Game.Result_Lost;
    }
}
