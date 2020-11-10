import { Injectable } from '@angular/core';
import { JsonTeam } from './json';
import { Association } from '../association';
import { Team } from '../team';

@Injectable({
    providedIn: 'root'
})
export class TeamMapper {
    protected cache: TeamMap = {};

    constructor() { }

    toObject(json: JsonTeam, association: Association, disableCache?: boolean): Team {
        let team;
        if (disableCache !== true) {
            team = this.cache[json.id];
        }
        if (team === undefined) {
            team = new Team(association, json.name);
            team.setId(json.id);
            this.cache[team.getId()] = team;
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
            id: team.getId(),
            name: team.getName(),
            abbreviation: team.getAbbreviation(),
            imageUrl: team.getImageUrl()
        };
    }
}

interface TeamMap {
    [key: string]: Team;
}