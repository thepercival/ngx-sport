import { JsonPlace } from "../place/json";
import { JsonAgainstGame } from "src/game/against/json";
import { JsonTogetherGame } from "src/game/together/json";
export interface JsonPoule {
    id: number;
    number: number;
    name?: string;
    places: JsonPlace[];
    againstGames: JsonAgainstGame[];
    togetherGames: JsonTogetherGame[];
}
