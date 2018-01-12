/**
 * Created by coen on 10-2-17.
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Competition } from '../competition';
import { VoetbalRepository } from '../repository';


@Injectable()
export class CompetitionRepository extends VoetbalRepository {

    private url: string;
    private objects: Competition[];

    constructor(private http: HttpClient) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'competitions';
    }

    getObjects(): Observable<Competition[]> {
        if (this.objects !== undefined) {
            return Observable.create(observer => {
                observer.next(this.objects);
                observer.complete();
            });
        }

        return this.http.get(this.url, { headers: super.getHeaders() })
            .map((res: ICompetition[]) => {
                const objects = this.jsonArrayToObject(res);
                this.objects = objects;
                return this.objects;
            })
            .catch(this.handleError);
    }

    jsonArrayToObject(jsonArray: ICompetition[]): Competition[] {
        const objects: Competition[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json);
            objects.push(object);
        }
        return objects;
    }

    getObject(id: number): Observable<Competition> {
        const url = this.url + '/' + id;
        return this.http.get(url)
            // ...and calling .json() on the response to return data
            .map((res: ICompetition) => this.jsonToObjectHelper(res))
            .catch(this.handleError);
    }

    jsonToObjectHelper(json: ICompetition): Competition {
        if (this.objects !== undefined) {
            const foundObjects = this.objects.filter(
                objectIt => objectIt.getId() === json.id
            );
            if (foundObjects.length === 1) {
                return foundObjects.shift();
            }
        }

        const competition = new Competition(json.name);
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

    createObject(jsonObject: any): Observable<Competition> {
        return this.http
            .post(this.url, jsonObject, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: ICompetition) => this.jsonToObjectHelper(res))
            .catch(this.handleError);
    }

    editObject(object: Competition): Observable<Competition> {
        const url = this.url + '/' + object.getId();

        return this.http
            .put(url, JSON.stringify(object), { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: ICompetition) => { console.log(res); return this.jsonToObjectHelper(res); })
            .catch(this.handleError);
    }

    removeObject(object: Competition): Observable<void> {
        const url = this.url + '/' + object.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: Response) => res)
            .catch(this.handleError);
    }
}

export interface ICompetition {
    id?: number;
    name: string;
    abbreviation: string;
}
