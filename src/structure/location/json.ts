import { JsonPlaceLocation } from "../../place/location/json";

export interface JsonStructureLocation {
    categoryNr: number;
    pathNode: string;
    placeLocation: JsonPlaceLocation;
}