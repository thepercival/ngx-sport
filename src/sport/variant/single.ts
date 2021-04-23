import { GameAllocation } from "../../game/allocation";
import { GameMode } from "../../planning/gameMode";
import { Sport } from "../../sport";
import { SportVariant } from "../variant";

export class SingleSportVariant extends SportVariant {
    constructor(sport: Sport, protected nrOfGamePlaces: number, protected gameAmount: number) {
        super(sport, GameMode.Single);
    }

    getNrOfGamePlaces(): number {
        return this.nrOfGamePlaces;
    }

    getGameAmount(): number {
        return this.gameAmount;
    }

    getGameAllocation(): GameAllocation {
        return GameAllocation.Round;
    }
}