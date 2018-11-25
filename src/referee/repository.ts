import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Competition } from '../competition';
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

    createObject(jsonReferee: IReferee, competition: Competition): Observable<Referee> {
        return this.http.post(this.url, jsonReferee, this.getOptions(competition)).pipe(
            map((res: IReferee) => this.jsonToObject(res, competition)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(referee: Referee, competition: Competition): Observable<Referee> {
        return this.http.put(this.url + '/' + referee.getId(), this.objectToJson(referee), this.getOptions(competition)).pipe(
            map((res: IReferee) => this.jsonToObject(res, competition, referee)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(referee: Referee, competition: Competition): Observable<any> {
        const url = this.url + '/' + referee.getId();
        return this.http.delete(url, this.getOptions(competition)).pipe(
            map((res: any) => {
                referee.getCompetition().removeReferee(referee);
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

    jsonArrayToObject(jsonArray: IReferee[], competition: Competition): Referee[] {
        const objects: Referee[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObject(json, competition);
            objects.push(object);
        }
        return objects;
    }

    jsonToObject(json: IReferee, competition: Competition, referee?: Referee): Referee {
        if (referee === undefined) {
            referee = new Referee(competition, json.initials);
        }
        referee.setId(json.id);
        referee.setName(json.name);
        referee.setInfo(json.info);
        referee.setEmailaddress(json.emailaddress);
        return referee;
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJson(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJson(object: Referee): IReferee {
        const json: IReferee = {
            id: object.getId(),
            initials: object.getInitials(),
            name: object.getName(),
            emailaddress: object.getEmailaddress(),
            info: object.getInfo()
        };
        return json;
    }
}

export interface IReferee {
    id?: number;
    initials: string;
    name?: string;
    emailaddress?: string;
    info?: string;
}
