import { HorizontalPoule } from '../poule/horizontal';
import { QualifyGroup, Round } from './group';
import { QualifyTarget } from './target';

export abstract class QualifyRule {
    constructor(protected fromHorizontalPoule: HorizontalPoule) {
    }

    getQualifyTarget(): QualifyTarget {
        return this.fromHorizontalPoule.getQualifyTarget();
    }

    getFromHorizontalPoule(): HorizontalPoule {
        return this.fromHorizontalPoule;
    }

    getNumber(): number {
        return this.getFromHorizontalPoule().getNumber();
    }

    getFromRound(): Round {
        return this.fromHorizontalPoule.getRound();
    }

    getFromPlaceNumber(): number {
        return this.getFromHorizontalPoule().getPlaceNumber();
    }
}

