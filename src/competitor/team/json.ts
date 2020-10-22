
import { JsonTeam } from "../../team/json";
import { JsonCompetitor } from "../json";

export interface JsonTeamCompetitor extends JsonCompetitor {
    team: JsonTeam;
}