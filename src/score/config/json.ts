import { JsonCompetitionSport } from "src/competition/sport/json";
import { JsonIdentifiable } from "src/identifiable/json";

export interface JsonScoreConfig extends JsonIdentifiable {
    competitionSport: JsonCompetitionSport;
    direction: number;
    maximum: number;
    enabled: boolean;
    next?: JsonScoreConfig;
}