import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { SportRepository } from '../../repository';
import { ExternalObject } from '../object';
import { ExternalSystem } from '../system';
import { ExternalSystemRepository } from '../system/repository';

@Injectable()
export class ExternalObjectRepository extends SportRepository {

    private url: string;

    constructor(private http: HttpClient, private externalSystemRepository: ExternalSystemRepository) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'external';
    }

    getObjects(importableObjectRepository: any): Observable<ExternalObject[]> {
        let url = this.url + '/' + importableObjectRepository.getUrlpostfix();
        return this.http.get(url, { headers: super.getHeaders() }).pipe(
            map((res) => {
                return this.jsonArrayToObject(res, importableObjectRepository);
            }),
            catchError( super.handleError )
        );
    }

    jsonArrayToObject(jsonArray: any, importableObjectRepository: any): ExternalObject[] {
        let externalObjects: ExternalObject[] = [];
        for (let json of jsonArray) {
            externalObjects.push(this.jsonToObjectHelper(json, importableObjectRepository));
        }
        return externalObjects;
    }

    jsonToObjectHelper(json: any, importableObjectRepository: any): ExternalObject {
        let externalSystem = undefined;
        if (json.externalsystem != undefined) {
            externalSystem = this.externalSystemRepository.jsonToObjectHelper(json.externalsystem);
        }
        let importableObject = undefined;
        if (json.importableobject != undefined) {
            importableObject = importableObjectRepository.jsonToObjectHelper(json.importableobject);
        }
        let externalObject = new ExternalObject(importableObject, externalSystem, json.externalid);
        externalObject.setId(json.id);
        return externalObject;
    }

    createObject(importableObjectRepository: any, object: any, externalid: string, externalSystem: ExternalSystem): Observable<ExternalObject> {
        let json = { "importableobjectid": object.getId(), "externalid": externalid, "externalsystemid": externalSystem.getId() };
        let url = this.url + '/' + importableObjectRepository.getUrlpostfix();
        return this.http.post(url, json, { headers: super.getHeaders() }).pipe(
            map((res) => this.jsonToObjectHelper(res, importableObjectRepository)),
            catchError( super.handleError )
        );
    }

    removeObject(urlpostfix: string, object: ExternalObject): Observable<any> {
        let url = this.url + '/' + urlpostfix + '/' + object.getId();

        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: any) => res),
            catchError( super.handleError )
        );
    }   

    getExternalObjects(externalobjects: ExternalObject[], importableObject: any): ExternalObject[] {
        if (externalobjects == undefined) {
            return [];
        }
        return externalobjects.filter(
            extobjIt => extobjIt.getImportableObject() == importableObject
        );
    }

    getExternalObject(externalobjects: ExternalObject[], externalsystem: any, externalid: string, importableObject: any): ExternalObject {
        return externalobjects.filter(
            extobjIt => extobjIt.getExternalSystem() == externalsystem
                && (externalid == undefined || extobjIt.getExternalid() == externalid)
                && (importableObject == undefined || extobjIt.getImportableObject() == importableObject)
        ).shift();
    }
}

