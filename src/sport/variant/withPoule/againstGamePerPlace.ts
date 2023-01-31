import { SportMath } from "../../../math";
import { AgainstGpp } from "../against/gamesPerPlace";

export class AgainstGppWithPoule {
    constructor(protected nrOfPlaces: number, protected againstGpp: AgainstGpp) {

    }

    public getTotalNrOfGames(): number
    {
        const totalNrOfGamePlaces = this.nrOfPlaces * this.againstGpp.getNrOfGamesPerPlace();
        const totalNrOfGames = totalNrOfGamePlaces / this.againstGpp.getNrOfGamePlaces();
        return Math.floor(totalNrOfGames);
    }

    public getNrOfPossibleAgainstCombinations(nrOfPlaces?: number|undefined): number
    {
        return nrOfPlaces === undefined ? this.nrOfPlaces : (new SportMath()).above(nrOfPlaces, 2);
    }
}