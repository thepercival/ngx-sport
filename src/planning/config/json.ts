import { JsonIdentifiable } from "../../identifiable/json";
import { GameMode } from "../gameMode";

export interface JsonPlanningConfig extends JsonIdentifiable {
    gameMode: GameMode;
    extension: boolean;
    enableTime: boolean;
    minutesPerGame: number;
    minutesPerGameExt: number;
    minutesBetweenGames: number;
    minutesAfter: number;
    selfReferee: number;
}