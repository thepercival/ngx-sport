import { JsonPlayer } from "../team/player/json";

export interface JsonPerson {
    id: number;
    firstName: string;
    nameInsertion?: string;
    lastName: string;
    imageUrl?: string;
    players?: JsonPlayer[];
}
