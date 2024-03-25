import { JsonIdentifiable } from '../identifiable/json';
import { JsonField } from "../field/json";
import { JsonReferee } from "../referee/json";
import { GameState } from './state';

export interface JsonGame extends JsonIdentifiable {
    batchNr: number;
    competitionSportId: string|number;
    field: JsonField | undefined;
    referee: JsonReferee | undefined;
    state: GameState;
    startDateTime: string;
    refereeStructureLocation: string | undefined;
}
