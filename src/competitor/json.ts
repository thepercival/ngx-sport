import { JsonStartLocation } from "./startLocation/json";

export interface JsonCompetitor extends JsonStartLocation {
    name: string;
    id: string | number;
    registered?: boolean;
    info?: string;
}