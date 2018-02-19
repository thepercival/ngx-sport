/**
 * Created by coen on 17-2-17.
 */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Competition } from './../../competition';
import { ExternalSystem } from './../system';
import { ExternalSystemCompetitionInterface } from './interface';

export class ExternalSystemBetFair implements ExternalSystemCompetitionInterface {

    constructor(
        private http: HttpClient,
        private externalSystem: ExternalSystem,
        router: Router
    ) {

    }

    getApiurl(): string {
        return this.externalSystem.getApiurl();
    }

    getToken(): string {
        return this.externalSystem.getApikey();
    }

    getHeaders(): HttpHeaders {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
        const token = this.getToken();
        if (token !== undefined) {
            headers = headers.append('Authorization', 'Bearer ' + token);
        }
        return headers;
    }

    getCompetitions(): Observable<Competition[]> {
        // const cacheName = 'Competition';
        // const jsonObjects = this.getCacheItem(cacheName);
        // if (jsonObjects !== undefined) {
        //     return Observable.create(observer => {
        //         observer.next(this.jsonCompetitionsToArrayHelper(jsonObjects));
        //         observer.complete();
        //     });
        // }

        const url = this.getApiurl() + 'leagues';
        return this.http.get(url, { headers: this.getHeaders() }).pipe(
            map((res: any) => {
                const json = res.data;
                const objects = this.jsonCompetitionsToArrayHelper(json.leagues);
                // this.setCacheItem(cacheName, JSON.stringify(json.leagues), this.getExpireDate('Competition'));
                return objects;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonCompetitionsToArrayHelper(jsonArray: any): Competition[] {
        const competitions: Competition[] = [];
        for (const json of jsonArray) {
            const object = this.jsonCompetitionToObjectHelper(json);
            competitions.push(object);
        }
        return competitions;
    }

    jsonCompetitionToObjectHelper(json: any): Competition {
        // identifier: "8e7fa444c4b60383727fb61fcc6aa387",
        // league_slug: "bundesliga",
        // name: "Bundesliga",
        // nation: "Germany",
        // level: "1"
        // cup: false,
        // federation: "UEFA"

        const competition = new Competition(json.name);
        competition.setId(json.league_slug);
        competition.setAbbreviation(competition.getName().substr(0, Competition.MAX_LENGTH_ABBREVIATION));
        // this.setAsspociationByCompetitionId(competition.getId(), this.jsonAssociationToObjectHelper(json));

        return competition;
    }

    protected handleError(error: HttpErrorResponse): Observable<any> {
        let errortext = 'onbekende fout';
        console.error(error);
        if (typeof error.error === 'string') {
            errortext = error.error;
        } else if (error.statusText !== undefined) {
            errortext = error.statusText;
        }
        return Observable.throw(errortext);
    }
}
