import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

import { SportRepository } from '../../../repository';
import { RoundNumber } from '../../../round/number';
import { RoundNumberConfig } from '../config';
import { JsonRoundNumberConfig, RoundNumberConfigMapper } from './mapper';

@Injectable()
export class RoundNumberConfigRepository extends SportRepository {
    private url: string;

    constructor(
        private mapper: RoundNumberConfigMapper,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'roundconfigs';
    }

    editObject(roundNumber: RoundNumber, roundNumberConfig: JsonRoundNumberConfig): Observable<RoundNumberConfig[][]> {
        return forkJoin(this.getUpdates(roundNumber, roundNumberConfig));
    }

    getUpdates(roundNumber: RoundNumber, roundNumberConfig: JsonRoundNumberConfig): Observable<RoundNumberConfig[]>[] {
        let reposUpdates: Observable<RoundNumberConfig[]>[] = [];
        const options = this.getOptions(roundNumber);
        reposUpdates.push(
            this.http.put(this.url + '/' + roundNumber.getConfig().getId(), roundNumberConfig, options).pipe(
                map((json: JsonRoundNumberConfig) => this.mapper.toObject(json, roundNumber)),
                catchError((err) => this.handleError(err))
            )
        );
        if ( roundNumber.hasNext() ) {
            reposUpdates = reposUpdates.concat( this.getUpdates(roundNumber.getNext(), roundNumberConfig) );
        }
        return reposUpdates;
    }

    protected getOptions(roundNumber: RoundNumber): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('competitionid', roundNumber.getCompetition().getId().toString());
        httpParams = httpParams.set('roundnumberid', roundNumber.getId().toString());
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }
}
