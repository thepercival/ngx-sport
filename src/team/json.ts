import { JsonIdentifiable } from "../identifiable/json";

export interface JsonTeam extends JsonIdentifiable {
    name: string;
    abbreviation?: string;
}