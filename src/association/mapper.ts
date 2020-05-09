import { Association } from '../association';
import { Injectable } from '@angular/core';
import { JsonAssociation } from './json';

@Injectable({
    providedIn: 'root'
})
export class AssociationMapper {

    constructor() { }

    toObject(json: JsonAssociation, association?: Association): Association {
        if (association === undefined) {
            association = new Association(json.name);
            association.setId(json.id);
        }
        association.setDescription(json.description);
        if (json.parent !== undefined) {
            association.setParent(this.toObject(json.parent, association ? association.getParent() : undefined));
        }
        return association;
    }

    toJson(association: Association): JsonAssociation {
        return {
            name: association.getName(),
            description: association.getDescription(),
            parent: association.getParent() ? this.toJson(association.getParent()) : undefined
        };
    }
}


