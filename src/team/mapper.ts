import { Injectable } from '@angular/core';
import { JsonTeam } from './json';
import { Association } from '../association';
import { TheCache } from '../cache';
import { Team } from '../team';

@Injectable({
    providedIn: 'root'
})
export class TeamMapper {
    constructor() { }

    toObject(json: JsonTeam, association: Association, disableCache?: boolean): Team {
        let team;
        if (disableCache !== true) {
            team = TheCache.teams[json.id];
        }
        if (team === undefined) {
            team = new Team(association, json.name);
            team.setId(json.id);
            TheCache.teams[team.getId()] = team;
        }
        this.updateObject(json, team);
        return team;
    }

    updateObject(json: JsonTeam, team: Team) {
        team.setName(json.name);
        team.setAbbreviation(json.abbreviation);
    }

    toJson(team: Team): JsonTeam {
        return {
            name: team.getName(),
            abbreviation: team.getAbbreviation(),
            imageUrl: team.getImageUrl()
        };
    }
}
