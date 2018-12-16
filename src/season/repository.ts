import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SportRepository } from '../repository';
import { Season } from '../season';
import { JsonSeason, SeasonMapper } from '../season/mapper';
import { SportCache } from '../cache';


@Injectable()
export class SeasonRepository extends SportRepository {

    private url: string;

    constructor(private mapper: SeasonMapper, private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'seasons';
    }

    getObject(id: number): Observable<Season> {
        const url = this.url + '/' + id;
        return this.http.get(url, { headers: super.getHeaders() }).pipe(
            map((json: JsonSeason) => this.mapper.toObject(json)),
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
            map((json: JsonSeason[]) => json.map( jsonSeason => this.mapper.toObject(jsonSeason))),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonSeason): Observable<Season> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((jsonRes: JsonSeason) => this.mapper.toObject(jsonRes)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(season: Season): Observable<Season> {
        const url = this.url + '/' + season.getId();
        return this.http.put(url, this.mapper.toJson(season), { headers: super.getHeaders() }).pipe(
            map((json: JsonSeason) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(season: Season): Observable<JsonSeason> {
        const url = this.url + '/' + season.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((json: JsonSeason) => {
                SportCache.seasons[season.getId()] = undefined;
                return json;
            }),
            catchError((err) => this.handleError(err))
        );
    }
}

