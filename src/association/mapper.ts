import { Association } from '../association';
import { Injectable } from '@angular/core';
import { JsonAssociation } from './json';

@Injectable({
    providedIn: 'root'
})
export class AssociationMapper {

    protected cache: AssociationMap = {};

    constructor() { }

    toObject(json: JsonAssociation, disableCache?: boolean): Association {
        let association;
        if (disableCache !== true) {
            association = this.cache[json.id];
        }
        if (association === undefined) {
            association = new Association(json.name);
            association.setId(json.id);
            this.cache[association.getId()] = association;
        }
        association.setDescription(json.description);
        if (json.parent !== undefined) {
            association.setParent(this.toObject(json.parent, disableCache));
        }
        return association;
    }

    updateObject(json: JsonAssociation, association: Association) {
        json.description ? association.setDescription(json.description) : undefined;
        const parent = association.getParent();
        if (json.parent && parent) {
            this.updateObject(json.parent, parent);
        }
    }

    toJson(association: Association): JsonAssociation {
        const parent = association.getParent();
        return {
            id: association.getId(),
            name: association.getName(),
            description: association.getDescription(),
            parent: parent ? this.toJson(parent) : undefined
        };
    }
}

interface AssociationMap {
    [key: string]: Association;
}