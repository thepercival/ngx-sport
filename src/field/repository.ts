import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Competition } from '../competition';
import { Field } from '../field';
import { SportRepository } from '../repository';


@Injectable()
export class FieldRepository extends SportRepository {

    private url: string;

    constructor(
        private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'fields';
    }

    createObject(jsonField: IField, competition: Competition): Observable<Field> {
        return this.http.post(this.url, jsonField, this.getOptions(competition)).pipe(
            map((res: IField) => this.jsonToObjectHelper(res, competition)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(field: Field, competition: Competition): Observable<Field> {
        return this.http.put(this.url + '/' + field.getId(), this.objectToJsonHelper(field), this.getOptions(competition)).pipe(
            map((res: IField) => this.jsonToObjectHelper(res, competition, field)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(field: Field, competition: Competition): Observable<void> {
        const url = this.url + '/' + field.getId();
        return this.http.delete(url, this.getOptions(competition)).pipe(
            map((res) => {
                field.getCompetition().removeField(field);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    protected getOptions(competition: Competition): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('competitionid', competition.getId().toString());
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }

    jsonArrayToObject(jsonArray: IField[], competition: Competition): Field[] {
        const objects: Field[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, competition);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IField, competition: Competition, field?: Field): Field {
        if (field === undefined) {
            field = new Field(competition, json.number);
        }
        field.setId(json.id);
        field.setName(json.name);
        // this.cache.push(field);
        return field;
    }

    objectsToJsonArray(objects: Field[]): any[] {
        const jsonArray: IField[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Field): IField {
        const json: IField = {
            id: object.getId(),
            number: object.getNumber(),
            name: object.getName()
        };
        return json;
    }
}

export interface IField {
    id?: number;
    number: number;
    name: string;
}
