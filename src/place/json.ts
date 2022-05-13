import { JsonPlaceLocation } from "./location/json";

export interface JsonPlace extends JsonPlaceLocation {
    id: number;
    name?: string;
    extraPoints: number;
    qualifiedPlace: JsonPlace | undefined;
}
