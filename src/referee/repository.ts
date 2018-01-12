import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Competitionseason } from '../competitionseason';
import { Referee } from '../referee';
import { VoetbalRepository } from '../repository';

@Injectable()
export class RefereeRepository extends VoetbalRepository {

    private url: string;

    constructor(
        private http: HttpClient) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'referees';
    }

    createObject(jsonReferee: IReferee, competitionseason: Competitionseason): Observable<Referee> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId().toString())
        };

        console.log('referee posted', jsonReferee);

        return this.http
            .post(this.url, jsonReferee, options)
            .map((res: IReferee) => {
                const refereeRes = this.jsonToObjectHelper(res, competitionseason);
                return refereeRes;
            })
            .catch(this.handleError);
    }

    editObject(referee: Referee, competitionseason: Competitionseason): Observable<Referee> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId().toString())
        };

        return this.http
            .put(this.url + '/' + referee.getId(), this.objectToJsonHelper(referee), options)
            .map((res: IReferee) => {
                return this.jsonToObjectHelper(res, competitionseason, referee);
            })
            .catch(this.handleError);
    }

    removeObject(referee: Referee): Observable<void> {
        const url = this.url + '/' + referee.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            .map((res) => {
                referee.getCompetitionseason().removeReferee(referee);
            })
            .catch(this.handleError);
    }

    jsonArrayToObject(jsonArray: IReferee[], competitionseason: Competitionseason): Referee[] {
        const objects: Referee[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, competitionseason);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IReferee, competitionseason: Competitionseason, referee?: Referee): Referee {
        if (referee === undefined) {
            referee = new Referee(competitionseason, json.number);
        }
        referee.setId(json.id);
        referee.setName(json.name);
        // this.cache.push(referee);
        return referee;
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Referee): IReferee {
        const json: IReferee = {
            'id': object.getId(),
            'number': object.getNumber(),
            'name': object.getName()
        };
        return json;
    }
}

export interface IReferee {
    id?: number;
    number: number;
    name: string;
}
