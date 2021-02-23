import { HomeOrAway } from "../../against";
import { JsonGamePlace } from "../json";

export interface JsonAgainstGamePlace extends JsonGamePlace {
    homeAway: HomeOrAway;
}