import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { AssociationRepository, IAssociation } from '../association/repository';
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

    // getObject(id: number): Observable<Team> {
    //     const url = this.url + '/' + id;
    //     return this.http.get(url)
    //         // ...and calling .json() on the response to return data
    //         .map((res) => this.jsonToObjectHelper(res))
    //         .catch((error: any) => Observable.throw(error.message || 'Server error'));
    // }

    getObjects(): Observable<Team[]> {
        return this.http.get(this.url, { headers: super.getHeaders() }).pipe(
            map((res: ITeam[]) => {
                return this.jsonArrayToObject(res);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number): Observable<Team> {
        const url = this.url + '/' + id;
        return this.http.get(url).pipe(
            map((res: ITeam) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(jsonTeam: ITeam): Observable<Team> {
        const options = {
            headers: super.getHeaders()
        };
        return this.http.post(this.url, jsonTeam, options).pipe(
            map((res: ITeam) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(team: Team): Observable<Team> {
        const options = {
            headers: super.getHeaders()
        };
        return this.http.put(this.url + '/' + team.getId(), this.objectToJsonHelper(team), options).pipe(
            map((res: ITeam) => this.jsonToObjectHelper(res, team)),
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

    jsonArrayToObject(jsonArray: Array<ITeam>): Team[] {
        const teams: Team[] = [];
        for (const json of jsonArray) {
            teams.push(this.jsonToObjectHelper(json));
        }
        return teams;
    }

    jsonToObjectHelper(json: ITeam, team?: Team): Team {
        if (team === undefined && json.id !== undefined) {
            team = this.cache[json.id];
        }
        if (team === undefined) {
            const association = this.associationRepos.jsonToObjectHelper(json.association);
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
            info: team.getInfo(),
            association: this.associationRepos.objectToJsonHelper(team.getAssociation())
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
    association: IAssociation;
}

export interface UnusedTeams {
    competitionSeason: Competitionseason;
    teams: Team[];
}
