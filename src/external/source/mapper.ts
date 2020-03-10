import { ExternalSource } from '../source';
import { Injectable } from '@angular/core';

@Injectable()
export class ExternalSourceMapper {

    constructor() { }

    toObject(json: JsonExternalSource, externalSource?: ExternalSource): ExternalSource {
        if (externalSource === undefined) {
            externalSource = new ExternalSource(json.name);
        }
        externalSource.setId(json.id);
        externalSource.setWebsite(json.website);
        externalSource.setUsername(json.username);
        externalSource.setPassword(json.password);
        externalSource.setApiurl(json.apiurl);
        externalSource.setApikey(json.apikey);
        return externalSource;
    }

    toJson(object: ExternalSource): JsonExternalSource {
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

export interface JsonExternalSource {
    id?: number;
    name: string;
    website?: string;
    username?: string;
    password?: string;
    apiurl?: string;
    apikey?: string;
}
