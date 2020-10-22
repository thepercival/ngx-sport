import { Competitor, CompetitorBase } from '../competitor';
import { Competition } from '../competition';
import { Team } from '../team';

export class TeamCompetitor extends CompetitorBase implements Competitor {
    constructor(competition: Competition, pouleNr: number, placeNr: number, private team: Team) {
        super(competition, pouleNr, placeNr);
    }

    getName(): string {
        return this.team.getName();
    }

    getTeam(): Team {
        return this.getTeam();
    }
}
