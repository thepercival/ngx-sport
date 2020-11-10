import { JsonPlace } from "../place/json";
import { JsonGame } from "../game/json";

export interface JsonPoule {
    id: number;
    number: number;
    name?: string;
    places: JsonPlace[];
    games: JsonGame[];
}
