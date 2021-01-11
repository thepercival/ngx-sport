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
    constructor(private sportMapper: SportMapper, private fieldMapper: FieldMapper) { }

    toObject(json: JsonCompetitionSport, competition: Competition, competitionSport?: CompetitionSport): CompetitionSport {
        if (competitionSport === undefined) {
            const sport = this.sportMapper.toObject(json.sport);
            const newCompetitionSport = new CompetitionSport(sport, competition);
            json.fields.map(jsonField => this.fieldMapper.toObject(jsonField, newCompetitionSport));
            competitionSport = newCompetitionSport;
        }
        competitionSport.setId(json.id);
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
