import { GameAllocation } from "../../game/allocation";
import { GameMode } from "../../planning/gameMode";
import { Sport } from "../../sport";
import { SportVariant } from "../variant";

export class AllInOneGameSportVariant extends SportVariant {
    constructor(sport: Sport, protected gameAmount: number) {
        super(sport, GameMode.AllInOneGame);
    }

    getGameAmount(): number {
        return this.gameAmount;
    }


    getGameAllocation(): GameAllocation {
        return GameAllocation.Poule;
    }
}