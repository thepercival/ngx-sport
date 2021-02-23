import { JsonGamePlace } from "./place/json";
import { JsonIdentifiable } from '../identifiable/json';
import { JsonCompetitionSport } from '../competition/sport/json';
import { JsonField } from "../field/json";
import { JsonReferee } from "../referee/json";

export interface JsonGame extends JsonIdentifiable {
    batchNr: number;
    competitionSport: JsonCompetitionSport;
    places: JsonGamePlace[];
    field: JsonField | undefined;
    referee: JsonReferee | undefined;
    state: number;
    startDateTime: string | undefined;
    refereePlaceLocId: string | undefined;
}
