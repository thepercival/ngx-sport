import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Competition } from '../competition';
import { CompetitionMapper, JsonCompetition } from '../competition/mapper';
import { SportRepository } from '../repository';

@Injectable()
export class CompetitionRepository extends SportRepository {

    private url: string;

    constructor(private http: HttpClient,
        private mapper: CompetitionMapper,
        router: Router
    ) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'competitions';
    }

    getObjects(): Observable<Competition[]> {
        const options = this.getOptions();
        return this.http.get(this.url, options).pipe(
            map((json: JsonCompetition[]) => json.map(jsonComp => this.mapper.toObject(jsonComp))),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number): Observable<Competition> {
        const options = this.getOptions();
        return this.http.get(this.url + '/' + id, options).pipe(
            map((json: JsonCompetition) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonCompetition): Observable<Competition> {
        const options = this.getOptions();
        return this.http.post(this.url, json, options).pipe(
            map((jsonRes: JsonCompetition) => this.mapper.toObject(jsonRes)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(competition: Competition): Observable<Competition> {
        const url = this.url + '/' + competition.getId();
        const options = this.getOptions();
        return this.http.put(url, this.mapper.toJson(competition), options).pipe(
            map((res: JsonCompetition) => this.mapper.toObject(res, competition)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(competition: Competition): Observable<JsonCompetition> {
        const url = this.url + '/' + competition.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((json: JsonCompetition) => json),
            catchError((err) => this.handleError(err))
        );
    }

    protected getOptions(): { headers: HttpHeaders } {
        return {
            headers: super.getHeaders()
        };
    }
}

