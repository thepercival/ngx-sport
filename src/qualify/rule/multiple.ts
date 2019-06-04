import { HorizontalPoule } from '../../poule/horizontal';
import { Place } from '../../place';
import { Round } from '../../round';
import { QualifyRule } from '../rule';

export class QualifyRuleMultiple extends QualifyRule {
    private toPlaces: Place[] = [];
    private fromHorizontalPoule: HorizontalPoule;
    private nrOfToPlaces: number;

    constructor(fromHorizontalPoule: HorizontalPoule, nrOfToPlaces: number) {
        super();
        this.fromHorizontalPoule = fromHorizontalPoule;
        this.fromHorizontalPoule.setQualifyRuleMultiple(this);
        this.nrOfToPlaces = nrOfToPlaces;
    }

    getFromHorizontalPoule(): HorizontalPoule {
        return this.fromHorizontalPoule;
    }

    getFromRound(): Round {
        return this.fromHorizontalPoule.getRound();
    }

    isMultiple(): boolean {
        return true;
    }

    isSingle(): boolean {
        return false;
    }

    getWinnersOrLosers(): number {
        return this.fromHorizontalPoule.getQualifyGroup().getWinnersOrLosers();
    }

    addToPlace(toPlace: Place) {
        this.toPlaces.push(toPlace);
        toPlace.setFromQualifyRule(this);
    }

    toPlacesComplete(): boolean {
        return this.nrOfToPlaces === this.toPlaces.length;
    }

    getToPlaces(): Place[] {
        return this.toPlaces;
    }

    getFromPlaceNumber(): number {
        return this.getFromHorizontalPoule().getPlaceNumber();
    }
}

