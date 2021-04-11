import { HorizontalPoule } from '../../poule/horizontal';
import { Place } from '../../place';
import { QualifyRule } from '../rule';
import { QualifyGroup } from '../group';

export class MultipleQualifyRule extends QualifyRule {
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

    getGroup(): QualifyGroup {
        const target = this.getQualifyTarget();
        const qualifGroup = this.getFromRound().getQualifyGroups(target).find((qualifyGroup: QualifyGroup) => {
            return this === qualifyGroup.getMultipleRule();
        });
        if (qualifGroup === undefined) {
            throw Error('voor de multiple-kwalificatieregel kan geen groep worden gevonden');
        }
        return qualifGroup;
    }
}

