import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Association } from '../association';
import { TheCache } from '../cache';
import { Competition } from '../competition';
import { Competitor } from '../competitor';
import { CompetitorMapper, JsonCompetitor } from '../competitor/mapper';
import { SportRepository } from '../repository';

@Injectable()
export class CompetitorRepository extends SportRepository {

    private url: string;
    private mapper: CompetitorMapper;
    private unusedCompetitors: UnusedCompetitors[];

    constructor(
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
        this.unusedCompetitors = [];
        this.mapper = new CompetitorMapper();
    }

    getUrlpostfix(): string {
        return 'competitors';
    }

    getObjects(association: Association, name?: string): Observable<Competitor[]> {
        const options = this.getOptions(association, name);
        return this.http.get(this.url, options).pipe(
            map((json: JsonCompetitor[]) => json.map(jsonCompetitor => this.mapper.toObject(jsonCompetitor, association))),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number, association: Association): Observable<Competitor> {
        const options = this.getOptions(association);
        return this.http.get(this.url + '/' + id, options).pipe(
            map((json: JsonCompetitor) => this.mapper.toObject(json, association)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonCompetitor, association: Association): Observable<Competitor> {
        const options = this.getOptions(association);
        return this.http.post(this.url, json, options).pipe(
            map((jsonRes: JsonCompetitor) => this.mapper.toObject(jsonRes, association)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(competitor: Competitor): Observable<Competitor> {
        const options = this.getOptions(competitor.getAssociation());
        return this.http.put(this.url + '/' + competitor.getId(), this.mapper.toJson(competitor), options).pipe(
            map((json: JsonCompetitor) => this.mapper.toObject(json, competitor.getAssociation(), competitor)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(competitor: Competitor): Observable<JsonCompetitor> {
        const url = this.url + '/' + competitor.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((jsonRes: JsonCompetitor) => {
                TheCache.competitors[competitor.getId()] = undefined;
                return jsonRes;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    protected getOptions(association: Association, name?: string): { headers: HttpHeaders; params: HttpParams } {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('associationid', association.getId().toString());
        if (name !== undefined) {
            httpParams = httpParams.set('name', name);
        }
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }

    getUnusedCompetitors(competition: Competition): Competitor[] {
        let unusedCompetitors = this.unusedCompetitors.find(unusedCompetitor => unusedCompetitor.competition === competition);
        if (unusedCompetitors === undefined) {
            unusedCompetitors = { competition: competition, competitors: [] };
            this.unusedCompetitors.push(unusedCompetitors);
        }
        return unusedCompetitors.competitors;
    }
}

export interface UnusedCompetitors {
    competition: Competition;
    competitors: Competitor[];
}
