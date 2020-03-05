import { ExternalObject } from '../object';
import { Injectable } from '@angular/core';
import { TheCache } from '../../cache';

@Injectable()
export class ExternalObjectMapper {

    constructor() { }

    toObject(json: JsonExternalObject, externalObject?: ExternalObject): ExternalObject {
        if (externalObject === undefined && json.id !== undefined) {
            externalObject = TheCache.externals[json.id];
        }
        if (externalObject === undefined) {
            externalObject = new ExternalObject(
                json.importableObjectId,
                json.externalSystemId);
            externalObject.setId(json.id);
            externalObject.setExternalId(json.externalId);
            TheCache.externals[externalObject.getId()] = externalObject;
        }
        return externalObject;
    }

    toJson(externalObject: ExternalObject): JsonExternalObject {
        return {
            id: externalObject.getId(),
            importableObjectId: externalObject.getImportableObjectId(),
            externalSystemId: externalObject.getExternalSystemId(),
            externalId: externalObject.getExternalId()
        };

    }
}

export interface JsonExternalObject {
    id?: number;
    importableObjectId: number;
    externalSystemId: number;
    externalId: string;
}

