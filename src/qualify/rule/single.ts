import { QualifyGroup } from '../../qualify/group';
import { QualifyRule } from '../rule';
import { QualifyPlaceMapping } from '../placeMapping';
import { HorizontalPoule } from '../../poule/horizontal';
import { Place } from '../../place';
import { QualifyTarget } from '../target';

export class QualifyRuleSingle extends QualifyRule {

    private next: QualifyRuleSingle | undefined;

    constructor(
        fromHorizontalPoule: HorizontalPoule,
        /*group: QualifyGroup,*/
        private placeMappings: QualifyPlaceMapping[],
        private previous: QualifyRuleSingle | undefined) {
        super(fromHorizontalPoule/*, group*/);
        this.fromHorizontalPoule.setQualifyRule(this);
        if (this.previous !== undefined) {
            this.previous.setNext(this);
        } /*else {
            group.setFirstSingleRule(this);
        }*/
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

    getPrevious(): QualifyRuleSingle | undefined {
        return this.previous;
    }

    setNext(next: QualifyRuleSingle | undefined): void {
        this.next = next;
    }

    getNext(): QualifyRuleSingle | undefined {
        return this.next;
    }

    setPrevious(previous: QualifyRuleSingle | undefined): void {
        this.previous = previous;
    }

    getNeighbour(targetSide: QualifyTarget): QualifyRuleSingle | undefined {
        return targetSide === QualifyTarget.Winners ? this.previous : this.next;
    }

    getLast(): QualifyRuleSingle {
        const next = this.getNext();
        if (next !== undefined) {
            return next.getLast();
        }
        return this;
    }


    getNrOfToPlacesTargetSide(targetSide: QualifyTarget): number {
        let nrOfToPlacesTargetSide = 0;
        let neighBour: QualifyRuleSingle | undefined = this.getNeighbour(targetSide);
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
}

