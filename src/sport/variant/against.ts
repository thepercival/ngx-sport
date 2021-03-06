import { GameMode } from "../../planning/gameMode";
import { Sport } from "../../sport";
import { SportVariant } from "../variant";

export class AgainstSportVariant extends SportVariant {
    constructor(sport: Sport, protected nrOfHomePlaces: number, protected nrOfAwayPlaces: number, protected nrOfH2H: number, protected nrOfGamesPerPlace: number) {
        super(sport, GameMode.Against);
    }

    getNrOfHomePlaces(): number {
        return this.nrOfHomePlaces;
    }

    getNrOfAwayPlaces(): number {
        return this.nrOfAwayPlaces;
    }

    getNrOfGamePlaces(): number {
        return this.nrOfHomePlaces + this.nrOfAwayPlaces;
    }

    isMixed(): boolean {
        return this.getNrOfGamePlaces() > 2;
    }

    isBalanced(): boolean {
        return this.nrOfHomePlaces === this.nrOfAwayPlaces;
    }

    getNrOfH2H(): number {
        return this.nrOfH2H;
    }

    getNrOfGamesPerPlace(): number {
        return this.nrOfGamesPerPlace;
    }
}
