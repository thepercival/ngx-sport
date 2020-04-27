import { JsonPoule } from "../poule/json";
import { JsonQualifyGroup } from "../qualify/group/json";

export interface JsonRound {
    id?: number;
    name?: string;
    poules: JsonPoule[];
    qualifyGroups: JsonQualifyGroup[];
}