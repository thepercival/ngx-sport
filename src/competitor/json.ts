import { JsonStartLocation } from "./startLocation/json";

export interface JsonCompetitor extends JsonStartLocation {
    name: string;
    id: string | number;
    present?: boolean;
    publicInfo?: string;
    privateInfo?: string;
}