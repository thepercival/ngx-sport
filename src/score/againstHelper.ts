import { AgainstGame } from "../game/against";


export class AgainstScoreHelper {

    constructor(protected home: number, protected away: number) {
    }

    getHome(): number {
        return this.home;
    }

    getAway(): number {
        return this.away;
    }

    getResult(homeAway: boolean): number {
        if (this.getHome() === this.getAway()) {
            return AgainstGame.Result_Draw;
        }
        if (homeAway === AgainstGame.Home) {
            return (this.getHome() > this.getAway()) ? AgainstGame.Result_Win : AgainstGame.Result_Lost;
        }
        return (this.getAway() > this.getHome()) ? AgainstGame.Result_Win : AgainstGame.Result_Lost;
    }
}
