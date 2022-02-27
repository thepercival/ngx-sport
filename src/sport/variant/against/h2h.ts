
import { Sport } from "../../../sport";
import { AgainstVariant } from "../against";

export class AgainstH2h extends AgainstVariant {
    constructor(sport: Sport, nrOfHomePlaces: number, nrOfAwayPlaces: number, protected nrOfH2H: number) {
        super(sport, nrOfHomePlaces, nrOfAwayPlaces);
    }

    getNrOfH2H(): number {
        return this.nrOfH2H;
    }
}
