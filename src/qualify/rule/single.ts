import { QualifyGroup } from '../../qualify/group';
import { QualifyRule } from '../rule';
import { QualifyPlaceMapping } from '../placeMapping';
import { HorizontalPoule } from '../../poule/horizontal';
import { Place } from '../../place';
import { QualifyTarget } from '../target';

export class SingleQualifyRule extends QualifyRule {

    private next: SingleQualifyRule | undefined;

    constructor(
        fromHorizontalPoule: HorizontalPoule,
        group: QualifyGroup,
        private placeMappings: QualifyPlaceMapping[],
        private previous: SingleQualifyRule | undefined) {
        super(fromHorizontalPoule/*, group*/);
        this.fromHorizontalPoule.setQualifyRule(this);
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

    getNrOfToPlaces(): number {
        return this.placeMappings.length;
    }

    getPrevious(): SingleQualifyRule | undefined {
        return this.previous;
    }

    setNext(next: SingleQualifyRule | undefined): void {
        this.next = next;
    }

    getNext(): SingleQualifyRule | undefined {
        return this.next;
    }

    setPrevious(previous: SingleQualifyRule | undefined): void {
        this.previous = previous;
    }

    getNeighbour(targetSide: QualifyTarget): SingleQualifyRule | undefined {
        return targetSide === QualifyTarget.Winners ? this.previous : this.next;
    }

    getFirst(): SingleQualifyRule {
        const previous = this.getPrevious();
        if (previous !== undefined) {
            return previous.getFirst();
        }
        return this;
    }

    getLast(): SingleQualifyRule {
        const next = this.getNext();
        if (next !== undefined) {
            return next.getLast();
        }
        return this;
    }

    getNrOfToPlacesTargetSide(targetSide: QualifyTarget): number {
        let nrOfToPlacesTargetSide = 0;
        let neighBour: SingleQualifyRule | undefined = this.getNeighbour(targetSide);
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
        this.getFromHorizontalPoule().setQualifyRule(undefined);
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

