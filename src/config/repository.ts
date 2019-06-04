import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

import { SportRepository } from '../repository';
import { RoundNumber } from '../round/number';
import { Config } from '../config';
import { JsonConfig, ConfigMapper } from './mapper';

@Injectable()
export class ConfigRepository extends SportRepository {
    private url: string;

    constructor(
        private mapper: ConfigMapper,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'configs';
    }

    editObject(roundNumber: RoundNumber, config: JsonConfig): Observable<Config[][]> {
        return forkJoin(this.getUpdates(roundNumber, config));
    }

    getUpdates(roundNumber: RoundNumber, config: JsonConfig): Observable<Config[]>[] {
        let reposUpdates: Observable<Config[]>[] = [];
        const options = this.getOptions(roundNumber);
        reposUpdates.push(
            this.http.put(this.url + '/' + roundNumber.getConfig().getId(), config, options).pipe(
                map((json: JsonConfig) => this.mapper.toObject(json, roundNumber)),
                catchError((err) => this.handleError(err))
            )
        );
        if ( roundNumber.hasNext() ) {
            reposUpdates = reposUpdates.concat( this.getUpdates(roundNumber.getNext(), config) );
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
