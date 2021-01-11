import { JsonIdentifiable } from "src/identifiable/json";

export interface JsonScore extends JsonIdentifiable {
    phase: number;
    number: number;
}