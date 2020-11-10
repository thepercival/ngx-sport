import { JsonGamePlace } from "./place/json";
import { JsonGameScore } from "./score/json";

export interface JsonGame {
    id: number;
    places: JsonGamePlace[];
    batchNr: number;
    fieldPriority: number | undefined;
    state: number;
    startDateTime: string | undefined;
    refereePriority: number | undefined;
    refereePlaceLocId: string | undefined;
    scores: JsonGameScore[];
}
