import { JsonSport } from "../sport/json";

export interface JsonField {
    id?: number;
    number: number;
    name: string;
    sport: JsonSport;
}
