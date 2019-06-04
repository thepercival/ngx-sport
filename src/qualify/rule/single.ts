import { Poule } from '../../poule';
import { Place } from '../../place';
import { QualifyGroup } from '../../qualify/group';
import { Round } from '../../round';
import { QualifyRule } from '../rule';

export class QualifyRuleSingle extends QualifyRule {
    private toPlace: Place;
    private winnersOrLosers: number;

    constructor(private fromPlace: Place, toQualifyGroup: QualifyGroup) {
        super();
        this.winnersOrLosers = toQualifyGroup.getWinnersOrLosers();
        this.fromPlace.setToQualifyRule(toQualifyGroup.getWinnersOrLosers(), this);
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

    getFromPlace(): Place {
        return this.fromPlace;
    }

    getFromPoule(): Poule {
        return this.fromPlace.getPoule();
    }

    getToPlace(): Place {
        return this.toPlace;
    }

    setToPlace(toPlace: Place) {
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

