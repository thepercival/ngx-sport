import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { Competitionseason } from '../competitionseason';
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

    createObject(jsonField: IField, competitionseason: Competitionseason): Observable<Field> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId().toString())
        };

        console.log('field posted', jsonField);

        return this.http.post(this.url, jsonField, options).pipe(
            map((res: IField) => {
                const fieldRes = this.jsonToObjectHelper(res, competitionseason);
                return fieldRes;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(field: Field, competitionseason: Competitionseason): Observable<Field> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId().toString())
        };

        return this.http.put(this.url + '/' + field.getId(), this.objectToJsonHelper(field), options).pipe(
            map((res: IField) => {
                return this.jsonToObjectHelper(res, competitionseason, field);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(field: Field): Observable<void> {
        const url = this.url + '/' + field.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res) => {
                field.getCompetitionseason().removeField(field);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: IField[], competitionseason: Competitionseason): Field[] {
        const objects: Field[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, competitionseason);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IField, competitionseason: Competitionseason, field?: Field): Field {
        if (field === undefined) {
            field = new Field(competitionseason, json.number);
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
