import { JsonLeague } from "../league/json";
import { JsonSeason } from "../season/json";
import { JsonReferee } from "../referee/json";
import { JsonSportConfig } from "../sport/config/json";
import { JsonTeamCompetitor } from '../competitor/team/json';

export interface JsonCompetition {
    id: string | number;
    league: JsonLeague;
    season: JsonSeason;
    referees: JsonReferee[];
    ruleSet: number;
    startDateTime: string;
    state: number;
    sportConfigs: JsonSportConfig[];
    teamCompetitors?: JsonTeamCompetitor[];
}