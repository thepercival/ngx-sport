import { AssociationMapper } from '../association/mapper';
import { League } from '../league';
import { Injectable } from '@angular/core';
import { JsonLeague } from './json';

@Injectable({
    providedIn: 'root'
})
export class LeagueMapper {
    constructor(private associationMapper: AssociationMapper) { }

    toObject(json: JsonLeague, league?: League): League {
        if (league === undefined) {
            league = new League(json.name);
            league.setId(json.id);
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
