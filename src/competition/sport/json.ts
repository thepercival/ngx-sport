import { JsonSport } from "../../sport/json";
import { JsonField } from "../../field/json";
import { JsonIdentifiable } from "../../identifiable/json";
import { JsonPersistSportVariant } from "../../sport/variant/json";

export interface JsonCompetitionSport extends JsonIdentifiable, JsonPersistSportVariant {
    sport: JsonSport;
    fields: JsonField[];
}