import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../api/repository';
import { ExternalSystem } from '../system';
import { ExternalSystemMapper, JsonExternalSystem } from './mapper';

// import { ExternalSystemSoccerOdds } from './soccerodds';
// import { ExternalSystemSoccerSports } from './soccersports';

@Injectable()
export class ExternalSystemRepository extends APIRepository {

    private url: string;
    // private objects: ExternalSystem[];
    // private specificObjects: ExternalSystem[] = [];

    constructor(private http: HttpClient, private mapper: ExternalSystemMapper, router: Router) {
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
            map((jsonSystems: JsonExternalSystem[]) => jsonSystems.map(jsonSystem => this.mapper.toObject(jsonSystem))),
            catchError((err) => this.handleError(err))
        );
    }

    // getObject(id: number): Observable<ExternalSystem> {
    //     const url = this.url + '/' + id;
    //     return this.http.get(url).pipe(
    //         map((res) => this.jsonToObject(res)),
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

    createObject(json: JsonExternalSystem): Observable<ExternalSystem> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((jsonRes: JsonExternalSystem) => this.mapper.toObject(jsonRes)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(externalSystem: ExternalSystem): Observable<ExternalSystem> {
        const options = {
            headers: super.getHeaders()
        };
        const url = this.url + '/' + externalSystem.getId();
        return this.http.put(url, this.mapper.toJson(externalSystem), options).pipe(
            map((res: JsonExternalSystem) => this.mapper.toObject(res, externalSystem)),
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
}


