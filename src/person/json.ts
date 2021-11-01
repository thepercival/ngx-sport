import { JsonIdentifiable } from "../identifiable/json";
import { JsonPlayer } from "../team/player/json";

export interface JsonPerson extends JsonIdentifiable {
    firstName: string;
    nameInsertion?: string;
    lastName: string;
    players?: JsonPlayer[];
}
