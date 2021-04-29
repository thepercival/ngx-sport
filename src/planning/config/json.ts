import { JsonIdentifiable } from "../../identifiable/json";

export interface JsonPlanningConfig extends JsonIdentifiable {
    extension: boolean;
    enableTime: boolean;
    minutesPerGame: number;
    minutesPerGameExt: number;
    minutesBetweenGames: number;
    minutesAfter: number;
    selfReferee: number;
}