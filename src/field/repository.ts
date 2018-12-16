import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Competition } from '../competition';
import { Field } from '../field';
import { JsonField, FieldMapper } from './mapper';
import { SportRepository } from '../repository';


@Injectable()
export class FieldRepository extends SportRepository {

    private url: string;

    constructor(
        private mapper: FieldMapper, private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'fields';
    }

    createObject(json: JsonField, competition: Competition): Observable<Field> {
        return this.http.post(this.url, json, this.getOptions(competition)).pipe(
            map((jsonRes: JsonField) => this.mapper.toObject(jsonRes, competition)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(field: Field, competition: Competition): Observable<Field> {
        return this.http.put(this.url + '/' + field.getId(), this.mapper.toJson(field), this.getOptions(competition)).pipe(
            map((res: JsonField) => this.mapper.toObject(res, competition, field)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(field: Field, competition: Competition): Observable<void> {
        const url = this.url + '/' + field.getId();
        return this.http.delete(url, this.getOptions(competition)).pipe(
            map((res) => {
                field.getCompetition().removeField(field);
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
