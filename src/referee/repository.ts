import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../api/repository';
import { Competition } from '../competition';
import { Referee } from '../referee';
import { JsonReferee, RefereeMapper } from '../referee/mapper';

@Injectable()
export class RefereeRepository extends APIRepository {

    private url: string;

    constructor(
        private mapper: RefereeMapper,
        private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'referees';
    }

    createObject(json: JsonReferee, competition: Competition): Observable<Referee> {
        return this.http.post(this.url, json, this.getOptions(competition)).pipe(
            map((jsonRes: JsonReferee) => this.mapper.toObject(jsonRes, competition)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(referee: Referee, competition: Competition): Observable<Referee> {
        return this.http.put(this.url + '/' + referee.getId(), this.mapper.toJson(referee), this.getOptions(competition)).pipe(
            map((json: JsonReferee) => this.mapper.toObject(json, competition, referee)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(referee: Referee, competition: Competition): Observable<void> {
        const url = this.url + '/' + referee.getId();
        return this.http.delete(url, this.getOptions(competition)).pipe(
            map((res) => {
                competition.removeReferee(referee);
            }),
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
