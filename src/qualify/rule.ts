import { HorizontalPoule } from "../poule/horizontal";
import { Round } from "./group";
import { QualifyTarget } from "./target";

export class QualifyRule {
    constructor(protected fromHorizontalPoule: HorizontalPoule) {
    }

    getQualifyTarget(): QualifyTarget {
        return this.fromHorizontalPoule.getQualifyTarget();
    }

    getFromHorizontalPoule(): HorizontalPoule {
        return this.fromHorizontalPoule;
    }

    getNumber(): number {
        return this.fromHorizontalPoule.getNumber();
    }

    getFromRound(): Round {
        return this.fromHorizontalPoule.getRound();
    }
}