import { HorizontalPoule } from '../../poule/horizontal';
import { PoulePlace } from '../../pouleplace';
import { Round } from '../../round';
import { QualifyRule } from '../rule';

export class QualifyRuleMultiple extends QualifyRule {
    private toPlaces: PoulePlace[] = [];
    private fromHorizontalPoule: HorizontalPoule;
    private nrOfToPlaces: number;

    constructor(fromHorizontalPoule: HorizontalPoule, toRound: Round, nrOfToPlaces: number) {
        super(toRound);
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
}

