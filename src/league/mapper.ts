import { AssociationMapper } from '../association/mapper';
import { League } from '../league';
import { Injectable } from '@angular/core';
import { JsonLeague } from './json';

@Injectable({
    providedIn: 'root'
})
export class LeagueMapper {
    protected cache: LeagueMap = {};

    constructor(private associationMapper: AssociationMapper) { }

    toObject(json: JsonLeague, disableCache?: boolean): League {
        let league;
        if (disableCache !== true) {
            league = this.cache[json.id];
        }
        if (league === undefined) {
            league = new League(this.associationMapper.toObject(json.association), json.name);
            league.setId(json.id);
            this.cache[league.getId()] = league;
        }
        this.updateObject(json, league);
        return league;
    }

    updateObject(json: JsonLeague, league: League) {
        league.setAbbreviation(json.abbreviation);
    }

    toJson(league: League): JsonLeague {
        return {
            id: league.getId(),
            name: league.getName(),
            abbreviation: league.getAbbreviation(),
            association: this.associationMapper.toJson(league.getAssociation()),
        };
    }
}

interface LeagueMap {
    [key: string]: League;
}