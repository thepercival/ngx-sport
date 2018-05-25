import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError ,  map } from 'rxjs/operators';

import { SportRepository } from '../../repository';
import { ExternalSystem } from '../system';
// import { ExternalSystemSoccerOdds } from './soccerodds';
// import { ExternalSystemSoccerSports } from './soccersports';

/**
 * Created by cdunnink on 7-2-2017.
 */

@Injectable()
export class ExternalSystemRepository extends SportRepository {

    private url: string;
    // private objects: ExternalSystem[];
    // private specificObjects: ExternalSystem[] = [];

    constructor(private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'external/systems';
    }

    getObjects(): Observable<ExternalSystem[]> {

        // if (this.objects !== undefined) {
        //     return Observable.create(observer => {
        //         observer.next(this.objects);
        //         observer.complete();
        //     });
        // }
        return this.http.get(this.url, { headers: super.getHeaders() }).pipe(
            map((res) => this.jsonArrayToObject(res)),
            catchError((err) => this.handleError(err))
        );
    }



    // getObject(id: number): Observable<ExternalSystem> {
    //     const url = this.url + '/' + id;
    //     return this.http.get(url).pipe(
    //         map((res) => this.jsonToObjectHelper(res)),
    //         catchError((err) => this.handleError(err))
    //     );
    // }



    // private getObjectByName(name: string): ExternalSystem {
    //     const foundObjects = this.specificObjects.filter(objectFilter => objectFilter.getName() === name);
    //     const foundObject = foundObjects.shift();
    //     if (foundObject) {
    //         return foundObject;
    //     }
    //     let externalSystem;
    //     if (name === 'Soccer Odds') {
    //         externalSystem = new ExternalSystemSoccerOdds(name, this.http, this);
    //     } else if (name === 'Soccer Sports') {
    //         externalSystem = new ExternalSystemSoccerSports(name, this.http, this);
    //     } else {
    //         externalSystem = new ExternalSystem(name);
    //     }
    //     if (externalSystem !== undefined) {
    //         this.specificObjects.push(externalSystem);
    //     }
    //     return externalSystem;
    // }

    createObject(jsonObject: IExternalSystem): Observable<ExternalSystem> {
        return this.http.post(this.url, jsonObject, { headers: super.getHeaders() }).pipe(
            map((res: IExternalSystem) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(externalSystem: ExternalSystem): Observable<ExternalSystem> {
        const options = {
            headers: super.getHeaders()
        };
        const url = this.url + '/' + externalSystem.getId();
        return this.http.put(url, this.objectToJsonHelper(externalSystem), options).pipe(
            map((res: IExternalSystem) => this.jsonToObjectHelper(res, externalSystem)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(object: ExternalSystem): Observable<void> {
        const url = this.url + '/' + object.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res) => res),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: any): ExternalSystem[] {
        const objects: ExternalSystem[] = [];
        for (const json of jsonArray) {
            objects.push(this.jsonToObjectHelper(json));
        }
        return objects;
    }

    jsonToObjectHelper(json: IExternalSystem, externalSystem?: ExternalSystem): ExternalSystem {
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

    objectsToJsonArray(objects: ExternalSystem[]): IExternalSystem[] {
        const jsonArray: IExternalSystem[] = [];
        for (const object of objects) {
            jsonArray.push(this.objectToJsonHelper(object));
        }
        return jsonArray;
    }

    objectToJsonHelper(object: ExternalSystem): any {
        const externalSystem: IExternalSystem = {
            id: object.getId(),
            name: object.getName(),
            website: object.getWebsite(),
            username: object.getUsername(),
            password: object.getPassword(),
            apiurl: object.getApiurl(),
            apikey: object.getApikey()
        };
        return externalSystem;
    }
}

export interface IExternalSystem {
    id?: number;
    name: string;
    website?: string;
    username?: string;
    password?: string;
    apiurl?: string;
    apikey?: string;
}
