import { AgainstResult } from "../against/result";
import { AgainstSide } from "../against/side";

export class AgainstScoreHelper {

    constructor(protected home: number, protected away: number) {
    }

    public getHome(): number {
        return this.home;
    }

    public getAway(): number {
        return this.away;
    }

    public get(side: AgainstSide): number {
        return side === AgainstSide.Home ? this.getHome() : this.getAway();
    }

    public getResult(side: AgainstSide): AgainstResult {
        if (this.getHome() === this.getAway()) {
            return AgainstResult.Draw;
        }
        if (side === AgainstSide.Home) {
            return (this.getHome() > this.getAway()) ? AgainstResult.Win : AgainstResult.Loss;
        }
        return (this.getAway() > this.getHome()) ? AgainstResult.Win : AgainstResult.Loss;
    }
}
