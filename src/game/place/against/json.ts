import { AgainstSide } from "../../../against/side";
import { JsonGamePlace } from "../json";

export interface JsonAgainstGamePlace extends JsonGamePlace {
    side: AgainstSide;
}