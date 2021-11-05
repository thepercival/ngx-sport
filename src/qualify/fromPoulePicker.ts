import { Place } from "../place";
import { Poule } from "../poule";
import { PossibleFromMap } from "./possibleFromMap";


export class FromPoulePicker {
    protected possibleParentFromMap: PossibleFromMap | undefined = undefined;

    public constructor(protected possibleFromMap: PossibleFromMap) {
    }

    public getBestFromPoule(
        childPoule: Poule, avaiableFromPoules: Poule[], otherChildRoundPoules: Poule[]
    ): Poule {
        if (this.possibleFromMap.isEmpty()) {
            const bestFromPoule = avaiableFromPoules[0];
            if (bestFromPoule !== undefined) {
                return bestFromPoule;
            }
        }
        const bestFromPoules = this.getFewestOverlapses(childPoule, avaiableFromPoules);

        if (bestFromPoules.length === 1) {
            return <Poule>bestFromPoules.pop();
        }
        const fromPlacesWithMostOtherPouleOrigins = this.getMostOverlapses(otherChildRoundPoules, bestFromPoules);
        const fromPlacesWithMostOtherPouleOrigin = fromPlacesWithMostOtherPouleOrigins[0];
        if (fromPlacesWithMostOtherPouleOrigin === undefined) {
            throw new Error('could not find best pick');
        }
        return fromPlacesWithMostOtherPouleOrigin;
    }

    protected getFewestOverlapses(p_childPoule: Poule, availableFromPoules: Poule[]): Poule[] {
        const bestFromPoules = this.getFewestOverlapsesHelper(p_childPoule, availableFromPoules, this.possibleFromMap);
        if (bestFromPoules.length < 2) {
            return bestFromPoules;
        }

        const possibleParentFromMap = this.getParentPossibleFromMap();
        if (possibleParentFromMap === undefined) {
            return bestFromPoules;
        }
        const alreadyUsedGrandParentPoules = this.getGrantParentPossiblePoules(p_childPoule);
        let fewestOverlapses: number | undefined = undefined;

        let veryBestFromPoules: Poule[] = [];
        bestFromPoules.forEach((bestFromPoule: Poule) => {
            let nrOfOverlapses = 0;
            alreadyUsedGrandParentPoules.forEach((alreadyUsedGrandParentPoule: Poule) => {
                nrOfOverlapses += this.getNrOfPossibleOverlapses(alreadyUsedGrandParentPoule, bestFromPoule, possibleParentFromMap);
            });
            //            bestFromParentPoules = this->getFewestOverlapsesHelper(
            //                bestFromPoule,
            //                alreadyUsedGrandParentPoules,
            //                possibleParentFromMap
            //            );
            // x = array_intersect => bestFromParentPoules, possibleParentFromPoules,
            //            nrOfOverlapses = count(bestFromParentPoules);
            if (fewestOverlapses === undefined || nrOfOverlapses < fewestOverlapses) {
                veryBestFromPoules = [bestFromPoule];
                fewestOverlapses = nrOfOverlapses;
            } else if (fewestOverlapses === nrOfOverlapses) {
                veryBestFromPoules.push(bestFromPoule);
            }
        });
        return veryBestFromPoules;
    }

    protected getFewestOverlapsesHelper(childPoule: Poule, availableFromPoules: Poule[], possibleFromMap: PossibleFromMap): Poule[] {
        // toPoule = toPlace->getPoule();
        let bestFromPoules: Poule[] = [];
        let fewestOverlapses: number | undefined = undefined;
        // possibleFromPoules = this->possibleFromMap->getFromPoules(childPoule);
        availableFromPoules.forEach((availableFromPoule: Poule) => {
            let nrOfOverlapses = this.getNrOfPossibleOverlapses(availableFromPoule, childPoule, possibleFromMap);
            if (fewestOverlapses === undefined || nrOfOverlapses < fewestOverlapses) {
                bestFromPoules = [availableFromPoule];
                fewestOverlapses = nrOfOverlapses;
            } else if (fewestOverlapses === nrOfOverlapses) {
                bestFromPoules.push(availableFromPoule);
            }
        });
        return bestFromPoules;
    }

    protected getGrantParentPossiblePoules(childPoule: Poule): Poule[] {
        const parentPossibleFromMap = this.getParentPossibleFromMap();
        if (parentPossibleFromMap === undefined) {
            return [];
        }
        let possiblePoules: Poule[] = [];
        this.possibleFromMap.getFromPoules(childPoule).forEach((fromPoule: Poule) => {
            possiblePoules = possiblePoules.concat(parentPossibleFromMap.getFromPoules(fromPoule));
        });
        return possiblePoules;
    }


    protected getOtherChildRoundPoules(otherChildRoundPlaces: Place[]): Poule[] {
        const firstPlace = otherChildRoundPlaces.pop();
        const poules = firstPlace !== undefined ? [firstPlace.getPoule()] : [];
        otherChildRoundPlaces.forEach((place: Place) => {
            const idx = poules.indexOf(place.getPoule());
            if (idx >= 0) {
                poules.push(place.getPoule());
            }
        });
        return poules;
    }

    protected getMostOverlapses(otherChildPoules: Poule[], availableFromPoules: Poule[]): Poule[] {
        // toPoule = toPlace->getPoule();
        let bestFromPoules: Poule[] = [];
        let mostOverlapses: number | undefined = undefined;
        // possibleFromPoules = this->possibleFromMap->getFromPoules(childPoule);
        availableFromPoules.forEach((availableFromPoule: Poule) => {
            otherChildPoules.forEach((otherChildPoule: Poule) => {
                const nrOfOverlapses = this.getNrOfPossibleOverlapses(availableFromPoule, otherChildPoule, this.possibleFromMap);
                if (mostOverlapses === undefined || nrOfOverlapses > mostOverlapses) {
                    bestFromPoules = [availableFromPoule];
                    mostOverlapses = nrOfOverlapses;
                } else if (mostOverlapses === nrOfOverlapses) {
                    bestFromPoules.push(availableFromPoule);
                }
            });
        });
        return bestFromPoules;
    }

    protected getNrOfPossibleOverlapses(fromPoule: Poule, childPoule: Poule, possibleFromMap: PossibleFromMap): number {
        const possibleFromPoules = possibleFromMap.getFromPoules(childPoule);
        const overlapses = possibleFromPoules.filter((possibleFromPoule: Poule) => {
            return possibleFromPoule === fromPoule;
        });
        return overlapses.length;
    }

    protected getParentPossibleFromMap(): PossibleFromMap | undefined {
        if (this.possibleParentFromMap === undefined) {
            this.possibleParentFromMap = this.possibleFromMap.createParent();
        }
        return this.possibleParentFromMap;
    }
}