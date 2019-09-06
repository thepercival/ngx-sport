import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

import { APIRepository } from '../../api/repository';
import { RoundNumber } from '../../round/number';
import { PlanningConfig } from '../config';
import { JsonPlanningConfig, PlanningConfigMapper } from './mapper';

@Injectable()
export class PlanningConfigRepository extends APIRepository {
    private url: string;

    constructor(
        private mapper: PlanningConfigMapper,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'planningconfigs';
    }

    createObject(json: JsonPlanningConfig, roundNumber: RoundNumber): Observable<PlanningConfig> {
        return this.http.post(this.url, json, this.getOptions(roundNumber)).pipe(
            map((jsonRes: JsonPlanningConfig) => this.mapper.toObject(jsonRes, roundNumber)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(json: JsonPlanningConfig, config: PlanningConfig): Observable<PlanningConfig> {
        const roundNumber = config.getRoundNumber();
        return this.http.put(this.url + '/' + config.getId(), json, this.getOptions(roundNumber)).pipe(
            map((jsonRes: JsonPlanningConfig) => this.mapper.toObject(jsonRes, roundNumber, config)),
            catchError((err) => this.handleError(err))
        );
    }

    // editObject(roundNumber: RoundNumber, config: JsonPlanningConfig): Observable<PlanningConfig[][]> {
    //     return forkJoin(this.getUpdates(roundNumber, config));
    // }
    // getUpdates(roundNumber: RoundNumber, config: JsonPlanningConfig): Observable<PlanningConfig[]>[] {
    //     let reposUpdates: Observable<PlanningConfig[]>[] = [];
    //     const options = this.getOptions(roundNumber);
    //     reposUpdates.push(
    //         this.http.put(this.url + '/' + roundNumber.getPlanningConfig().getId(), config, options).pipe(
    //             map((json: JsonPlanningConfig) => this.mapper.toObject(json, roundNumber)),
    //             catchError((err) => this.handleError(err))
    //         )
    //     );
    //     if ( roundNumber.hasNext() ) {
    //         reposUpdates = reposUpdates.concat( this.getUpdates(roundNumber.getNext(), config) );
    //     }
    //     return reposUpdates;
    // }

    protected getOptions(roundNumber: RoundNumber): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('competitionid', roundNumber.getCompetition().getId().toString());
        httpParams = httpParams.set('roundnumber', roundNumber.getNumber().toString());
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }
}
