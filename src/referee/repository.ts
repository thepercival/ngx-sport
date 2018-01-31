import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { Competitionseason } from '../competitionseason';
import { Referee } from '../referee';
import { SportRepository } from '../repository';

@Injectable()
export class RefereeRepository extends SportRepository {

    private url: string;

    constructor(
        private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'referees';
    }

    createObject(jsonReferee: IReferee, competitionseason: Competitionseason): Observable<Referee> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId().toString())
        };
        return this.http.post(this.url, jsonReferee, options).pipe(
            map((res: IReferee) => this.jsonToObjectHelper(res, competitionseason)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(referee: Referee, competitionseason: Competitionseason): Observable<Referee> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId().toString())
        };
        return this.http.put(this.url + '/' + referee.getId(), this.objectToJsonHelper(referee), options).pipe(
            map((res: IReferee) => this.jsonToObjectHelper(res, competitionseason, referee)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(referee: Referee): Observable<any> {
        const url = this.url + '/' + referee.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: any) => {
                referee.getCompetitionseason().removeReferee(referee);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: IReferee[], competitionseason: Competitionseason): Referee[] {
        const objects: Referee[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, competitionseason);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IReferee, competitionseason: Competitionseason, referee?: Referee): Referee {
        if (referee === undefined) {
            referee = new Referee(competitionseason, json.initials);
        }
        referee.setId(json.id);
        referee.setName(json.name);
        referee.setInfo(json.info);
        // this.cache.push(referee);
        return referee;
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Referee): IReferee {
        const json: IReferee = {
            id: object.getId(),
            initials: object.getInitials(),
            name: object.getName(),
            info: object.getInfo()
        };
        return json;
    }
}

export interface IReferee {
    id?: number;
    initials: string;
    name?: string;
    info?: string;
}
