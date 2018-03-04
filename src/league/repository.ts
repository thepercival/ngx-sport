/**
 * Created by coen on 10-2-17.
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Association } from '../association';
import { League } from '../league';
import { SportRepository } from '../repository';



@Injectable()
export class LeagueRepository extends SportRepository {

    private url: string;

    constructor(private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'leagues';
    }

    getObjects(association: Association): Observable<League[]> {
        return this.http.get(this.url, { headers: super.getHeaders() }).pipe(
            map((res: ILeague[]) => this.jsonArrayToObject(res, association)),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number, association: Association): Observable<League> {
        const url = this.url + '/' + id;
        return this.http.get(url).pipe(
            map((res: ILeague) => this.jsonToObjectHelper(res, association)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: ILeague, association: Association): Observable<League> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((res: ILeague) => this.jsonToObjectHelper(res, association)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(league: League): Observable<League> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('associationid', league.getAssociation().getId().toString())
        };
        const url = this.url + '/' + league.getId();
        return this.http.put(url, this.objectToJsonHelper(league), options).pipe(
            map((res: ILeague) => this.jsonToObjectHelper(res, league.getAssociation(), league)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(league: League): Observable<League> {
        const url = this.url + '/' + league.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((leagueRes: League) => {
                this.cache[league.getId()] = undefined;
                return leagueRes;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: ILeague[], association: Association): League[] {
        const objects: League[] = [];
        for (const json of jsonArray) {
            objects.push(this.jsonToObjectHelper(json, association));
        }
        return objects;
    }

    jsonToObjectHelper(json: ILeague, association: Association, league?: League): League {
        if (league === undefined && json.id !== undefined) {
            league = this.cache[json.id];
        }
        if (league === undefined) {
            league = new League(association, json.name);
            league.setId(json.id);
            this.cache[league.getId()] = league;
        }
        league.setAbbreviation(json.abbreviation);
        league.setSport(json.sport);
        return league;
    }

    objectToJsonHelper(league: League): any {
        return {
            id: league.getId(),
            name: league.getName(),
            abbreviation: league.getAbbreviation(),
            sport: league.getSport()
        };
    }
}

export interface ILeague {
    id?: number;
    name: string;
    abbreviation?: string;
    sport: string;
}
