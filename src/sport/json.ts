import { GameMode } from "../planning/gameMode";

export interface JsonSport {
    id: string | number;
    name: string;
    team: boolean;
    defaultGameMode: GameMode;
    defaultNrOfSidePlaces: number;
    customId: number;
}