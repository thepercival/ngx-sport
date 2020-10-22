import { Injectable } from '@angular/core';

import { Association } from '../../association';
import { Competitor } from '../../competitor';
import { TheCache } from '../../cache';
import { Competition } from '../../competition';
import { TeamCompetitor } from '../team';
import { JsonCompetitor } from '../json';
import { TeamMapper } from '../../team/mapper';
import { JsonTeamCompetitor } from './json';

@Injectable({
    providedIn: 'root'
})
export class TeamCompetitorMapper {
    constructor(private teamMapper: TeamMapper) { }

    toObject(json: JsonTeamCompetitor, competition: Competition, disableCache?: boolean): TeamCompetitor {

        const competitor = new TeamCompetitor(competition, json.pouleNr, json.placeNr,
            this.teamMapper.toObject(json.team, competition.getLeague().getAssociation())
        );
        competitor.setId(json.id);
        this.updateObject(json, competitor);
        return competitor;
    }

    updateObject(json: JsonCompetitor, teamCompetitor: TeamCompetitor) {
        teamCompetitor.setRegistered(json.registered);
        teamCompetitor.setInfo(json.info);
    }

    toJson(teamCompetitor: TeamCompetitor): JsonTeamCompetitor {
        return {
            name: teamCompetitor.getName(),
            registered: teamCompetitor.getRegistered(),
            info: teamCompetitor.getInfo(),
            pouleNr: teamCompetitor.getPouleNr(),
            placeNr: teamCompetitor.getPlaceNr(),
            team: this.teamMapper.toJson(teamCompetitor.getTeam())
        };
    }
}
