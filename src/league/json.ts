import { JsonAssociation } from "../association/json";
import { JsonIdentifiable } from "../identifiable/json";

export interface JsonLeague extends JsonIdentifiable {
    association: JsonAssociation;
    name: string;
    abbreviation?: string;
}