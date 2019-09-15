import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { APIRepository } from '../../api/repository';
import { SportScoreConfigMapper, JsonSportScoreConfig } from './mapper';
import { RoundNumber } from '../../round/number';
import { SportScoreConfig } from '../scoreconfig';
import { Sport } from '../../sport';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class SportScoreConfigRepository extends APIRepository {
    private url: string;

    constructor(
        private mapper: SportScoreConfigMapper,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'sportscoreconfigs';
    }

    createObject(jsonConfig: JsonSportScoreConfig, sport: Sport, roundNumber: RoundNumber): Observable<SportScoreConfig> {
        return this.http.post(this.url, jsonConfig, this.getOptions(roundNumber, sport)).pipe(
            map((res: JsonSportScoreConfig) => this.mapper.toObject(res, sport, roundNumber)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(jsonConfig: JsonSportScoreConfig, config: SportScoreConfig): Observable<SportScoreConfig[][]> {
        return this.http.put(this.url + '/' + config.getId(), jsonConfig, this.getOptions(config.getRoundNumber())).pipe(
            map((json: JsonSportScoreConfig) => this.mapper.toObject(json, config.getSport(), config.getRoundNumber(), config)),
            catchError((err) => this.handleError(err))
        );
    }

    protected getOptions(roundNumber: RoundNumber, sport?: Sport): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('competitionid', roundNumber.getCompetition().getId().toString());
        httpParams = httpParams.set('roundnumber', roundNumber.getNumber().toString());
        if (sport !== undefined) {
            httpParams = httpParams.set('sportid', sport.getId().toString());
        }
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }
}
