import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Competitionseason } from '../competitionseason';
import { Field } from '../field';
import { VoetbalRepository } from '../repository';

@Injectable()
export class FieldRepository extends VoetbalRepository {

    private url: string;

    constructor(
        private http: HttpClient) {
        super();
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

        return this.http
            .post(this.url, jsonField, options)
            .map((res: IField) => {
                const fieldRes = this.jsonToObjectHelper(res, competitionseason);
                return fieldRes;
            })
            .catch(this.handleError);
    }

    editObject(field: Field, competitionseason: Competitionseason): Observable<Field> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId().toString())
        };

        return this.http
            .put(this.url + '/' + field.getId(), this.objectToJsonHelper(field), options)
            .map((res: IField) => {
                return this.jsonToObjectHelper(res, competitionseason, field);
            })
            .catch(this.handleError);
    }

    removeObject(field: Field): Observable<void> {
        const url = this.url + '/' + field.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            .map((res) => {
                field.getCompetitionseason().removeField(field);
            })
            .catch(this.handleError);
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
