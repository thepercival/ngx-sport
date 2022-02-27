
import { Sport } from "../../../sport";
import { AgainstVariant } from "../against";

export class AgainstGpp extends AgainstVariant {
    constructor(sport: Sport, nrOfHomePlaces: number, nrOfAwayPlaces: number, protected nrOfGamesPerPlace: number) {
        super(sport, nrOfHomePlaces, nrOfAwayPlaces);
    }

    getNrOfGamesPerPlace(): number {
        return this.nrOfGamesPerPlace;
    }
}
