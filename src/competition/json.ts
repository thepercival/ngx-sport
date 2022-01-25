import { JsonLeague } from "../league/json";
import { JsonSeason } from "../season/json";
import { JsonReferee } from "../referee/json";
import { JsonTeamCompetitor } from '../competitor/team/json';
import { JsonCompetitionSport } from "./sport/json";
import { AgainstRuleSet } from "../ranking/againstRuleSet";
import { JsonIdentifiable } from "../identifiable/json";
export interface JsonCompetition extends JsonIdentifiable {
    league: JsonLeague;
    season: JsonSeason;
    referees: JsonReferee[];
    againstRuleSet: AgainstRuleSet;
    startDateTime: string;
    sports: JsonCompetitionSport[];
    teamCompetitors?: JsonTeamCompetitor[];
}