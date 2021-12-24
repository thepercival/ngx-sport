import { JsonPlace } from "../place/json";
import { JsonAgainstGame } from "../game/against/json";
import { JsonTogetherGame } from "../game/together/json";
import { JsonIdentifiable } from "../identifiable/json";
export interface JsonPoule extends JsonIdentifiable {
    number: number;
    name?: string;
    places: JsonPlace[];
    againstGames: JsonAgainstGame[] | undefined;
    togetherGames: JsonTogetherGame[] | undefined;
}
