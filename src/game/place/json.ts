import { JsonIdentifiable } from "../../identifiable/json";
import { JsonPlace } from "../../place/json";

export interface JsonGamePlace extends JsonIdentifiable {
    place: JsonPlace;
}