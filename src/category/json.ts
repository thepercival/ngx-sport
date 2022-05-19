import { JsonIdentifiable } from "../identifiable/json";
import { JsonRound } from "../round/json";
export interface JsonCategory extends JsonIdentifiable {
    name: string,
    number: number,
    rootRound: JsonRound;
}