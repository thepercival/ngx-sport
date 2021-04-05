import { PouleStructure } from "../structure";

export class BalancedPouleStructure extends PouleStructure {
    constructor(...nrOfPlaces: number[]) {
        super(...nrOfPlaces);
        if (this.getBiggestPoule() - this.getSmallestPoule() > 1) {
            new Error('this poulestructure is not balanced');
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
}