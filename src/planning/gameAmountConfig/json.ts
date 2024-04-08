import { JsonIdentifiable } from "../../identifiable/json";

export interface JsonGameAmountConfig extends JsonIdentifiable {
    competitionSportId: string|number;
    amount: number;
}