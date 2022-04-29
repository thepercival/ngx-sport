import { BalancedPouleStructure } from "./balanced";

export class BalancedMinimumPouleStructure extends BalancedPouleStructure {
    constructor(private minNrOfPoulePlaces: number, ...nrOfPlaces: number[]) {
        super(...nrOfPlaces);
        this.forEach((nrOfPoulePlaces: number) => {
            if (nrOfPoulePlaces < this.minNrOfPoulePlaces) {
                throw Error('een poule heeft te weinig plekken');
            }
        });
    }

    public removePlace(): BalancedMinimumPouleStructure {
        const poules = this.slice();

        const greatestNrOfPlaces = this.getBiggestPoule();


        const idx = poules.lastIndexOf(greatestNrOfPlaces);
        if (idx < 0) {
            throw Error('no poules available');
        }

        // als door het verwijderen van de plek de poulegrootte te klein wordt
        if ((poules[idx] - 1) < this.minNrOfPoulePlaces) { // remove poule
            let nrOfPlacesToRemove = poules[idx];
            poules.splice(idx, 1);
            let newPouleStructure = new BalancedMinimumPouleStructure(this.minNrOfPoulePlaces, ...poules);
            while (nrOfPlacesToRemove--) {
                newPouleStructure = newPouleStructure.removePlace();
            }
            return newPouleStructure;
        }
        poules[idx] = poules[idx] - 1;
        return new BalancedMinimumPouleStructure(this.minNrOfPoulePlaces, ...poules);
    }
}