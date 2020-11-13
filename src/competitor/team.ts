import { Competitor, CompetitorBase } from '.';
import { Competition } from '../competition';
import { Team } from '../team';

export class TeamCompetitor extends CompetitorBase implements Competitor {
    constructor(competition: Competition, pouleNr: number, placeNr: number, private team: Team) {
        super(competition, pouleNr, placeNr);
        this.competition.getTeamCompetitors().push(this);
    }

    getName(): string {
        return this.team.getName();
    }

    getTeam(): Team {
        return this.team;
    }
}
