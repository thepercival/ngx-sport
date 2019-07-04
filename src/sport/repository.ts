import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../api/repository';
import { Sport } from '../sport';
import { JsonSport, SportMapper } from './mapper';

@Injectable()
export class SportRepository extends APIRepository {
    private url: string;

    constructor(
        private mapper: SportMapper,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'sports';
    }

    getObject(customId: number): Observable<Sport> {
        const url = this.url + '/' + customId;
        return this.http.get(url).pipe(
            map((json: JsonSport) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonSport): Observable<Sport> {
        return this.http.post(this.url, json, this.getOptions()).pipe(
            map((jsonRes: JsonSport) => this.mapper.toObject(jsonRes)),
            catchError((err) => this.handleError(err))
        );
    }

    protected getOptions(): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }
}
