import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Association } from '../association';
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

    constructor(private http: HttpClient, router: Router) {
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

    // getObjects(): Observable<Team[]> {
    //     if (this.objects !== undefined) {
    //         return Observable.create(observer => {
    //             observer.next(this.objects);
    //             observer.complete();
    //         });
    //     }

    //     return this.http.get(this.url, { headers: super.getHeaders() })
    //         .map((res) => {
    //             const objects = this.jsonArrayToObject(res);
    //             this.objects = objects;
    //             return this.objects;
    //         })
    //         .catch(super.handleError);
    // }

    createObject(jsonTeam: ITeam, association: Association): Observable<Team> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('associationid', '' + association.getId())
        };
        return this.http.post(this.url, jsonTeam, options).pipe(
            map((res: ITeam) => this.jsonToObjectHelper(res, association)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(team: Team, association: Association): Observable<Team> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('associationid', '' + association.getId())
        };
        return this.http.put(this.url + '/' + team.getId(), this.objectToJsonHelper(team), options).pipe(
            map((res: ITeam) => this.jsonToObjectHelper(res, association, team)),
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
            team = association.getTeamByName(json.name);
        }
        if (team === undefined) {
            team = new Team(association, json.name);
        }
        team.setId(json.id);
        team.setAbbreviation(json.abbreviation);
        team.setInfo(json.info);
        return team;
    }

    objectToJsonHelper(object: Team): ITeam {
        const json: ITeam = {
            id: object.getId(),
            name: object.getName(),
            abbreviation: object.getAbbreviation(),
            info: object.getInfo(),
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
