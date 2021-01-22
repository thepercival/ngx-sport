import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { SportMapper } from '../../sport/mapper';
import { FieldMapper } from '../../field/mapper';
import { JsonCompetitionSport } from './json';
import { CompetitionSport } from '../sport';

@Injectable({
    providedIn: 'root'
})
export class CompetitionSportMapper {
    protected cache: CompetitionSportMap = {};

    constructor(private sportMapper: SportMapper, private fieldMapper: FieldMapper) {
        // console.log('CompetitionSportMapper::constructor');
    }

    toObject(json: JsonCompetitionSport, competition: Competition, disableCache?: boolean): CompetitionSport {
        if (disableCache !== true && this.cache[json.id]) {
            return this.cache[json.id];
        }
        const sport = this.sportMapper.toObject(json.sport);
        const competitionSport = new CompetitionSport(sport, competition);
        json.fields.map(jsonField => this.fieldMapper.toObject(jsonField, competitionSport));
        competitionSport.setId(json.id);
        this.cache[competitionSport.getId()] = competitionSport;
        return competitionSport;
    }

    toJson(config: CompetitionSport): JsonCompetitionSport {
        return {
            id: config.getId(),
            sport: this.sportMapper.toJson(config.getSport()),
            fields: config.getFields().map(field => this.fieldMapper.toJson(field)),
        };
    }
}

export interface CompetitionSportMap {
    [key: string]: CompetitionSport;
}
