import { JsonGamePlace } from "../json";

export interface JsonAgainstGamePlace extends JsonGamePlace {
    homeAway: boolean;
}