import { JsonIdentifiable } from '../identifiable/json';
import { JsonCompetitionSport } from '../competition/sport/json';
import { JsonField } from "../field/json";
import { JsonReferee } from "../referee/json";
import { JsonPlaceLocation } from "../place/location/json";

export interface JsonGame extends JsonIdentifiable {
    batchNr: number;
    competitionSport: JsonCompetitionSport;
    field: JsonField | undefined;
    referee: JsonReferee | undefined;
    state: number;
    startDateTime: string;
    refereePlace: JsonPlaceLocation | undefined;
}
