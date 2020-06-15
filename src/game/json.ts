import { JsonGamePlace } from "./place/json";
import { JsonGameScore } from "./score/json";

export interface JsonGame {
    id?: number;
    places: JsonGamePlace[];
    batchNr: number;
    fieldPriority: number;
    state: number;
    startDateTime?: string;
    refereePriority?: number;
    refereePlaceLocId?: string;
    scores: JsonGameScore[];
}
