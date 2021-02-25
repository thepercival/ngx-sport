import { Injectable } from '@angular/core';
import { CompetitionSport } from '../competition/sport';

import { Field } from '../field';
import { JsonField } from './json';

@Injectable({
    providedIn: 'root'
})
export class FieldMapper {
    toObject(json: JsonField, competitionSport: CompetitionSport): Field {
        const existingField: Field | undefined = this.getFromCompetitionSport(json.id, competitionSport);
        const field: Field = existingField ? existingField : new Field(competitionSport, json.priority);
        field.setId(json.id);
        return this.updateObject(json, field);
    }

    getFromCompetitionSport(id: string | number, competitionSport: CompetitionSport): Field | undefined {
        return competitionSport.getFields().find((fieldIt: Field) => fieldIt.getId() === id);
    }

    updateObject(json: JsonField, field: Field): Field {
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

