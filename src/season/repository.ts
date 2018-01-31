import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { SportRepository } from '../repository';
import { Season } from '../season';


@Injectable()
export class SeasonRepository extends SportRepository {

    private url: string;
    private objects: Season[];

    constructor(private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'seasons';
    }

    getObjects(): Observable<Season[]> {
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

    jsonArrayToObject(jsonArray: any): Season[] {
        const seasons: Season[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json);
            seasons.push(object);
        }
        return seasons;
    }

    getObject(id: number): Observable<Season> {
        const url = this.url + '/' + id;
        return this.http.get(url, { headers: super.getHeaders() }).pipe(
            map((res) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    jsonToObjectHelper(json: any): Season {
        if (this.objects !== undefined) {
            const foundObjects = this.objects.filter(
                objectIt => objectIt.getId() === json.id
            );
            if (foundObjects.length === 1) {
                return foundObjects.shift();
            }
        }

        const season = new Season(json.name);
        season.setId(json.id);
        // season.setStartdate(new Date(json.startdate.timestamp*1000));
        season.setStartDateTime(new Date(json.startDateTime));
        season.setEndDateTime(new Date(json.endDateTime));
        return season;
    }

    createObject(jsonObject: any): Observable<Season> {
        return this.http.post(this.url, jsonObject, { headers: super.getHeaders() }).pipe(
            map((res) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(object: Season): Observable<Season> {
        const url = this.url + '/' + object.getId();
        return this.http.put(url, JSON.stringify(this.objectToJsonHelper(object)), { headers: super.getHeaders() }).pipe(
            map(res => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(object: Season): Observable<Season> {
        const url = this.url + '/' + object.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: Season) => res),
            catchError((err) => this.handleError(err))
        );
    }

    objectToJsonHelper(object: Season): any {
        const json = {
            'id': object.getId(),
            'name': object.getName(),
            'startDateTime': object.getStartDateTime().toISOString(),
            'endDateTime': object.getEndDateTime().toISOString()
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
