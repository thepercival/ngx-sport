import { Injectable } from '@angular/core';

import { Field } from '../field';
import { JsonField } from './json';
import { SportConfig } from '../sport/config';

@Injectable({
    providedIn: 'root'
})
export class FieldMapper {

    constructor() { }

    toObject(json: JsonField, sportConfig: SportConfig, field?: Field): Field {
        if (field === undefined) {
            field = new Field(sportConfig, json.priority);
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

