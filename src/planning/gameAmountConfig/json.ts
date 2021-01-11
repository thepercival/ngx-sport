import { JsonCompetitionSport } from "src/competition/sport/json";
import { JsonIdentifiable } from "src/identifiable/json";

export interface JsonGameAmountConfig extends JsonIdentifiable {
    competitionSport: JsonCompetitionSport;
    amount: number;
}