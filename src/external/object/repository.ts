import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { SportRepository } from '../../repository';
import { ExternalObject, ImportableObject } from '../object';
import { ExternalSystem } from '../system';
import { ExternalSystemRepository } from '../system/repository';

@Injectable()
export class ExternalObjectRepository extends SportRepository {

    private urlPostfix;

    constructor(
        private http: HttpClient,
        private externalSystemRepository: ExternalSystemRepository,
        router: Router) {
        super(router);
    }

    getUrl(): string {
        return super.getApiUrl() + 'voetbal/' + this.urlPostfix;
    }

    setUrlpostfix(importableObjectRepository) {
        this.urlPostfix = 'external/' + importableObjectRepository.getUrlpostfix();
    }


    // getObjects(importableObjectRepository: any): Observable<ExternalObject[]> {
    //     const url = this.url + '/' + importableObjectRepository.getUrlpostfix();
    //     return this.http.get(url, { headers: super.getHeaders() }).pipe(
    //         map((res) => {
    //             return this.jsonArrayToObject(res, importableObjectRepository);
    //         }),
    //         catchError((err) => this.handleError(err))
    //     );
    // }

    // haal object op, dan importableObjectId, externSystem, dit moet opvraagbaar zijn?

    getObject(importableObject: ImportableObject, externalSystem: ExternalSystem): Observable<ExternalObject> {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('importableObjectId', importableObject.getId().toString());
        httpParams = httpParams.set('externalSystemId', externalSystem.getId().toString());
        const options = {
            headers: this.getHeaders(),
            params: httpParams
        };

        const url = this.getUrl() + '/-1';
        return this.http.get(url, options).pipe(
            map((res: IExternalObject) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(jsonObject: IExternalObject): Observable<ExternalObject> {
        return this.http.post(this.getUrl(), jsonObject, { headers: super.getHeaders() }).pipe(
            map((res: IExternalObject) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(object: ExternalObject): Observable<ExternalObject> {
        const url = this.getUrl() + '/' + object.getId();
        return this.http.put(url, this.objectToJsonHelper(object), { headers: super.getHeaders() }).pipe(
            map((res: IExternalObject) => this.jsonToObjectHelper(res, object))
        );
    }

    removeObject(externalObject: ExternalObject): Observable<IExternalObject> {
        const url = this.getUrl() + '/' + externalObject.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((associationRes: IExternalObject) => {
                this.cache[externalObject.getId()] = undefined;
                return associationRes;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    // getExternalObjects(externalobjects: ExternalObject[], importableObject: any): ExternalObject[] {
    //     if (externalobjects === undefined) {
    //         return [];
    //     }
    //     return externalobjects.filter(
    //         extobjIt => extobjIt.getImportableObject() === importableObject
    //     );
    // }

    // getExternalObject(externalobjects: ExternalObject[], externalsystem: any, externalid: string,
    // importableObject: any): ExternalObject {
    //     return externalobjects.filter(
    //         extobjIt => extobjIt.getExternalSystem() === externalsystem
    //             && (externalid === undefined || extobjIt.getExternalId() === externalid)
    //             && (importableObject === undefined || extobjIt.getImportableObject() === importableObject)
    //     ).shift();
    // }

    jsonArrayToObject(jsonArray: IExternalObject[]): ExternalObject[] {
        const externalObjects: ExternalObject[] = [];
        for (const json of jsonArray) {
            externalObjects.push(this.jsonToObjectHelper(json));
        }
        return externalObjects;
    }

    jsonToObjectHelper(json: IExternalObject, externalObject?: ExternalObject): ExternalObject {
        if (externalObject === undefined && json.id !== undefined) {
            externalObject = this.cache[json.id];
        }
        if (externalObject === undefined) {
            externalObject = new ExternalObject(
                json.importableObjectId,
                json.externalSystemId);
            externalObject.setId(json.id);
            externalObject.setExternalId(json.externalId);
            this.cache[externalObject.getId()] = externalObject;
        }
        return externalObject;
    }

    objectToJsonHelper(externalObject: ExternalObject): IExternalObject {
        const json: IExternalObject = {
            id: externalObject.getId(),
            importableObjectId: externalObject.getImportableObjectId(),
            externalSystemId: externalObject.getExternalSystemId(),
            externalId: externalObject.getExternalId()
        };
        return json;
    }
}

export interface IExternalObject {
    id?: number;
    importableObjectId: number;
    externalSystemId: number;
    externalId: string;
}

