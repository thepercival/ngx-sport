import { JsonGamePlace } from "../json";

export interface JsonAgainstGamePlace extends JsonGamePlace {
    homeaway: boolean | undefined;
}