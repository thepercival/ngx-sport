import { Team } from '../team';
import { Association } from '../association';
import { SportCache } from '../cache';
import { Injectable } from '@angular/core';

@Injectable()
export class TeamMapper {
    constructor() {}

    toObject(json: JsonTeam, association: Association, team?: Team): Team {
        if (team === undefined && json.id !== undefined) {
            team = SportCache.teams[json.id];
        }
        if (team === undefined) {
            team = new Team(association, json.name);
            team.setId(json.id);
            SportCache.teams[team.getId()] = team;
        }
        team.setAbbreviation(json.abbreviation);
        team.setInfo(json.info);
        team.setImageUrl(json.imageUrl);
        return team;
    }

    toJson(team: Team): JsonTeam {
        return {
            id: team.getId(),
            name: team.getName(),
            abbreviation: team.getAbbreviation(),
            info: team.getInfo(),
            imageUrl: team.getImageUrl()
        };
    }
}

export interface JsonTeam {
    id?: number;
    name?: string;
    abbreviation?: string;
    info?: string;
    imageUrl?: string;
}
