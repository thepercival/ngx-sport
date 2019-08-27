import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../../api/repository';
import { Competition } from '../../competition';
import { Structure } from '../../structure';
import { SportConfig } from '../config';
import { SportPlanningConfigService } from '../planningconfig/service';
import { SportScoreConfigService } from '../scoreconfig/service';
import { JsonSportConfig, SportConfigMapper } from './mapper';
import { SportConfigService } from './service';

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

    createObject(sportConfig: SportConfig, competition: Competition): Observable<SportConfig> {
        return this.http.post(this.url, this.mapper.toJson(sportConfig), this.getOptions(competition)).pipe(
            map((res: JsonSportConfig) => this.mapper.toObject(res, competition, sportConfig)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(sportConfig: SportConfig, competition: Competition): Observable<SportConfig> {
        return this.http.put(this.url + '/' + sportConfig.getId(), this.mapper.toJson(sportConfig), this.getOptions(competition)).pipe(
            map((res: JsonSportConfig) => this.mapper.toObject(res, competition, sportConfig)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(sportConfig: SportConfig, competition: Competition, structure: Structure): Observable<void> {
        const url = this.url + '/' + sportConfig.getId();
        return this.http.delete(url, this.getOptions(competition)).pipe(
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
