import { CustomSport } from "./custom";

export interface JsonSport {
    id: string | number;
    name: string;
    team: boolean;
    defaultGameMode: number;
    defaultNrOfSidePlaces: number;
    customId: CustomSport;
}