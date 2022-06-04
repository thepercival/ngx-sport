import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { TeamCompetitor } from '../team';
import { JsonCompetitor } from '../json';
import { TeamMapper } from '../../team/mapper';
import { JsonTeamCompetitor } from './json';
import { StartLocation } from '../startLocation';

@Injectable({
    providedIn: 'root'
})
export class TeamCompetitorMapper {
    constructor(private teamMapper: TeamMapper) { }

    toObject(json: JsonTeamCompetitor, competition: Competition): TeamCompetitor {
        const startLocation = new StartLocation(json.categoryNr, json.pouleNr, json.placeNr);
        const competitor = new TeamCompetitor(competition, startLocation,
            this.teamMapper.toObject(json.team, competition.getAssociation())
        );
        competitor.setId(json.id);
        this.updateObject(json, competitor);
        return competitor;
    }

    updateObject(json: JsonCompetitor, teamCompetitor: TeamCompetitor) {
        json.registered ? teamCompetitor.setRegistered(json.registered) : undefined;
        json.info ? teamCompetitor.setInfo(json.info) : undefined;
    }

    toJson(teamCompetitor: TeamCompetitor): JsonTeamCompetitor {
        return {
            id: teamCompetitor.getId(),
            name: teamCompetitor.getName(),
            registered: teamCompetitor.getRegistered(),
            info: teamCompetitor.getInfo(),
            categoryNr: teamCompetitor.getStartLocation().getCategoryNr(),
            pouleNr: teamCompetitor.getStartLocation().getPouleNr(),
            placeNr: teamCompetitor.getStartLocation().getPlaceNr(),
            team: this.teamMapper.toJson(teamCompetitor.getTeam())
        };
    }
}
