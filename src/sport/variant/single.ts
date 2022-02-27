import { GameMode } from "../../planning/gameMode";
import { Sport } from "../../sport";
import { SportVariant } from "../variant";

export class Single extends SportVariant {
    constructor(sport: Sport, protected nrOfGamePlaces: number, protected nrOfGamesPerPlace: number) {
        super(sport, GameMode.Single);
    }

    getNrOfGamePlaces(): number {
        return this.nrOfGamePlaces;
    }

    getNrOfGamesPerPlace(): number {
        return this.nrOfGamesPerPlace;
    }
}