import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { Association } from '../association';
import { SportRepository } from '../repository';
import { Team } from '../team';


/**
 * Created by coen on 26-2-17.
 */

@Injectable()
export class TeamRepository extends SportRepository {

    private url: string;
    // private teams: Team[];

    constructor(private http: HttpClient) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
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
            map((res: ITeam) => {
                const teamRes = this.jsonToObjectHelper(res, association);
                return teamRes;
            }),
            catchError( super.handleError )
        );
    }

    editObject(team: Team, association: Association): Observable<Team> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('associationid', '' + association.getId())
        };

        return this.http.put(this.url + '/' + team.getId(), this.objectToJsonHelper(team), options).pipe(
            map((res: ITeam) => {
                return this.jsonToObjectHelper(res, association, team);
            }),
            catchError( super.handleError )
        );
    }

    jsonArrayToObject(jsonArray: Array<ITeam>, association: Association): Team[] {
        const teams: Team[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, association);
            teams.push(object);
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
        return team;
    }

    objectToJsonHelper(object: Team): ITeam {
        const json: ITeam = {
            id: object.getId(),
            name: object.getName(),
            abbreviation: object.getAbbreviation(),
        };
        return json;
    }
}

export interface ITeam {
    id?: number;
    name: string;
    abbreviation?: string;
}
