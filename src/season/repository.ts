import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SportRepository } from '../repository';
import { Season } from '../season';


@Injectable()
export class SeasonRepository extends SportRepository {

    private url: string;

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
            map((res: ISeason) => this.jsonToObject(res)),
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
                return this.jsonArrayToObject(res);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(jsonObject: any): Observable<Season> {
        return this.http.post(this.url, jsonObject, { headers: super.getHeaders() }).pipe(
            map((res: ISeason) => this.jsonToObject(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(object: Season): Observable<Season> {
        const url = this.url + '/' + object.getId();
        return this.http.put(url, this.objectToJson(object), { headers: super.getHeaders() }).pipe(
            map((res: ISeason) => this.jsonToObject(res)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(season: Season): Observable<Season> {
        const url = this.url + '/' + season.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((seasonRes: ISeason) => {
                this.cache[season.getId()] = undefined;
                return seasonRes;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: ISeason[]): Season[] {
        const seasons: Season[] = [];
        for (const json of jsonArray) {
            seasons.push(this.jsonToObject(json));
        }
        return seasons;
    }

    jsonToObject(json: ISeason, season?: Season): Season {
        if (season === undefined && json.id !== undefined) {
            season = this.cache[json.id];
        }
        if (season === undefined) {
            season = new Season(json.name);
            season.setId(json.id);
            this.cache[season.getId()] = season;
        }
        season.setStartDateTime(new Date(json.startDateTime));
        season.setEndDateTime(new Date(json.endDateTime));
        return season;
    }

    objectsToJsonArray(objects: Season[]): ISeason[] {
        const jsonArray: ISeason[] = [];
        for (const object of objects) {
            jsonArray.push(this.objectToJson(object));
        }
        return jsonArray;
    }

    objectToJson(object: Season): any {
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
