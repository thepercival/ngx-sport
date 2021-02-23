import { Injectable } from '@angular/core';
import { CompetitionSport } from '../competition/sport';

import { Field } from '../field';
import { JsonField } from './json';

@Injectable({
    providedIn: 'root'
})
export class FieldMapper {
    protected cache: FieldMap = {};

    toNewObject(json: JsonField, competitionSport: CompetitionSport): Field {
        const field = new Field(competitionSport, json.priority);
        field.setId(json.id);
        this.cache[field.getId()] = field;
        return this.updateObject(json, field);;
    }

    toExistingObject(json: JsonField): Field {
        const field = this.cache[json.id];
        if (field === undefined) {
            throw Error('field does not exists in mapper-cache');
        }
        return this.updateObject(json, field);
    }

    protected updateObject(json: JsonField, field: Field): Field {
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
    [key: string]: Field;
}

