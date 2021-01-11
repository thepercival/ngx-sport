import { JsonScore } from "../json";

export interface JsonAgainstScore extends JsonScore {
    home: number;
    away: number;
}