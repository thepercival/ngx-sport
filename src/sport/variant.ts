import { Identifiable } from "../identifiable";
import { GameMode } from "../planning/gameMode";
import { Sport } from "../sport";

export class SportVariant extends Identifiable {
    constructor(protected sport: Sport, protected gameMode: GameMode) {
        super();
    }

    getSport(): Sport {
        return this.sport;
    }

    getGameMode(): GameMode {
        return this.gameMode;
    }
}