import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Association } from '../association';
import { AssociationRepository } from '../association/repository';
import { Competitionseason } from '../competitionseason';
import { SportRepository } from '../repository';
import { Team } from '../team';


/**
 * Created by coen on 26-2-17.
 */

@Injectable()
export class TeamRepository extends SportRepository {

    private url: string;
    // private teams: Team[];
    private unusedTeams: UnusedTeams[];

    constructor(
        private associationRepos: AssociationRepository,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
        this.unusedTeams = [];
    }

    getUrlpostfix(): string {
        return 'teams';
    }

    getObjects(association: Association): Observable<Team[]> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('associationid', association.getId().toString())
        };
        return this.http.get(this.url, options).pipe(
            map((res: ITeam[]) => {
                return this.jsonArrayToObject(res, association);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number, association: Association): Observable<Team> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('associationid', association.getId().toString())
        };
        return this.http.get(this.url + '/' + id, options).pipe(
            map((res: ITeam) => this.jsonToObjectHelper(res, association)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(jsonTeam: ITeam, association: Association): Observable<Team> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('associationid', association.getId().toString())
        };
        return this.http.post(this.url, jsonTeam, options).pipe(
            map((res: ITeam) => this.jsonToObjectHelper(res, association)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(team: Team): Observable<Team> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('associationid', team.getAssociation().getId().toString())
        };
        return this.http.put(this.url + '/' + team.getId(), this.objectToJsonHelper(team), options).pipe(
            map((res: ITeam) => this.jsonToObjectHelper(res, team.getAssociation(), team)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(team: Team): Observable<Team> {
        const url = this.url + '/' + team.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((teamRes: ITeam) => {
                this.cache[team.getId()] = undefined;
                return teamRes;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: Array<ITeam>, association: Association): Team[] {
        const teams: Team[] = [];
        for (const json of jsonArray) {
            teams.push(this.jsonToObjectHelper(json, association));
        }
        return teams;
    }

    jsonToObjectHelper(json: ITeam, association: Association, team?: Team): Team {
        if (team === undefined && json.id !== undefined) {
            team = this.cache[json.id];
        }
        if (team === undefined) {
            team = new Team(association, json.name);
            team.setId(json.id);
            this.cache[team.getId()] = team;
        }
        team.setAbbreviation(json.abbreviation);
        team.setInfo(json.info);
        return team;
    }

    objectToJsonHelper(team: Team): ITeam {
        const json: ITeam = {
            id: team.getId(),
            name: team.getName(),
            abbreviation: team.getAbbreviation(),
            info: team.getInfo()
        };
        return json;
    }

    getUnusedTeams(competitionSeason: Competitionseason): Team[] {
        let unusedTeams = this.unusedTeams.find(unusedTeam => unusedTeam.competitionSeason === competitionSeason);
        if (unusedTeams === undefined) {
            unusedTeams = { competitionSeason: competitionSeason, teams: [] };
            this.unusedTeams.push(unusedTeams);
        }
        return unusedTeams.teams;
    }
}

export interface ITeam {
    id?: number;
    name: string;
    abbreviation?: string;
    info?: string;
}

export interface UnusedTeams {
    competitionSeason: Competitionseason;
    teams: Team[];
}
