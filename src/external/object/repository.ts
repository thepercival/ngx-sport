import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SportRepository } from '../../repository';
import { ExternalObject, ImportableObject } from '../object';
import { ExternalSystem } from '../system';
import { ExternalObjectMapper, JsonExternalObject } from './mapper';
import { TheCache } from '../../cache';

@Injectable()
export class ExternalObjectRepository extends SportRepository {

    private urlPostfix;

    constructor(
        private http: HttpClient,
        private mapper: ExternalObjectMapper,
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
            map((json: JsonExternalObject) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(jsonObject: JsonExternalObject): Observable<ExternalObject> {
        return this.http.post(this.getUrl(), jsonObject, { headers: super.getHeaders() }).pipe(
            map((res: JsonExternalObject) => this.mapper.toObject(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(object: ExternalObject): Observable<ExternalObject> {
        const url = this.getUrl() + '/' + object.getId();
        return this.http.put(url, this.mapper.toJson(object), { headers: super.getHeaders() }).pipe(
            map((res: JsonExternalObject) => this.mapper.toObject(res, object))
        );
    }

    removeObject(externalObject: ExternalObject): Observable<JsonExternalObject> {
        const url = this.getUrl() + '/' + externalObject.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((associationRes: JsonExternalObject) => {
                TheCache.externals[externalObject.getId()] = undefined;
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

}
