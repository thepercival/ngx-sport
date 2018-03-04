/**
 * Created by coen on 10-2-17.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { AssociationRepository, IAssociation } from '../association/repository';
import { League } from '../league';
import { SportRepository } from '../repository';

@Injectable()
export class LeagueRepository extends SportRepository {

    private url: string;

    constructor(
        private associationRepos: AssociationRepository,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'leagues';
    }

    getObjects(): Observable<League[]> {
        return this.http.get(this.url, { headers: super.getHeaders() }).pipe(
            map((res: ILeague[]) => this.jsonArrayToObject(res)),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number): Observable<League> {
        const url = this.url + '/' + id;
        return this.http.get(url).pipe(
            map((res: ILeague) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: ILeague): Observable<League> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((res: ILeague) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(league: League): Observable<League> {
        const options = {
            headers: super.getHeaders()
        };
        const url = this.url + '/' + league.getId();
        return this.http.put(url, this.objectToJsonHelper(league), options).pipe(
            map((res: ILeague) => this.jsonToObjectHelper(res, league)),
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

    jsonArrayToObject(jsonArray: ILeague[]): League[] {
        const objects: League[] = [];
        for (const json of jsonArray) {
            objects.push(this.jsonToObjectHelper(json));
        }
        return objects;
    }

    jsonToObjectHelper(json: ILeague, league?: League): League {
        if (league === undefined && json.id !== undefined) {
            league = this.cache[json.id];
        }
        if (league === undefined) {
            league = new League(json.name);
            league.setId(json.id);
            this.cache[league.getId()] = league;
        }
        league.setAssociation(this.associationRepos.jsonToObjectHelper(json.association));
        league.setAbbreviation(json.abbreviation);
        league.setSport(json.sport);
        return league;
    }

    objectToJsonHelper(league: League): any {
        return {
            id: league.getId(),
            name: league.getName(),
            abbreviation: league.getAbbreviation(),
            association: league.getAssociation(),
            sport: league.getSport()
        };
    }
}

export interface ILeague {
    id?: number;
    association: IAssociation;
    name: string;
    abbreviation?: string;
    sport: string;
}
