import { HorizontalPoule } from '../../poule/horizontal';
import { Place } from '../../place';
import { QualifyRule } from '../rule';
import { QualifyGroup } from '../group';

export class QualifyRuleMultiple extends QualifyRule {
    constructor(fromHorizontalPoule: HorizontalPoule, group: QualifyGroup, private toPlaces: Place[]) {
        super(fromHorizontalPoule/*, group*/);
        this.fromHorizontalPoule.setQualifyRule(this);
        group.setMultipleRule(this);
    }


    /*addToPlace(toPlace: Place) {
        this.toPlaces.push(toPlace);
        toPlace.setFromQualifyRule(this);
    }

    toPlacesComplete(): boolean {
        return this.nrOfToPlaces === this.toPlaces.length;
    }*/

    hasToPlace(place: Place): boolean {
        return this.toPlaces.indexOf(place) >= 0;
    }

    getToPlaces(): Place[] {
        return this.toPlaces;
    }

    getNrOfToPlaces(): number {
        return this.toPlaces.length;
    }

    detach() {
        this.getFromHorizontalPoule().setQualifyRule(undefined);
    }
}

