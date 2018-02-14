import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { SportRepository } from '../repository';
import { Season } from '../season';


@Injectable()
export class SeasonRepository extends SportRepository {

    private url: string;
    // private objects: Season[];

    constructor(private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'seasons';
    }

    getObject(id: number): Observable<Season> {
        const url = this.url + '/' + id;
        return this.http.get(url, { headers: super.getHeaders() }).pipe(
            map((res: ISeason) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    getObjects(): Observable<Season[]> {
        // if (this.objects !== undefined) {
        //     return Observable.create(observer => {
        //         observer.next(this.objects);
        //         observer.complete();
        //     });
        // }

        return this.http.get(this.url, { headers: super.getHeaders() }).pipe(
            map((res: ISeason[]) => {
                const objects = this.jsonArrayToObject(res);
                // this.objects = objects;
                return objects;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(jsonObject: any): Observable<Season> {
        return this.http.post(this.url, jsonObject, { headers: super.getHeaders() }).pipe(
            map((res: ISeason) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(object: Season): Observable<Season> {
        const url = this.url + '/' + object.getId();
        return this.http.put(url, this.objectToJsonHelper(object), { headers: super.getHeaders() }).pipe(
            map((res: ISeason) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(object: Season): Observable<Season> {
        const url = this.url + '/' + object.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: ISeason) => res),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: ISeason[]): Season[] {
        const seasons: Season[] = [];
        for (const json of jsonArray) {
            seasons.push(this.jsonToObjectHelper(json));
        }
        return seasons;
    }

    jsonToObjectHelper(json: ISeason, season?: Season): Season {
        if (season === undefined) {
            season = new Season(json.name);
        }
        season.setId(json.id);
        season.setStartDateTime(new Date(json.startDateTime));
        season.setEndDateTime(new Date(json.endDateTime));
        return season;
    }

    objectsToJsonArray(objects: Season[]): ISeason[] {
        const jsonArray: ISeason[] = [];
        for (const object of objects) {
            jsonArray.push(this.objectToJsonHelper(object));
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Season): any {
        const json: ISeason = {
            id: object.getId(),
            name: object.getName(),
            startDateTime: object.getStartDateTime().toISOString(),
            endDateTime: object.getEndDateTime().toISOString()
        };
        return json;
    }
}

export interface ISeason {
    id?: number;
    name: string;
    startDateTime: string;
    endDateTime: string;
}
