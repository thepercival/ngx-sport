import { Association } from '../association';
import { SportCache } from '../cache';
import { Injectable } from '@angular/core';

@Injectable()
export class AssociationMapper {

    constructor() {}

    toObject(json: JsonAssociation, association?: Association): Association {
        if (association === undefined && json.id !== undefined) {
            association = SportCache.associations[json.id];
        }
        if (association === undefined) {
            association = new Association(json.name);
            association.setId(json.id);
            SportCache.associations[association.getId()] = association;
        }
        association.setDescription(json.description);

        if (json.parent !== undefined) {
            association.setParent(this.toObject(json.parent, association ? association.getParent() : undefined));
        }
        return association;
    }

    toJson(object: Association): JsonAssociation {
        return {
            id: object.getId(),
            name: object.getName(),
            description: object.getDescription(),
            parent: object.getParent() ? this.toJson(object.getParent()) : undefined
        };
    }
}

export interface JsonAssociation {
    id?: number;
    name: string;
    description?: string;
    parent?: JsonAssociation;
}
