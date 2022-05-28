import { CompetitorBase, Competitor } from '../competitor';
import { Competition } from '../competition';
import { Team } from '../team';
import { StartLocation } from './startLocation';

export class TeamCompetitor extends CompetitorBase implements Competitor {
    constructor(competition: Competition, startLocation: StartLocation, private team: Team) {
        super(competition, startLocation);
        this.competition.getTeamCompetitors().push(this);
    }

    getName(): string {
        return this.team.getName();
    }

    getTeam(): Team {
        return this.team;
    }
}
