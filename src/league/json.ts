import { JsonAssociation } from "../association/json";

export interface JsonLeague {
    id: string | number;
    association: JsonAssociation;
    name: string;
    abbreviation?: string;
}