import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { AssociationRepository } from '../association/repository';
import { Competition } from '../competition';
import { FieldRepository, IField } from '../field/repository';
import { League } from '../league';
import { LeagueRepository } from '../league/repository';
import { IReferee, RefereeRepository } from '../referee/repository';
import { SportRepository } from '../repository';
import { Season } from '../season';
import { SeasonRepository } from '../season/repository';

/**
 * Created by coen on 16-2-17.
 */
@Injectable()
export class CompetitionRepository extends SportRepository {

    private url: string;
    private objects: Competition[];

    constructor(private http: HttpClient,
        private associationRepository: AssociationRepository,
        private leagueRepository: LeagueRepository,
        private seasonRepository: SeasonRepository,
        private fieldRepository: FieldRepository,
        private refereeRepository: RefereeRepository,
        router: Router
    ) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'competitions';
    }

    getObjects(league: League, season: Season): Observable<Competition[]> {
        const options = this.getOptions(league, season);
        return this.http.get(this.url, options).pipe(
            map((res: ICompetition[]) => {
                this.objects = this.jsonArrayToObject(res, league, season);
                return this.objects;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number, league: League, season: Season): Observable<Competition> {
        const options = this.getOptions(league, season);
        return this.http.get(this.url + '/' + id, options).pipe(
            map((res: ICompetition) => this.jsonToObjectHelper(res, league, season)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: ICompetition, league: League, season: Season): Observable<Competition> {
        const options = this.getOptions(league, season);
        return this.http.post(this.url, json, options).pipe(
            map((res: ICompetition) => this.jsonToObjectHelper(res, league, season)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(competition: Competition): Observable<Competition> {
        const url = this.url + '/' + competition.getId();
        const options = this.getOptions(competition.getLeague(), competition.getSeason());
        return this.http.put(url, this.objectToJsonHelper(competition), options).pipe(
            map((res: ICompetition) => this.jsonToObjectHelper(res, competition.getLeague(), competition.getSeason())),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(object: Competition): Observable<Competition> {
        const url = this.url + '/' + object.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: Competition) => res),
            catchError((err) => this.handleError(err))
        );
    }

    protected getOptions(league: League, season: Season): { headers: HttpHeaders; params: HttpParams } {
        return {
            headers: super.getHeaders(),
            params: new HttpParams()
                .set('leagueid', league.getId().toString())
                .set('seasonid', season.getId().toString())
        };
    }

    jsonArrayToObject(jsonArray: ICompetition[], league: League, season: Season): Competition[] {
        const competitions: Competition[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, league, season);
            competitions.push(object);
        }
        return competitions;
    }

    jsonToObjectHelper(json: ICompetition, league: League, season: Season, competition?: Competition): Competition {
        if (competition === undefined) {
            competition = new Competition(league, season);
        }
        competition.setId(json.id);
        competition.setState(json.state);
        competition.setStartDateTime(new Date(json.startDateTime));
        this.fieldRepository.jsonArrayToObject(json.fields, competition);
        this.refereeRepository.jsonArrayToObject(json.referees, competition);
        return competition;
    }

    objectToJsonHelper(object: Competition): ICompetition {
        const json: ICompetition = {
            id: object.getId(),
            fields: this.fieldRepository.objectsToJsonArray(object.getFields()),
            referees: this.refereeRepository.objectsToJsonArray(object.getReferees()),
            startDateTime: object.getStartDateTime().toISOString(),
            state: object.getState()
        };
        return json;
    }
}

export interface ICompetition {
    id?: number;
    fields: IField[];
    referees: IReferee[];
    startDateTime: string;
    state: number;
}
