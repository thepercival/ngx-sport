import { GameMode } from "../../planning/gameMode";
import { Sport } from "../../sport";
import { SportVariant } from "../variant";

export class AgainstVariant extends SportVariant {
    constructor(sport: Sport, protected nrOfHomePlaces: number, protected nrOfAwayPlaces: number) {
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

    hasMultipleSidePlaces(): boolean {
        return this.getNrOfGamePlaces() > 2;
    }

    isBalanced(): boolean {
        return this.nrOfHomePlaces === this.nrOfAwayPlaces;
    }
}
