import { Association } from '../association';
import { TheCache } from '../cache';
import { Injectable } from '@angular/core';
import { SportMapper, JsonSport } from '../sport/mapper';
import { JsonCountConfig, CountConfigMapper } from '../config/count/mapper';

@Injectable()
export class AssociationMapper {

    constructor( private sportMapper: SportMapper, private countConfigMapper: CountConfigMapper) {}

    toObject(json: JsonAssociation, association?: Association): Association {
        if (association === undefined && json.id !== undefined) {
            association = TheCache.associations[json.id];
        }
        if (association === undefined) {
            association = new Association(json.name);
            association.setId(json.id);
            TheCache.associations[association.getId()] = association;
        }
        association.setDescription(json.description);
        association.setSport(this.sportMapper.toObject(json.sport));
        association.setCountConfig(this.countConfigMapper.toObject(json.countConfig, association));
        if (json.parent !== undefined) {
            association.setParent(this.toObject(json.parent, association ? association.getParent() : undefined));
        }
        return association;
    }

    toJson(association: Association): JsonAssociation {
        return {
            id: association.getId(),
            name: association.getName(),
            description: association.getDescription(),
            sport: this.sportMapper.toJson(association.getSport()),
            countConfig: this.countConfigMapper.toJson(association.getCountConfig()),
            parent: association.getParent() ? this.toJson(association.getParent()) : undefined
        };
    }
}

export interface JsonAssociation {
    id?: number;
    name: string;
    description?: string;
    sport: JsonSport;
    countConfig: JsonCountConfig;
    parent?: JsonAssociation;
}
