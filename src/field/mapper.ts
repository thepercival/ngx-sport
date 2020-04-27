import { Injectable } from '@angular/core';

import { Competition } from '../competition';
import { Field } from '../field';
import { SportMapper } from '../sport/mapper';
import { JsonField } from './json';

@Injectable()
export class FieldMapper {

    constructor(private sportMapper: SportMapper) { }

    toObject(json: JsonField, competition: Competition, field?: Field): Field {
        if (field === undefined) {
            field = new Field(competition, json.number);
        }
        field.setId(json.id);
        field.setName(json.name);
        field.setSport(this.sportMapper.toObject(json.sport));
        return field;
    }

    toJson(field: Field): JsonField {
        return {
            id: field.getId(),
            number: field.getNumber(),
            name: field.getName(),
            sport: this.sportMapper.toJson(field.getSport())
        };
    }
}

