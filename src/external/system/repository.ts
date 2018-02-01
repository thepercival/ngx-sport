import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { SportRepository } from '../../repository';
import { ExternalSystem } from '../system';
import { ExternalSystemSoccerOdds } from './soccerodds';
import { ExternalSystemSoccerSports } from './soccersports';

/**
 * Created by cdunnink on 7-2-2017.
 */

@Injectable()
export class ExternalSystemRepository extends SportRepository {

    private url: string;
    private objects: ExternalSystem[];
    private specificObjects: ExternalSystem[] = [];

    constructor(private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'external/systems';
    }

    getObjects(): Observable<ExternalSystem[]> {

        if (this.objects !== undefined) {
            return Observable.create(observer => {
                observer.next(this.objects);
                observer.complete();
            });
        }
        return this.http.get(this.url, { headers: super.getHeaders() }).pipe(
            map((res) => {
                const objects = this.jsonArrayToObject(res);
                this.objects = objects;
                return this.objects;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: any): ExternalSystem[] {
        const objects: ExternalSystem[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json);
            objects.push(object);
        }
        return objects;
    }

    getObject(id: number): Observable<ExternalSystem> {
        const url = this.url + '/' + id;
        return this.http.get(url).pipe(
            map((res) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    jsonToObjectHelper(json: any): ExternalSystem {
        const externalSystem = this.getObjectByName(json.name);
        if (externalSystem === undefined) {
            return externalSystem;
        }
        externalSystem.setId(json.id);
        externalSystem.setWebsite(json.website);
        externalSystem.setUsername(json.username);
        externalSystem.setPassword(json.password);
        externalSystem.setApiurl(json.apiurl);
        externalSystem.setApikey(json.apikey);
        return externalSystem;
    }

    private getObjectByName(name: string): ExternalSystem {
        const foundObjects = this.specificObjects.filter(objectFilter => objectFilter.getName() === name);
        const foundObject = foundObjects.shift();
        if (foundObject) {
            return foundObject;
        }
        let externalSystem;
        if (name === 'Soccer Odds') {
            externalSystem = new ExternalSystemSoccerOdds(name, this.http, this);
        } else if (name === 'Soccer Sports') {
            externalSystem = new ExternalSystemSoccerSports(name, this.http, this);
        } else {
            externalSystem = new ExternalSystem(name);
        }
        if (externalSystem !== undefined) {
            this.specificObjects.push(externalSystem);
        }
        return externalSystem;
    }

    createObject(jsonObject: any): Observable<ExternalSystem> {
        return this.http.post(this.url, jsonObject, { headers: super.getHeaders() }).pipe(
            map((res) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(object: ExternalSystem): Observable<ExternalSystem> {
        const url = this.url + '/' + object.getId();
        return this.http.put(url, JSON.stringify(this.objectToJsonHelper(object)), { headers: super.getHeaders() }).pipe(
            map((res) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: ExternalSystem): any {
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

    removeObject(object: ExternalSystem): Observable<void> {
        const url = this.url + '/' + object.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res) => res),
            catchError((err) => this.handleError(err))
        );
    }
}
