import { Injectable } from '@angular/core';
import { CompetitionSport } from '../competition/sport';

import { Field } from '../field';
import { JsonField } from './json';

@Injectable({
    providedIn: 'root'
})
export class FieldMapper {
    protected cache: FieldMap = {};

    constructor() { }

    toObject(json: JsonField, competitionSport: CompetitionSport, disableCache?: boolean): Field {
        if (disableCache !== true && this.cache[json.id]) {
            return this.cache[json.id];
        }
        const field = new Field(competitionSport, json.priority);
        field.setId(json.id);
        field.setName(json.name);
        this.cache[field.getId()] = field;
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
    [key: string]: Field;
}

