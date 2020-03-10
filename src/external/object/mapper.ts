import { Attacher } from '../attacher';
import { Injectable } from '@angular/core';
import { TheCache } from '../../cache';

@Injectable()
export class AttacherMapper {

    constructor() { }

    toObject(json: JsonExternalObject, attacher?: Attacher): Attacher {
        if (attacher === undefined && json.id !== undefined) {
            attacher = TheCache.externals[json.id];
        }
        if (attacher === undefined) {
            attacher = new Attacher(
                json.importableObjectId,
                json.externalSourceId);
            attacher.setId(json.id);
            attacher.setExternalId(json.externalId);
            TheCache.externals[attacher.getId()] = attacher;
        }
        return attacher;
    }

    toJson(attacher: Attacher): JsonExternalObject {
        return {
            id: attacher.getId(),
            importableObjectId: attacher.getImportableObjectId(),
            externalSourceId: attacher.getExternalSourceId(),
            externalId: attacher.getExternalId()
        };

    }
}

export interface JsonExternalObject {
    id?: number;
    importableObjectId: number;
    externalSourceId: number;
    externalId: string;
}

