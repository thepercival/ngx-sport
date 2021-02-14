
import { JsonCompetitionSport } from "../../competition/sport/json";
import { JsonIdentifiable } from "../../identifiable/json";

export interface JsonScoreConfig extends JsonIdentifiable {
    competitionSport: JsonCompetitionSport;
    direction: number;
    maximum: number;
    enabled: boolean;
    next?: JsonScoreConfig;
    isFirst: boolean;
}