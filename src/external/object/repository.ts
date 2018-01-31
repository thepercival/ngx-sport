import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

    constructor(private http: HttpClient, private externalSystemRepository: ExternalSystemRepository, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'external';
    }

    getObjects(importableObjectRepository: any): Observable<ExternalObject[]> {
        const url = this.url + '/' + importableObjectRepository.getUrlpostfix();
        return this.http.get(url, { headers: super.getHeaders() }).pipe(
            map((res) => {
                return this.jsonArrayToObject(res, importableObjectRepository);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: any, importableObjectRepository: any): ExternalObject[] {
        const externalObjects: ExternalObject[] = [];
        for (const json of jsonArray) {
            externalObjects.push(this.jsonToObjectHelper(json, importableObjectRepository));
        }
        return externalObjects;
    }

    jsonToObjectHelper(json: any, importableObjectRepository: any): ExternalObject {
        let externalSystem;
        if (json.externalsystem !== undefined) {
            externalSystem = this.externalSystemRepository.jsonToObjectHelper(json.externalsystem);
        }
        let importableObject;
        if (json.importableobject !== undefined) {
            importableObject = importableObjectRepository.jsonToObjectHelper(json.importableobject);
        }
        const externalObject = new ExternalObject(importableObject, externalSystem, json.externalid);
        externalObject.setId(json.id);
        return externalObject;
    }

    createObject(
        importableObjectRepository: any,
        object: any,
        externalid: string,
        externalSystem: ExternalSystem
    ): Observable<ExternalObject> {
        const json = { importableobjectid: object.getId(), externalid: externalid, externalsystemid: externalSystem.getId() };
        const url = this.url + '/' + importableObjectRepository.getUrlpostfix();
        return this.http.post(url, json, { headers: super.getHeaders() }).pipe(
            map((res) => this.jsonToObjectHelper(res, importableObjectRepository)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(urlpostfix: string, object: ExternalObject): Observable<any> {
        const url = this.url + '/' + urlpostfix + '/' + object.getId();

        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: any) => res),
            catchError((err) => this.handleError(err))
        );
    }

    getExternalObjects(externalobjects: ExternalObject[], importableObject: any): ExternalObject[] {
        if (externalobjects === undefined) {
            return [];
        }
        return externalobjects.filter(
            extobjIt => extobjIt.getImportableObject() === importableObject
        );
    }

    getExternalObject(externalobjects: ExternalObject[], externalsystem: any, externalid: string, importableObject: any): ExternalObject {
        return externalobjects.filter(
            extobjIt => extobjIt.getExternalSystem() === externalsystem
                && (externalid === undefined || extobjIt.getExternalid() === externalid)
                && (importableObject === undefined || extobjIt.getImportableObject() === importableObject)
        ).shift();
    }
}

