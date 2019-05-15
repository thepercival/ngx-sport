import { Poule } from '../../poule';
import { PoulePlace } from '../../pouleplace';
import { Round } from '../../round';
import { QualifyRule } from '../rule';

export class QualifyRuleSingle extends QualifyRule {
    private toPlace: PoulePlace;

    constructor(private fromPlace: PoulePlace, toRound: Round) {
        super(toRound);
    }

    getFromRound(): Round {
        return this.fromPlace.getRound();
    }

    isMultiple(): boolean {
        return false;
    }

    isSingle(): boolean {
        return true;
    }

    getFromPlace(): PoulePlace {
        return this.fromPlace;
    }

    getFromPoule(): Poule {
        return this.fromPlace.getPoule();
    }

    getToPlace(): PoulePlace {
        return this.toPlace;
    }

    setToPlace(toPlace: PoulePlace) {
        this.toPlace = toPlace;
        if (toPlace !== undefined) {
            toPlace.setFromQualifyRule(this);
        }
    }
}

