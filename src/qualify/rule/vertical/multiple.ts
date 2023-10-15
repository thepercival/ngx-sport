import { HorizontalPoule } from '../../../poule/horizontal';
import { Place } from '../../../place';
import { QualifyGroup } from '../../group';
import { VerticalQualifyRule } from '../vertical';

export class VerticalMultipleQualifyRule extends VerticalQualifyRule {

    constructor(
        fromHorizontalPoule: HorizontalPoule,
        group: QualifyGroup,
        private toPlaces: Place[]) {

        super(fromHorizontalPoule);
        this.fromHorizontalPoule.setQualifyRuleNew(this);
        group.setMultipleRule(this);
        
    }

    public getRankByToPlace(toPlace: Place): number {
        const idx = this.toPlaces.indexOf(toPlace);
        return idx < 0 ? 0 : idx + 1;
    }

    getToPlaces(): Place[] {
        return this.toPlaces;
    }

    getNrOfToPlaces(): number {
        return this.toPlaces.length;
    }

    public getNrOfDropouts(): number {
        return this.fromHorizontalPoule.getPlaces().length - this.getNrOfToPlaces();
    }

    // getFromPlace(toPlace: Place): Place {

    //     public getToPlaceNumber(place: Place): number {
    //         const idx = this.toPlaces.indexOf(place);
    //         return idx < 0 ? 0 : idx + 1;
    //     }


    //     const mapping = this.getMappings().find((placeMapping: QualifyPlaceMapping): boolean => {
    //         return placeMapping.getToPlace() === toPlace;
    //     });
    //     if (mapping === undefined) {
    //         throw Error('could not find fromPlace');
    //     }
    //     return mapping.getFromPlace();
    // }

    /*toPlacesComplete(): boolean {
        return this.nrOfToPlaces === this.toPlaces.length;
    }*/

    // getFromPlace(toPlace: Place): Place {
    //     const mapping = this.getMappings().find((placeMapping: QualifyPlaceMapping): boolean => {
    //         return placeMapping.getToPlace() === toPlace;
    //     });
    //     if (mapping === undefined) {
    //         throw Error('could not find fromPlace');
    //     }
    //     return mapping.getFromPlace();
    // }

    // public getToPlaceNumber(place: Place): number {
    //     const idx = this.toPlaces.indexOf(place);
    //     return idx < 0 ? 0 : idx + 1;
    // }

    hasToPlace(place: Place): boolean {
        return this.toPlaces.indexOf(place) >= 0;
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

