
import { QualifyMappingByPlace } from "../../mapping/byPlace";
import { HorizontalQualifyRule } from "../horizontal";
import { HorizontalPoule } from "../../../poule/horizontal";
import { QualifyGroup } from "../../group";
import { Place } from "../../../place";
import { QualifyTarget } from "../../target";


export class HorizontalSingleQualifyRule extends HorizontalQualifyRule {

    private next: HorizontalSingleQualifyRule | undefined;

    constructor(
        fromHorizontalPoule: HorizontalPoule,
        group: QualifyGroup,
        private byPlaceMappings: QualifyMappingByPlace[],
        private previous: HorizontalSingleQualifyRule | undefined) {
        super(fromHorizontalPoule/*, group*/);
        this.fromHorizontalPoule.setQualifyRuleNew(this);
        if (this.previous !== undefined) {
            this.previous.setNext(this);
        } else {
            group.setFirstSingleRule(this);
        }
    }

    getMappings(): QualifyMappingByPlace[] {
        return this.byPlaceMappings;
    }

    getMappingByFromPlace(fromPlace: Place): QualifyMappingByPlace | undefined {
        return this.getMappings().find((byPlaceMapping: QualifyMappingByPlace): boolean => {
            return byPlaceMapping.getFromPlace() === fromPlace;
        });
    }

    getMappingByToPlace(toPlace: Place): QualifyMappingByPlace|undefined {
        return this.getMappings().find((byPlaceMapping: QualifyMappingByPlace): boolean => {
            return byPlaceMapping.getToPlace() === toPlace;
        });
    }
    
    getNrOfMappings(): number {
        return this.byPlaceMappings.length;
    }

    // public getNrOfDropouts(): number {
    //     return this.fromHorizontalPoule.getPlaces().length - this.getNrOfToPlaces();
    // }

    getPrevious(): HorizontalSingleQualifyRule | undefined {
        return this.previous;
    }

    setNext(next: HorizontalSingleQualifyRule | undefined): void {
        this.next = next;
    }

    getNext(): HorizontalSingleQualifyRule | undefined {
        return this.next;
    }

    setPrevious(previous: HorizontalSingleQualifyRule | undefined): void {
        this.previous = previous;
    }

    getNeighbour(targetSide: QualifyTarget): HorizontalSingleQualifyRule | undefined {
        return targetSide === QualifyTarget.Winners ? this.previous : this.next;
    }

    getFirst(): HorizontalSingleQualifyRule {
        const previous = this.getPrevious();
        if (previous !== undefined) {
            return previous.getFirst();
        }
        return this;
    }

    getLast(): HorizontalSingleQualifyRule {
        const next = this.getNext();
        if (next !== undefined) {
            return next.getLast();
        }
        return this;
    }

    getNrOfToPlacesTargetSide(targetSide: QualifyTarget): number {
        let nrOfToPlacesTargetSide = 0;
        let neighBour: HorizontalSingleQualifyRule | undefined = this.getNeighbour(targetSide);
        if (neighBour === undefined) {
            return nrOfToPlacesTargetSide;
        }
        return neighBour.getNrOfMappings() + neighBour.getNrOfToPlacesTargetSide(targetSide);
    }

    detach() {
        const next = this.getNext();
        if (next !== undefined) {
            next.detach();
            this.setNext(undefined);
        }
        this.getFromHorizontalPoule().setQualifyRuleNew(undefined);
        this.setPrevious(undefined);
    }

    getGroup(): QualifyGroup {
        const target = this.getQualifyTarget();
        const firstSingleRule = this.getFirst()
        const qualifGroup = this.getFromRound().getQualifyGroups(target).find((qualifyGroup: QualifyGroup) => {
            return firstSingleRule === qualifyGroup.getFirstSingleRule();
        });
        if (qualifGroup === undefined) {
            throw Error('voor de single-kwalificatieregel kan geen groep worden gevonden');
        }
        return qualifGroup;
    }
}

