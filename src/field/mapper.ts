import { Injectable } from '@angular/core';

import { TheCache } from '../cache';
import { Competition } from '../competition';
import { Field } from '../field';

@Injectable()
export class FieldMapper {

    constructor() { }

    toObject(json: JsonField, competition: Competition, field?: Field): Field {
        if (field === undefined) {
            field = new Field(competition, json.number);
        }
        field.setId(json.id);
        field.setName(json.name);
        field.setSport(TheCache[json.sportName]);
        return field;
    }

    toJson(field: Field): JsonField {
        return {
            id: field.getId(),
            number: field.getNumber(),
            name: field.getName(),
            sportName: field.getSport().getName()
        };
    }
}

export interface JsonField {
    id?: number;
    number: number;
    name: string;
    sportName: string;
}
