/**
 * Created by coen on 10-2-17.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Competition } from '../competition';
import { SportRepository } from '../repository';



@Injectable()
export class CompetitionRepository extends SportRepository {

    private url: string;
    // private objects: Competition[];

    constructor(private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'competitions';
    }

    getObjects(): Observable<Competition[]> {
        // if (this.objects !== undefined) {
        //     return Observable.create(observer => {
        //         observer.next(this.objects);
        //         observer.complete();
        //     });
        // }

        return this.http.get(this.url, { headers: super.getHeaders() }).pipe(
            map((res: ICompetition[]) => {
                const objects = this.jsonArrayToObject(res);
                // this.objects = objects;
                return objects;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number): Observable<Competition> {
        const url = this.url + '/' + id;
        return this.http.get(url).pipe(
            map((res: ICompetition) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(jsonObject: any): Observable<Competition> {
        return this.http.post(this.url, jsonObject, { headers: super.getHeaders() }).pipe(
            map((res: ICompetition) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(object: Competition): Observable<Competition> {
        const url = this.url + '/' + object.getId();

        return this.http.put(url, this.objectToJsonHelper(object), { headers: super.getHeaders() }).pipe(
            map((res: ICompetition) => this.jsonToObjectHelper(res, object)),
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

    jsonArrayToObject(jsonArray: ICompetition[]): Competition[] {
        const objects: Competition[] = [];
        for (const json of jsonArray) {
            objects.push(this.jsonToObjectHelper(json));
        }
        return objects;
    }

    jsonToObjectHelper(json: ICompetition, competition?: Competition): Competition {
        if (competition === undefined) {
            competition = new Competition(json.name);
        }
        competition.setId(json.id);
        competition.setAbbreviation(json.abbreviation);
        return competition;
    }

    objectToJsonHelper(object: Competition): any {
        return {
            id: object.getId(),
            name: object.getName(),
            abbreviation: object.getAbbreviation()
        };
    }
}

export interface ICompetition {
    id?: number;
    name: string;
    abbreviation?: string;
}
