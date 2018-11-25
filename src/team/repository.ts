import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Association } from '../association';
import { AssociationRepository } from '../association/repository';
import { Competition } from '../competition';
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

    getObjects(association: Association, name?: string): Observable<Team[]> {
        const options = this.getOptions(association, name);
        return this.http.get(this.url, options).pipe(
            map((res: ITeam[]) => {
                return this.jsonArrayToObject(res, association);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number, association: Association): Observable<Team> {
        const options = this.getOptions(association);
        return this.http.get(this.url + '/' + id, options).pipe(
            map((res: ITeam) => this.jsonToObject(res, association)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(jsonTeam: ITeam, association: Association): Observable<Team> {
        const options = this.getOptions(association);
        return this.http.post(this.url, jsonTeam, options).pipe(
            map((res: ITeam) => this.jsonToObject(res, association)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(team: Team): Observable<Team> {
        const options = this.getOptions(team.getAssociation());
        return this.http.put(this.url + '/' + team.getId(), this.objectToJson(team), options).pipe(
            map((res: ITeam) => this.jsonToObject(res, team.getAssociation(), team)),
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

    jsonArrayToObject(jsonArray: Array<ITeam>, association: Association): Team[] {
        const teams: Team[] = [];
        for (const json of jsonArray) {
            teams.push(this.jsonToObject(json, association));
        }
        return teams;
    }

    jsonToObject(json: ITeam, association: Association, team?: Team): Team {
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
        team.setImageUrl(json.imageUrl);
        return team;
    }

    objectToJson(team: Team): ITeam {
        const json: ITeam = {
            id: team.getId(),
            name: team.getName(),
            abbreviation: team.getAbbreviation(),
            info: team.getInfo(),
            imageUrl: team.getImageUrl()
        };
        return json;
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

export interface ITeam {
    id?: number;
    name: string;
    abbreviation?: string;
    info?: string;
    imageUrl?: string;
}

export interface UnusedTeams {
    competition: Competition;
    teams: Team[];
}
