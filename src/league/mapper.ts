import { JsonAssociation, AssociationMapper } from '../association/mapper';
import { League } from '../league';
import { SportCache } from '../cache';
import { Injectable } from '@angular/core';

@Injectable()
export class LeagueMapper {
    constructor( private associationMapper: AssociationMapper ) {}

    toObject(json: JsonLeague, league?: League): League {
        if (league === undefined && json.id !== undefined) {
            league = SportCache.leagues[json.id];
        }
        if (league === undefined) {
            league = new League(json.name);
            league.setId(json.id);
            SportCache.leagues[league.getId()] = league;
        }
        league.setAssociation(this.associationMapper.toObject(json.association));
        league.setAbbreviation(json.abbreviation);
        league.setSport(json.sport);
        return league;
    }

    toJson(league: League): JsonLeague {
        return {
            id: league.getId(),
            name: league.getName(),
            abbreviation: league.getAbbreviation(),
            association: this.associationMapper.toJson(league.getAssociation()),
            sport: league.getSport()
        };
    }
}

export interface JsonLeague {
    id?: number;
    association: JsonAssociation;
    name: string;
    abbreviation?: string;
    sport: string;
}
