import { HorizontalPoule } from '../../../poule/horizontal';
import { Place } from '../../../place';
import { QualifyGroup } from '../../group';
import { HorizontalQualifyRule } from '../horizontal';

export class HorizontalMultipleQualifyRule extends HorizontalQualifyRule {

    constructor(fromHorizontalPoule: HorizontalPoule, group: QualifyGroup, private toPlaces: Place[]) {
        super(fromHorizontalPoule/*, group*/);
        this.fromHorizontalPoule.setQualifyRuleNew(this);
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

    public getToPlaceNumber(place: Place): number {
        const idx = this.toPlaces.indexOf(place);
        return idx < 0 ? 0 : idx + 1;
    }

    getToPlaces(): Place[] {
        return this.toPlaces;
    }

    getNrOfToPlaces(): number {
        return this.toPlaces.length;
    }

    detach() {
        this.getFromHorizontalPoule().setQualifyRuleNew(undefined);
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

