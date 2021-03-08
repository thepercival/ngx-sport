import { CreationStrategy } from "../../game/roundAssigner";
import { JsonIdentifiable } from "../../identifiable/json";

export interface JsonPlanningConfig extends JsonIdentifiable {
    creationStrategy: CreationStrategy;
    extension: boolean;
    enableTime: boolean;
    minutesPerGame: number;
    minutesPerGameExt: number;
    minutesBetweenGames: number;
    minutesAfter: number;
    selfReferee: number;
}