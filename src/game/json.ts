import { JsonSport } from 'src/sport/json';
import { JsonGamePlace } from "./place/json";
import { JsonIdentifiable } from 'src/identifiable/json';
import { JsonCompetitionSport } from 'src/competition/sport/json';

export interface JsonGame extends JsonIdentifiable {
    batchNr: number;
    competitionSport: JsonCompetitionSport;
    places: JsonGamePlace[];
    fieldPriority: number | undefined;
    state: number;
    startDateTime: string | undefined;
    refereePriority: number | undefined;
    refereePlaceLocId: string | undefined;
}
