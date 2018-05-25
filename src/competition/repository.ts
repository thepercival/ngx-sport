/**
 * Created by coen on 16-2-17.
 */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError ,  map } from 'rxjs/operators';

import { AssociationRepository } from '../association/repository';
import { Competition } from '../competition';
import { FieldRepository, IField } from '../field/repository';
import { ILeague, LeagueRepository } from '../league/repository';
import { IReferee, RefereeRepository } from '../referee/repository';
import { SportRepository } from '../repository';
import { ISeason, SeasonRepository } from '../season/repository';

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

    getObjects(): Observable<Competition[]> {
        const options = this.getOptions();
        return this.http.get(this.url, options).pipe(
            map((res: ICompetition[]) => {
                this.objects = this.jsonArrayToObject(res);
                return this.objects;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number): Observable<Competition> {
        const options = this.getOptions();
        return this.http.get(this.url + '/' + id, options).pipe(
            map((res: ICompetition) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: ICompetition): Observable<Competition> {
        const options = this.getOptions();
        return this.http.post(this.url, json, options).pipe(
            map((res: ICompetition) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(competition: Competition): Observable<Competition> {
        const url = this.url + '/' + competition.getId();
        const options = this.getOptions();
        return this.http.put(url, this.objectToJsonHelper(competition), options).pipe(
            map((res: ICompetition) => this.jsonToObjectHelper(res, competition)),
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

    protected getOptions(): { headers: HttpHeaders } {
        return {
            headers: super.getHeaders()
        };
    }

    jsonArrayToObject(jsonArray: ICompetition[]): Competition[] {
        const competitions: Competition[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json);
            competitions.push(object);
        }
        return competitions;
    }

    jsonToObjectHelper(json: ICompetition, competition?: Competition): Competition {
        if (competition === undefined) {
            const league = this.leagueRepository.jsonToObjectHelper(json.league);
            const season = this.seasonRepository.jsonToObjectHelper(json.season);
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
            league: this.leagueRepository.objectToJsonHelper(object.getLeague()),
            season: this.seasonRepository.objectToJsonHelper(object.getSeason()),
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
    league: ILeague;
    season: ISeason;
    fields: IField[];
    referees: IReferee[];
    startDateTime: string;
    state: number;
}
