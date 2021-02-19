import { JsonPlaceLocation } from "./location/json";

export interface JsonPlace {
    id: number;
    number: number;
    name?: string;
    penaltyPoints: number;
    qualifiedPlaceLocation: JsonPlaceLocation | undefined;
}
