/**
 * Created by coen on 30-1-17.
 */
import { SportRepository } from '../../../repository';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { Competition } from '../../../competition';
import { ExternalSystemRepository } from '../repository';
import { ExternalSystemSoccerOdds } from '../soccerodds';


@Injectable()
export class ExternalSystemSoccerOddsRepository extends SportRepository {

    constructor(
        private http: HttpClient,
        private externalSystem: ExternalSystemSoccerOdds,
        private externalSystemRepository: ExternalSystemRepository,
        router: Router
    ) {
        super(router);
    }

    getToken(): string {
        return this.externalSystem.getApikey();
    }

    getHeaders(): HttpHeaders {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (this.getToken() !== undefined) {
            headers = headers.append('X-Mashape-Key', this.getToken());
        }
        return headers;
    }

    getCompetitions(): Observable<Competition[]> {
        const url = this.externalSystem.getApiurl() + 'leagues';
        return this.http.get(url, { headers: this.getHeaders() }).pipe(
            map((res) => this.jsonCompetitionsToArrayHelper(res)),
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
        const competition = new Competition(json.name);
        competition.setId(json.leagueId);
        competition.setAbbreviation(competition.getName().substr(0, Competition.MAX_LENGTH_ABBREVIATION));

        return competition;
    }
}
