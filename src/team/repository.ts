import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Association } from '../association';
import { TeamMapper, JsonTeam } from '../team/mapper';
import { Competition } from '../competition';
import { SportRepository } from '../repository';
import { Team } from '../team';
import { SportCache } from '../cache';

@Injectable()
export class TeamRepository extends SportRepository {

    private url: string;
    private mapper: TeamMapper;
    private unusedTeams: UnusedTeams[];

    constructor(
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
        this.unusedTeams = [];
        this.mapper = new TeamMapper();
    }

    getUrlpostfix(): string {
        return 'teams';
    }

    getObjects(association: Association, name?: string): Observable<Team[]> {
        const options = this.getOptions(association, name);
        return this.http.get(this.url, options).pipe(
            map((json: JsonTeam[]) => json.map( jsonTeam => this.mapper.toObject(jsonTeam, association))),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number, association: Association): Observable<Team> {
        const options = this.getOptions(association);
        return this.http.get(this.url + '/' + id, options).pipe(
            map((json: JsonTeam) => this.mapper.toObject(json, association)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonTeam, association: Association): Observable<Team> {
        const options = this.getOptions(association);
        return this.http.post(this.url, json, options).pipe(
            map((jsonRes: JsonTeam) => this.mapper.toObject(jsonRes, association)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(team: Team): Observable<Team> {
        const options = this.getOptions(team.getAssociation());
        return this.http.put(this.url + '/' + team.getId(), this.mapper.toJson(team), options).pipe(
            map((json: JsonTeam) => this.mapper.toObject(json, team.getAssociation(), team)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(team: Team): Observable<JsonTeam> {
        const url = this.url + '/' + team.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((jsonRes: JsonTeam) => {
                SportCache[team.getId()] = undefined;
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

    getUnusedTeams(competition: Competition): Team[] {
        let unusedTeams = this.unusedTeams.find(unusedTeam => unusedTeam.competition === competition);
        if (unusedTeams === undefined) {
            unusedTeams = { competition: competition, teams: [] };
            this.unusedTeams.push(unusedTeams);
        }
        return unusedTeams.teams;
    }
}

export interface UnusedTeams {
    competition: Competition;
    teams: Team[];
}
