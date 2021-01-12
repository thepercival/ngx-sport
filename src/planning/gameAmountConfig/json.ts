import { JsonCompetitionSport } from "../../competition/sport/json";
import { JsonIdentifiable } from "../../identifiable/json";

export interface JsonGameAmountConfig extends JsonIdentifiable {
    competitionSport: JsonCompetitionSport;
    amount: number;
}