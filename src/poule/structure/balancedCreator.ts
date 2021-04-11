import { BalancedPouleStructure } from "./balanced";

export class BalancedPouleStructureCreator {
    create(nrOfPlaces: number, nrOfPoules: number): BalancedPouleStructure {
        const calculateNrOfPlacesPerPoule = (nrOfPlaces: number, nrOfPoules: number): number => {
            const nrOfPlaceLeft = (nrOfPlaces % nrOfPoules);
            if (nrOfPlaceLeft === 0) {
                return nrOfPlaces / nrOfPoules;
            }
            return ((nrOfPlaces - nrOfPlaceLeft) / nrOfPoules);
        }

        const innerData: number[] = [];
        while (nrOfPlaces > 0) {
            const nrOfPlacesPerPoule = calculateNrOfPlacesPerPoule(nrOfPlaces, nrOfPoules--);
            const nrOfPlacesToAdd = nrOfPlaces >= nrOfPlacesPerPoule ? nrOfPlacesPerPoule : nrOfPlaces;
            innerData.push(nrOfPlacesToAdd);
            nrOfPlaces -= nrOfPlacesPerPoule;
        }
        return new BalancedPouleStructure(...innerData)
    }
}