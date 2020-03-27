import { JsonAssociation, AssociationMapper } from '../association/mapper';
import { League } from '../league';
import { TheCache } from '../cache';
import { Injectable } from '@angular/core';

@Injectable()
export class LeagueMapper {
    constructor(private associationMapper: AssociationMapper) { }

    toObject(json: JsonLeague, league?: League): League {
        if (league === undefined && json.id !== undefined) {
            league = TheCache.leagues[json.id];
        }
        if (league === undefined) {
            league = new League(json.name);
            league.setId(json.id);
            TheCache.leagues[league.getId()] = league;
        }
        league.setAssociation(this.associationMapper.toObject(json.association));
        league.setAbbreviation(json.abbreviation);
        return league;
    }

    toJson(league: League): JsonLeague {
        return {
            name: league.getName(),
            abbreviation: league.getAbbreviation(),
            association: this.associationMapper.toJson(league.getAssociation()),
        };
    }
}

export interface JsonLeague {
    id?: string | number;
    association: JsonAssociation;
    name: string;
    abbreviation?: string;
}
