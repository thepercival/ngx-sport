import { JsonIdentifiable } from '../identifiable/json';
import { JsonCompetitionSport } from '../competition/sport/json';
import { JsonField } from "../field/json";
import { JsonReferee } from "../referee/json";
import { JsonPlace } from '../place/json';

export interface JsonGame extends JsonIdentifiable {
    batchNr: number;
    competitionSport: JsonCompetitionSport;
    field: JsonField | undefined;
    referee: JsonReferee | undefined;
    state: number;
    startDateTime: string;
    refereeStructureLocation: string | undefined;
}
