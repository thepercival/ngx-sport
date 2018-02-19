/**
 * Created by coen on 30-1-17.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Association } from '../association';
import { SportRepository } from '../repository';

@Injectable()
export class AssociationRepository extends SportRepository {

    private url: string;

    constructor(private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'associations';
    }

    getObjects(): Observable<Association[]> {
        return this.http.get(this.url, { headers: super.getHeaders() }).pipe(
            map((res: IAssociation[]) => {
                return this.jsonArrayToObject(res);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number): Observable<Association> {
        const url = this.url + '/' + id;
        return this.http.get(url).pipe(
            map((res: IAssociation) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(jsonObject: IAssociation): Observable<Association> {
        return this.http.post(this.url, jsonObject, { headers: super.getHeaders() }).pipe(
            map((res: IAssociation) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(object: Association): Observable<Association> {
        const url = this.url + '/' + object.getId();
        return this.http.put(url, this.objectToJsonHelper(object), { headers: super.getHeaders() }).pipe(
            map((res: IAssociation) => this.jsonToObjectHelper(res, object))
        );
    }

    removeObject(association: Association): Observable<IAssociation> {
        const url = this.url + '/' + association.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((associationRes: IAssociation) => {
                this.cache[association.getId()] = undefined;
                return associationRes;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: IAssociation[]): Association[] {
        const objects: Association[] = [];
        for (const json of jsonArray) {
            objects.push(this.jsonToObjectHelper(json));
        }
        return objects;
    }

    jsonToObjectHelper(json: IAssociation, association?: Association): Association {
        if (association === undefined && json.id !== undefined) {
            association = this.cache[json.id];
        }
        if (association === undefined) {
            association = new Association(json.name);
            association.setId(json.id);
            this.cache[association.getId()] = association;
        }
        association.setDescription(json.description);

        if (json.parent !== undefined) {
            association.setParent(this.jsonToObjectHelper(json.parent, association ? association.getParent() : undefined));
        }
        return association;
    }

    objectToJsonHelper(object: Association): IAssociation {
        const json: IAssociation = {
            id: object.getId(),
            name: object.getName(),
            description: object.getDescription(),
            parent: object.getParent() ? this.objectToJsonHelper(object.getParent()) : undefined
        };
        return json;
    }
}

export interface IAssociation {
    id?: number;
    name: string;
    description?: string;
    parent?: IAssociation;
}
