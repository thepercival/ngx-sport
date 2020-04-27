import { JsonGamePlace } from "./place/json";
import { JsonGameScore } from "./score/json";

export interface JsonGame {
    id?: number;
    places: JsonGamePlace[];
    batchNr: number;
    fieldNr: number;
    state: number;
    startDateTime?: string;
    refereeRank?: number;
    refereePlaceId?: number;
    scores?: JsonGameScore[];
}
