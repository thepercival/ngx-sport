import { JsonLeague } from "../league/json";
import { JsonSeason } from "../season/json";
import { JsonReferee } from "../referee/json";
import { JsonTeamCompetitor } from '../competitor/team/json';
import { JsonCompetitionSport } from "./sport/json";
import { RankingRuleSet } from "../ranking/ruleSet";
import { JsonIdentifiable } from "../identifiable/json";
export interface JsonCompetition extends JsonIdentifiable {
    league: JsonLeague;
    season: JsonSeason;
    referees: JsonReferee[];
    rankingRuleSet: RankingRuleSet;
    startDateTime: string;
    state: number;
    sports: JsonCompetitionSport[];
    teamCompetitors?: JsonTeamCompetitor[];
}