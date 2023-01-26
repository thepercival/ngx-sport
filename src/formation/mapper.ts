import { Injectable } from '@angular/core';

import { Formation } from '../formation';
import { JsonFormation } from './json';
import { FormationLine } from './line';
import { JsonFormationLine } from './line/json';

@Injectable({
    providedIn: 'root'
})
export class FormationMapper {
    toObject(json: JsonFormation): Formation {
        const formation = new Formation(
            json.lines.map((jsonLine: JsonFormationLine) => new FormationLine(jsonLine.number, jsonLine.nrOfPersons))
        );
        
        return formation;
    }

    toJson(formation: Formation): JsonFormation {
        return {
            lines: formation.getLines().map((line: FormationLine): JsonFormationLine => {
                return { number: line.getNumber(), nrOfPersons: line.getNrOfPersons() };
            })
        };
    }
}