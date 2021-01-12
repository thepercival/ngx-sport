import { JsonIdentifiable } from "../identifiable/json";

export interface JsonScore extends JsonIdentifiable {
    phase: number;
    number: number;
}