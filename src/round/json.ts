import { JsonQualifyAgainstConfig } from "../qualify/againstConfig/json";
import { JsonScoreConfig } from "../score/config/json";
import { JsonPoule } from "../poule/json";
import { JsonQualifyGroup } from "../qualify/group/json";

export interface JsonRound {
    id: number;
    name?: string;
    poules: JsonPoule[];
    qualifyGroups: JsonQualifyGroup[];
    scoreConfigs?: JsonScoreConfig[];
    qualifyAgainstConfigs?: JsonQualifyAgainstConfig[];
}