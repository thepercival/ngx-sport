import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../api/repository';
import { Competition } from '../../competition';
import { SportConfig } from '../config';
import { JsonSportConfig, SportConfigMapper } from './mapper';

@Injectable()
export class SportConfigRepository extends APIRepository {
    private url: string;

    constructor(
        private mapper: SportConfigMapper,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'sportconfigs';
    }

    editObject(sportConfig: SportConfig, competition: Competition): Observable<SportConfig> {
        return this.http.put(this.url + '/' + sportConfig.getId(), this.mapper.toJson(sportConfig), this.getOptions(competition)).pipe(
            map((res: JsonSportConfig) => this.mapper.toObject(res, competition, sportConfig)),
            catchError((err) => this.handleError(err))
        );
    }

    protected getOptions(competition: Competition): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('competitionid', competition.getId().toString());
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }
}
