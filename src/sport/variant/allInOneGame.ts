import { GameMode } from "../../planning/gameMode";
import { Sport } from "../../sport";
import { SportVariant } from "../variant";

export class AllInOneGame extends SportVariant {
    constructor(sport: Sport, protected nrOfGamesPerPlace: number) {
        super(sport, GameMode.AllInOneGame);
    }

    getNrOfGamesPerPlace(): number {
        return this.nrOfGamesPerPlace;
    }
}