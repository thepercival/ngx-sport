import { Place } from "../place";
import { Poule } from "../poule";
import { BalancedMinimumPouleStructure } from "../poule/structure/balancedMinimum";
import { QualifyDistribution } from "../qualify/distribution";
import { QualifyGroup, Round } from "../qualify/group";
import { QualifyTarget } from "../qualify/target";

export class RemovalValidator {

    public willStructureBeValid(
        round: Round,
        nrOfPlacesToRemoveMap: QualifyGroupNrOfPlacesMap,
        minNrOfPlacesPerPoule: number
    ): void {


        [QualifyTarget.Winners, QualifyTarget.Losers].forEach((target: QualifyTarget) => {
            const qualifyGroups = round.getQualifyGroups(target);

            qualifyGroups.forEach((qualifyGroup: QualifyGroup) => {
                const childRound = qualifyGroup.getChildRound();
                const qualifyGroupIdx = this.getQualifyGroupIndex(qualifyGroup);
                let nrOfPlacesToRemove = 0;
                if (nrOfPlacesToRemoveMap[qualifyGroupIdx] !== undefined) {
                    nrOfPlacesToRemove = nrOfPlacesToRemoveMap[qualifyGroupIdx];
                }
                if (nrOfPlacesToRemove === 0) {
                    return;
                }

                // poules = childRound.createPouleStructure().toArray();
                let newChildPouleStructure = new BalancedMinimumPouleStructure(minNrOfPlacesPerPoule, ...childRound.createPouleStructure());
                while (nrOfPlacesToRemove--) {
                    newChildPouleStructure = newChildPouleStructure.removePlace();
                }
                const placesToRemove = this.getRemovedPlaces(childRound, newChildPouleStructure);
                nrOfPlacesToRemoveMap = this.getNrOfPlacesToRemoveMap(round, placesToRemove);
                this.willStructureBeValid(childRound, nrOfPlacesToRemoveMap, minNrOfPlacesPerPoule);
            });
        });
    }

    private getRemovedPlaces(round: Round, pouleStructure: BalancedMinimumPouleStructure): Place[] {
        let removedPlaces = [];
        round.getPoules().forEach((poule: Poule) => {
            if (pouleStructure.length === 0) {
                removedPlaces = removedPlaces.concat(poule.getPlaces().slice());
            } else {
                const nrOfPlaces = pouleStructure.shift();
                poule.getPlaces().forEach((place: Place) => {
                    if (place.getPlaceNr() > nrOfPlaces) {
                        removedPlaces.push(place);
                    }
                });
            }
        });
        return removedPlaces;
    }

    public getNrOfPlacesToRemoveMap(round: Round, placesToRemove: Place[]): QualifyGroupNrOfPlacesMap {
        const map: QualifyGroupNrOfPlacesMap = {};
        round.getQualifyGroups().forEach((qualifyGroup: QualifyGroup) => {
            const idx = this.getQualifyGroupIndex(qualifyGroup);
            map[idx] = this.getQualifyGroupNrOfPlacesToRemove(placesToRemove, qualifyGroup);
        });
        return map;
    }

    private getQualifyGroupNrOfPlacesToRemove(placesToRemove: Place[], childQualifyGroup: QualifyGroup): number {
        let nrOfPlaces = 0;
        // determine which qualifyGroup needs to remove how many places
        placesToRemove.forEach((placeIt: Place) => {
            const horPoule = placeIt.getHorizontalPoule(childQualifyGroup.getTarget());

            if( childQualifyGroup.getDistribution() === QualifyDistribution.HorizontalSnake) {
                let singleQualifyRule = childQualifyGroup.getFirstSingleRule();
                while (singleQualifyRule) {
                    if (singleQualifyRule.getFromHorizontalPoule() === horPoule) {
                        nrOfPlaces++;
                    }
                    singleQualifyRule = singleQualifyRule.getNext();
                }
            } else {
                throw new Error('getQualifyGroupNrOfPlacesToRemove'); // @TODO CDK            
            }

            
        });
        return nrOfPlaces;
    }

    public getQualifyGroupIndex(qualifyGroup: QualifyGroup): string {
        return qualifyGroup.getTarget() + qualifyGroup.getNumber();
    }
}

export interface QualifyGroupNrOfPlacesMap {
    [key: string]: number;
}
