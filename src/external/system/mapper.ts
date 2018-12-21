import { ExternalSystem } from '../system';
import { Injectable } from '@angular/core';

@Injectable()
export class ExternalSystemMapper {

    constructor() {}

    toObject(json: JsonExternalSystem, externalSystem?: ExternalSystem): ExternalSystem {
        if (externalSystem === undefined) {
            externalSystem = new ExternalSystem(json.name);
        }
        externalSystem.setId(json.id);
        externalSystem.setWebsite(json.website);
        externalSystem.setUsername(json.username);
        externalSystem.setPassword(json.password);
        externalSystem.setApiurl(json.apiurl);
        externalSystem.setApikey(json.apikey);
        return externalSystem;
    }

    toJson(object: ExternalSystem): JsonExternalSystem {
        return {
            id: object.getId(),
            name: object.getName(),
            website: object.getWebsite(),
            username: object.getUsername(),
            password: object.getPassword(),
            apiurl: object.getApiurl(),
            apikey: object.getApikey()
        };
    }
}

export interface JsonExternalSystem {
    id?: number;
    name: string;
    website?: string;
    username?: string;
    password?: string;
    apiurl?: string;
    apikey?: string;
}
