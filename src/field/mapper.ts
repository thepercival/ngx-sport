import { Injectable } from '@angular/core';
import { CompetitionSport } from 'src/competition/sport';

import { Field } from '../field';
import { JsonField } from './json';

@Injectable({
    providedIn: 'root'
})
export class FieldMapper {

    constructor() { }

    toObject(json: JsonField, competitionSport: CompetitionSport, field?: Field): Field {
        if (field === undefined) {
            field = new Field(competitionSport, json.priority);
        }
        field.setId(json.id);
        field.setName(json.name);
        return field;
    }

    toJson(field: Field): JsonField {
        return {
            id: field.getId(),
            priority: field.getPriority(),
            name: field.getName()
        };
    }
}

export interface FieldMap {
    [key: number]: Field;
}

