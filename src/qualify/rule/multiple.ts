import { HorizontalPoule } from '../../poule/horizontal';
import { Place } from '../../place';
import { QualifyRule } from '../rule';
import { QualifyGroup, Round } from '../group';

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
        const qualifyGroup = this.fromHorizontalPoule.getQualifyGroup();
        return qualifyGroup ? qualifyGroup.getWinnersOrLosers() : QualifyGroup.DROPOUTS;
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

