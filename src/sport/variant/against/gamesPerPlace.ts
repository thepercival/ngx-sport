
import { AgainstSide } from "../../../against/side";
import { Sport } from "../../../sport";
import { AgainstVariant } from "../against";

export class AgainstGpp extends AgainstVariant {
    constructor(sport: Sport, nrOfHomePlaces: number, nrOfAwayPlaces: number, protected nrOfGamesPerPlace: number) {
        super(sport, nrOfHomePlaces, nrOfAwayPlaces);
    }

    public getNrOfGamesPerPlace(): number {
        return this.nrOfGamesPerPlace;
    }

    public getGamePlacesId(): string {
        return this.getNrOfHomePlaces() + '-' + this.getNrOfAwayPlaces();
    }

    public getNrOfAgainstCombinationsPerGame(side?: AgainstSide|undefined): number {
        if( side === AgainstSide.Home) {
            return this.getNrOfAwayPlaces();
        } else if( side === AgainstSide.Away) {
            return this.getNrOfHomePlaces();
        }
        return this.getNrOfHomePlaces() * this.getNrOfAwayPlaces();

    }
}
