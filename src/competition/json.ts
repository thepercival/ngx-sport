import { JsonLeague } from "../league/json";
import { JsonSeason } from "../season/json";
import { JsonSport } from "../sport/json";
import { JsonField } from "../field/json";
import { JsonReferee } from "../referee/json";
import { JsonSportConfig } from "../sport/config/json";

export interface JsonCompetition {
    id?: string | number;
    league: JsonLeague;
    season: JsonSeason;
    sports?: JsonSport[];
    fields: JsonField[];
    referees: JsonReferee[];
    ruleSet: number;
    startDateTime: string;
    state: number;
    sportConfigs: JsonSportConfig[];
}