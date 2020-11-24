import { Injectable } from '@angular/core';
import { JsonTeam } from './json';
import { Association } from '../association';
import { Team } from '../team';

@Injectable({
    providedIn: 'root'
})
export class TeamMapper {
    protected cache: TeamMap = new TeamMap();

    constructor() { }

    toObject(json: JsonTeam, association: Association, disableCache?: boolean): Team {
        let team;
        if (disableCache !== true) {
            team = this.cache.get(+json.id);
        }
        if (team === undefined) {
            team = new Team(association, json.name);
            team.setId(json.id);
            this.cache.set(+team.getId(), team);
        }
        this.updateObject(json, team);
        return team;
    }

    updateObject(json: JsonTeam, team: Team) {
        team.setName(json.name);
        team.setAbbreviation(json.abbreviation);
        if (json.imageUrl) {
            team.setImageUrl(json.imageUrl);
        }
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


export class TeamMap extends Map<number, Team> {

}