
import { JsonIdentifiable } from "../../identifiable/json";

export interface JsonScoreConfig extends JsonIdentifiable {
    competitionSportId: string|number;
    direction: number;
    maximum: number;
    enabled: boolean;
    next?: JsonScoreConfig;
    isFirst: boolean;
}