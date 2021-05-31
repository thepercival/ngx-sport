import { JsonAgainstQualifyConfig } from "../qualify/againstConfig/json";
import { JsonScoreConfig } from "../score/config/json";
import { JsonPoule } from "../poule/json";
import { JsonQualifyGroup } from "../qualify/group/json";
import { JsonIdentifiable } from "../identifiable/json";

export interface JsonRound extends JsonIdentifiable {
    name?: string;
    poules: JsonPoule[];
    qualifyGroups: JsonQualifyGroup[];
    scoreConfigs?: JsonScoreConfig[];
    againstQualifyConfigs?: JsonAgainstQualifyConfig[];
}