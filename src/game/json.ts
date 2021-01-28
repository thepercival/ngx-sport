import { JsonGamePlace } from "./place/json";
import { JsonIdentifiable } from '../identifiable/json';
import { JsonCompetitionSport } from '../competition/sport/json';
import { JsonField } from "../field/json";

export interface JsonGame extends JsonIdentifiable {
    batchNr: number;
    competitionSport: JsonCompetitionSport;
    places: JsonGamePlace[];
    field: JsonField | undefined;
    state: number;
    startDateTime: string | undefined;
    refereePriority: number | undefined;
    refereePlaceLocId: string | undefined;
}
