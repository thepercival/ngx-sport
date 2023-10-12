
import { QualifyPlaceMapping } from "../../placeMapping";
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
        private placeMappings: QualifyPlaceMapping[],
        private previous: HorizontalSingleQualifyRule | undefined) {
        super(fromHorizontalPoule/*, group*/);
        this.fromHorizontalPoule.setQualifyRuleNew(this);
        if (this.previous !== undefined) {
            this.previous.setNext(this);
        } else {
            group.setFirstSingleRule(this);
        }
    }

    getMappings(): QualifyPlaceMapping[] {
        return this.placeMappings;
    }

    getToPlace(fromPlace: Place): Place {
        const mapping = this.getMappings().find((placeMapping: QualifyPlaceMapping): boolean => {
            return placeMapping.getFromPlace() === fromPlace;
        });
        if (mapping === undefined) {
            throw Error('could not find toPlace');
        }
        return mapping.getToPlace();
    }

    getFromPlace(toPlace: Place): Place {
        const mapping = this.getMappings().find((placeMapping: QualifyPlaceMapping): boolean => {
            return placeMapping.getToPlace() === toPlace;
        });
        if (mapping === undefined) {
            throw Error('could not find fromPlace');
        }
        return mapping.getFromPlace();
    }

    hasToPlace(toPlace: Place): boolean {
        try {
            this.getFromPlace(toPlace);
            return true;
        } catch (error) {
        }
        return false;
    }
    
    getNrOfToPlaces(): number {
        return this.placeMappings.length;
    }

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
        return neighBour.getNrOfToPlaces() + neighBour.getNrOfToPlacesTargetSide(targetSide);
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

