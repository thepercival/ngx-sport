import { JsonTeam } from "../json";

export interface JsonPlayer {
    id: number;
    team: JsonTeam;
    startDateTime: string;
    endDateTime: string;
    line: number;
}
