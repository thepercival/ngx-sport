import { AssociationMapper } from '../association/mapper';
import { League } from '../league';
import { Injectable } from '@angular/core';
import { JsonLeague } from './json';
import { TheCache } from '../cache';

@Injectable({
    providedIn: 'root'
})
export class LeagueMapper {
    constructor(private associationMapper: AssociationMapper) { }

    toObject(json: JsonLeague, disableCache?: boolean): League {
        let league;
        if (disableCache !== true) {
            league = TheCache.leagues[json.id];
        }
        if (league === undefined) {
            league = new League(json.name);
            league.setId(json.id);
            TheCache.leagues[league.getId()] = league;
        }
        this.updateObject(json, league);
        return league;
    }

    updateObject(json: JsonLeague, league: League) {
        league.setAssociation(this.associationMapper.toObject(json.association));
        league.setAbbreviation(json.abbreviation);
    }

    toJson(league: League): JsonLeague {
        return {
            name: league.getName(),
            abbreviation: league.getAbbreviation(),
            association: this.associationMapper.toJson(league.getAssociation()),
        };
    }
}
