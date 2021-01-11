import { JsonLeague } from "../league/json";
import { JsonSeason } from "../season/json";
import { JsonReferee } from "../referee/json";
import { JsonTeamCompetitor } from '../competitor/team/json';
import { JsonCompetitionSport } from "./sport/json";

export interface JsonCompetition {
    id: string | number;
    league: JsonLeague;
    season: JsonSeason;
    referees: JsonReferee[];
    ruleSet: number;
    startDateTime: string;
    state: number;
    sports: JsonCompetitionSport[];
    teamCompetitors?: JsonTeamCompetitor[];
}