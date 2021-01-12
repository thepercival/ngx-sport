import { JsonTogetherScore } from "../../../score/together/json";
import { JsonGamePlace } from "../json";

export interface JsonTogetherGamePlace extends JsonGamePlace {
    gameRoundNumber: number;
    scores: JsonTogetherScore[];
}