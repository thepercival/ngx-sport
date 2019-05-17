import { HorizontalPoule } from '../../poule/horizontal';
import { PoulePlace } from '../../pouleplace';
import { QualifyGroup } from '../../qualify/group';
import { Round } from '../../round';
import { QualifyRule } from '../rule';

export class QualifyRuleMultiple extends QualifyRule {
    private toPlaces: PoulePlace[] = [];
    private fromHorizontalPoule: HorizontalPoule;
    private nrOfToPlaces: number;

    constructor(fromHorizontalPoule: HorizontalPoule, nrOfToPlaces: number) {
        super();
        this.fromHorizontalPoule = fromHorizontalPoule;
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

    addToPlace(toPlace: PoulePlace) {
        this.toPlaces.push(toPlace);
        toPlace.setFromQualifyRule(this);
    }

    toPlacesComplete(): boolean {
        return this.nrOfToPlaces === this.toPlaces.length;
    }

    getToPlaces(): PoulePlace[] {
        return this.toPlaces;
    }

    getFromPlaceNumber(absolute?: boolean): number {
        if (absolute || this.getWinnersOrLosers() === QualifyGroup.WINNERS) {
            return this.getFromHorizontalPoule().getPlaceNumber();
        }
        // for short numbers this is necessary but function not completely correct
        return this.getFromHorizontalPoule().getFirstPlace().getNumber();
    }
}

