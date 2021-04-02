import { PouleStructure } from "../structure";

export class BalancedPouleStructure extends PouleStructure {
    constructor(nrOfPlaces: number, nrOfPoules: number) {
        if (nrOfPlaces <= 1 || nrOfPlaces < 1 || (nrOfPlaces / nrOfPoules) < 2) {
            throw new Error('De minimale aantal deelnemers per poule is 2.');
        }
        const getInnerData = (nrOfPlaces: number, nrOfPoules: number): number[] => {

            const calculateNrOfPlacesPerPoule = (nrOfPlaces: number, nrOfPoules: number): number => {
                const nrOfPlaceLeft = (nrOfPlaces % nrOfPoules);
                if (nrOfPlaceLeft === 0) {
                    return nrOfPlaces / nrOfPoules;
                }
                return ((nrOfPlaces - nrOfPlaceLeft) / nrOfPoules);
            }

            const nrOfPlacesPerPoule = calculateNrOfPlacesPerPoule(nrOfPlaces, nrOfPoules)
            const innerData: number[] = [];
            while (nrOfPlaces > 0) {
                const nrOfPlacesToAdd = nrOfPlaces >= nrOfPlacesPerPoule ? nrOfPlacesPerPoule : nrOfPlaces;
                this.push(nrOfPlacesToAdd);
                nrOfPlaces -= nrOfPlacesPerPoule;
            }
            return innerData;
        }
        super(...getInnerData(nrOfPlaces, nrOfPoules));
    }


}