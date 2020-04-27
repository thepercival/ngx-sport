import { JsonCompetitor } from "../competitor/json";

export interface JsonPlace {
    id?: number;
    number: number;
    name?: string;
    competitor?: JsonCompetitor;
    penaltyPoints: number;
}
