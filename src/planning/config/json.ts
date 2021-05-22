import { JsonIdentifiable } from "../../identifiable/json";
import { GameCreationStrategy } from "../strategy";

export interface JsonPlanningConfig extends JsonIdentifiable {
    gameCreationStrategy: GameCreationStrategy;
    extension: boolean;
    enableTime: boolean;
    minutesPerGame: number;
    minutesPerGameExt: number;
    minutesBetweenGames: number;
    minutesAfter: number;
    selfReferee: number;
}