import { JsonIdentifiable } from "../identifiable/json";
import { JsonPlaceLocation } from "./location/json";

export interface JsonPlace extends JsonPlaceLocation {
    id: number;
    name?: string;
    penaltyPoints: number;
    qualifiedPlace: JsonPlace | undefined;
}
