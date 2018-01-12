/**
 * Created by coen on 30-1-17.
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Competition } from '../../../competition';
import { ExternalSystemRepository } from '../repository';
import { ExternalSystemSoccerOdds } from '../soccerodds';


@Injectable()
export class ExternalSystemSoccerOddsRepository {

    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        private http: Http,
        private externalSystem: ExternalSystemSoccerOdds,
        private externalSystemRepository: ExternalSystemRepository
    ) {
    }

    getToken(): string {
        return this.externalSystem.getApikey();
    }

    getHeaders(): Headers {
        let headers = new Headers(this.headers);
        if (this.getToken() !== undefined) {
            headers = headers.append('X-Mashape-Key', this.getToken());
        }
        return headers;
    }

    getCompetitions(): Observable<Competition[]> {
        const url = this.externalSystem.getApiurl() + 'leagues';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }))
            .map((res) => this.jsonCompetitionsToArrayHelper(res.json()))
            .catch(this.handleError);
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

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error(res);
        // throw an application level error
        return Observable.throw(res.statusText);
    }
}
