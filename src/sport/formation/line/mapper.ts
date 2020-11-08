import { Injectable } from '@angular/core';
import { Formation } from '../../formation';
import { FormationLine } from '../line';
import { JsonFormationLine } from './json';


@Injectable()
export class FormationLineMapper {
    constructor() { }

    toObject(json: JsonFormationLine, formation: Formation): FormationLine {
        return new FormationLine(formation, json.number, json.nrOfPlayers);
    }

    toJson(formationLine: FormationLine): JsonFormationLine {
        return {
            number: formationLine.getNumber(),
            nrOfPlayers: formationLine.getNrOfPlayers()
        };
    }
}


