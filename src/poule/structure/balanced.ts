import { PouleStructure } from "../structure";

export class BalancedPouleStructure extends PouleStructure {
    constructor(...nrOfPlaces: number[]) {
        super(...nrOfPlaces);
        if (this.getBiggestPoule() - this.getSmallestPoule() > 1) {
            throw new Error('this poulestructure is not balanced');
        }
    }

    public getFirstLesserNrOfPlacesPouleNr(): number {
        const leastNrOfPlaces = this.getSmallestPoule();
        return this.indexOf(leastNrOfPlaces) + 1;
    }

    public getLastGreaterNrOfPlacesPouleNr(): number {
        const greatestNrOfPlaces = this.getBiggestPoule();
        return this.lastIndexOf(greatestNrOfPlaces) + 1;
    }

    public removePoule(): BalancedPouleStructure {
        if (this.length <= 1) {
            throw Error('not enough poules');
        }
        const poules = this.slice();
        poules.pop();
        return new BalancedPouleStructure(...poules);
    }
}