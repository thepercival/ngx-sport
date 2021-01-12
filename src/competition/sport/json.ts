import { JsonSport } from "../../sport/json";
import { JsonField } from "../../field/json";
import { JsonIdentifiable } from "../../identifiable/json";

export interface JsonCompetitionSport extends JsonIdentifiable {
    sport: JsonSport;
    fields: JsonField[];
}