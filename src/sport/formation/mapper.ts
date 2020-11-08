import { Injectable } from '@angular/core';
import { Sport } from '../../sport';
import { Formation } from '../formation';
import { JsonFormation } from './json';
import { FormationLineMapper } from './line/mapper';

@Injectable()
export class FormationMapper {
    constructor(protected lineMapper: FormationLineMapper) { }

    toObject(json: JsonFormation, sport: Sport): Formation {
        const formation = new Formation(sport, json.name);
        json.lines.forEach(jsonLine => this.lineMapper.toObject(jsonLine, formation));
        return formation;
    }

    toJson(formation: Formation): JsonFormation {
        return {
            name: formation.getName(),
            lines: formation.getLines().map(line => this.lineMapper.toJson(line)),
        };
    }
}


