import { JsonSport } from "../../sport/json";
import { JsonField } from "../../field/json";
import { JsonIdentifiable } from "src/identifiable/json";

export interface JsonCompetitionSport extends JsonIdentifiable {
    sport: JsonSport;
    fields: JsonField[];
}