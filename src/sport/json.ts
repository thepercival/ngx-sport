import { CustomSport } from "./custom";

export interface JsonSport {
    id: string | number;
    name: string;
    team: boolean;
    gameMode: number;
    nrOfGamePlaces: number;
    customId: CustomSport;
}