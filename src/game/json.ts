import { JsonIdentifiable } from '../identifiable/json';
import { JsonStructureLocation } from '../structure/location/json';
import { GameState } from './state';

export interface JsonGame extends JsonIdentifiable {
    batchNr: number;
    competitionSportId: string|number;
    fieldId: number | string | undefined;
    refereeId: number | string | undefined;
    state: GameState;
    startDateTime: string;
    refereeStructureLocation: JsonStructureLocation | undefined;
}
