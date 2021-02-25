import { AgainstResult } from "../against/result";
import { AgainstSide } from "../against/side";

export class AgainstScoreHelper {

    constructor(protected home: number, protected away: number) {
    }

    getHome(): number {
        return this.home;
    }

    getAway(): number {
        return this.away;
    }

    getResult(side: AgainstSide): AgainstResult {
        if (this.getHome() === this.getAway()) {
            return AgainstResult.Draw;
        }
        if (side === AgainstSide.Home) {
            return (this.getHome() > this.getAway()) ? AgainstResult.Win : AgainstResult.Loss;
        }
        return (this.getAway() > this.getHome()) ? AgainstResult.Win : AgainstResult.Loss;
    }
}
