import { Poule } from '../../poule';
import { PoulePlace } from '../../pouleplace';
import { QualifyGroup } from '../../qualify/group';
import { Round } from '../../round';
import { QualifyRule } from '../rule';

export class QualifyRuleSingle extends QualifyRule {
    private toPlace: PoulePlace;
    private winnersOrLosers: number;

    constructor(private fromPlace: PoulePlace, toQualifyGroup: QualifyGroup) {
        super();
        this.winnersOrLosers = toQualifyGroup.getWinnersOrLosers();
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

    getWinnersOrLosers(): number {
        return this.winnersOrLosers;
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

    getFromPlaceNumber(): number {
        if (this.getWinnersOrLosers() === QualifyGroup.WINNERS) {
            return this.getFromPlace().getNumber();
        }
        return (this.getFromPlace().getPoule().getPlaces().length - this.getFromPlace().getNumber()) + 1;
    }
}

