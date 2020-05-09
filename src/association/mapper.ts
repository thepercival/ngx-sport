import { Association } from '../association';
import { Injectable } from '@angular/core';
import { JsonAssociation } from './json';
import { TheCache } from '../cache';

@Injectable({
    providedIn: 'root'
})
export class AssociationMapper {

    constructor() { }

    toObject(json: JsonAssociation, disableCache?: boolean): Association {
        let association;
        if (disableCache !== true) {
            association = TheCache.associations[json.id];
        }
        if (association === undefined) {
            association = new Association(json.name);
            association.setId(json.id);
            TheCache.associations[association.getId()] = association;
        }
        association.setDescription(json.description);
        if (json.parent !== undefined) {
            association.setParent(this.toObject(json.parent, disableCache));
        }
        return association;
    }

    updateObject(json: JsonAssociation, association: Association) {
        association.setDescription(json.description);
        if (json.parent && association.getParent()) {
            this.updateObject(json.parent, association.getParent());
        }
    }

    toJson(association: Association): JsonAssociation {
        return {
            name: association.getName(),
            description: association.getDescription(),
            parent: association.getParent() ? this.toJson(association.getParent()) : undefined
        };
    }
}


