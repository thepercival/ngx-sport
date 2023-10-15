import { QualifyGroup } from '../../group';
import { Place } from '../../../place';
import { VerticalQualifyRule } from '../vertical';
import { VerticalMultipleQualifyRule } from './multiple';
import { QualifyTarget } from '../../target';
import { HorizontalPoule } from '../../../poule/horizontal';
import { QualifyMappingByRank } from '../../mapping/byRank';

export class VerticalSingleQualifyRule extends VerticalQualifyRule {

    protected next: VerticalSingleQualifyRule | undefined;
    
    constructor(
        fromHorizontalPoule: HorizontalPoule,
        group: QualifyGroup,
        private byRankMappings: QualifyMappingByRank[],
        private previous: VerticalSingleQualifyRule | undefined) {
            
        super(fromHorizontalPoule);
        this.fromHorizontalPoule.setQualifyRuleNew(this);

        if (this.previous !== undefined) {
            this.previous.setNext(this);
        } else {
            group.setFirstSingleRule(this);
        }
    }

    getMappings(): QualifyMappingByRank[] {
        return this.byRankMappings;
    }

    public getToPlaces(): Place[] {
        return this.getMappings().map((byRankMapping: QualifyMappingByRank): Place => {
            return byRankMapping.getToPlace();
        });
    }

    getMappingByToPlace(toPlace: Place): QualifyMappingByRank | undefined {
        return this.getMappings().find((byRankMapping: QualifyMappingByRank): boolean => {
            return byRankMapping.getToPlace() === toPlace;
        });
    }

    getNrOfMappings(): number {
        return this.byRankMappings.length;
    }

    // public getToPlaceIndex(toPlace: Place): number {
    //     let rank = 0;
    //     this.getMappings().every((mapping: QualifyPlaceMapping) => {
    //         rank++;
    //         if (mapping.getToPlace() === toPlace) {
    //             return false;
    //         }
    //         return true;
    //     });
    //     return rank;
    // }

    // hasToPlace(toPlace: Place): boolean {
    //     try {
    //         this.getFromPlace(toPlace);
    //         return true;
    //     } catch (error) {
    //     }
    //     return false;
    // }

    // getNrOfToPlaces(): number {
    //     return this.placeMappings.length;
    // }

    // public getNrOfDropouts(): number {
    //     return this.fromHorizontalPoule.getPlaces().length - this.getNrOfToPlaces();
    // }

    getFirst(): VerticalSingleQualifyRule | VerticalMultipleQualifyRule {
        const previous = this.getPrevious();
        if (previous !== undefined) {
            return previous.getFirst();
        }
        return this;
    }

    getLast(): VerticalSingleQualifyRule | VerticalMultipleQualifyRule {
        const next = this.getNext();
        if (next !== undefined) {
            return next.getLast();
        }
        return this;
    }

    getPrevious(): VerticalSingleQualifyRule | undefined {
        return this.previous;
    }

    setNext(next: VerticalSingleQualifyRule | undefined): void {
        this.next = next;
    }

    getNext(): VerticalSingleQualifyRule | undefined {
        return this.next;
    }

    setPrevious(previous: VerticalSingleQualifyRule | undefined): void {
        this.previous = previous;
    }

    getNeighbour(targetSide: QualifyTarget): VerticalSingleQualifyRule | undefined {
        return targetSide === QualifyTarget.Winners ? this.previous : this.next;
    }

    getNrOfToPlacesTargetSide(targetSide: QualifyTarget): number {
        let nrOfToPlacesTargetSide = 0;
        let neighBour: VerticalSingleQualifyRule | undefined = this.getNeighbour(targetSide);
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

