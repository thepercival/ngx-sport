import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { JsonLeague, LeagueMapper } from './mapper';
import { League } from '../league';
import { SportRepository } from '../repository';
import { SportCache } from '../cache';

/**
 * Created by coen on 10-2-17.
 */
@Injectable()
export class LeagueRepository extends SportRepository {

    private url: string;

    constructor(
        private mapper: LeagueMapper,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'leagues';
    }

    getObjects(): Observable<League[]> {
        return this.http.get(this.url, { headers: super.getHeaders() }).pipe(
            map((json: JsonLeague[]) => json.map( jsonLeague => this.mapper.toObject(jsonLeague))),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number): Observable<League> {
        const url = this.url + '/' + id;
        return this.http.get(url).pipe(
            map((json: JsonLeague) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonLeague): Observable<League> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((jsonRes: JsonLeague) => this.mapper.toObject(jsonRes)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(league: League): Observable<League> {
        const url = this.url + '/' + league.getId();
        return this.http.put(url, this.mapper.toJson(league), { headers: super.getHeaders() }).pipe(
            map((json: JsonLeague) => this.mapper.toObject(json, league)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(league: League): Observable<JsonLeague> {
        const url = this.url + '/' + league.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((json: JsonLeague) => {
                SportCache.leagues[league.getId()] = undefined;
                return json;
            }),
            catchError((err) => this.handleError(err))
        );
    }
}
