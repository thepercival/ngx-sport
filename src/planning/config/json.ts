import { JsonIdentifiable } from "../../identifiable/json";
import { PlanningEditMode } from "../editMode";
import { GamePlaceStrategy } from "../strategy";

export interface JsonPlanningConfig extends JsonIdentifiable {
    editMode: PlanningEditMode;
    gamePlaceStrategy: GamePlaceStrategy;
    extension: boolean;
    enableTime: boolean;
    minutesPerGame: number;
    minutesPerGameExt: number;
    minutesBetweenGames: number;
    minutesAfter: number;
    selfReferee: number;
}