/**
 * Created by coen on 30-1-17.
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Association } from '../association';
import { VoetbalRepository } from '../repository';


@Injectable()
export class AssociationRepository extends VoetbalRepository {

    private url: string;
    private objects: Association[];

    constructor(private http: HttpClient) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'associations';
    }

    getObjects(): Observable<Association[]> {
        if (this.objects !== undefined) {
            return Observable.create(observer => {
                observer.next(this.objects);
                observer.complete();
            });
        }

        return this.http.get(this.url, { headers: super.getHeaders() })
            .map((res) => {
                const objects = this.jsonArrayToObject(res);
                this.objects = objects;
                return this.objects;
            })
            .catch(this.handleError);
    }

    jsonArrayToObject(jsonArray: any): Association[] {
        const objects: Association[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json);
            objects.push(object);
        }
        return objects;
    }

    getObject(id: number): Observable<Association> {
        const url = this.url + '/' + id;
        return this.http.get(url)
            // ...and calling .json() on the response to return data
            .map((res: IAssociation) => this.jsonToObjectHelper(res))
            .catch((error: any) => Observable.throw(error.message || 'Server error'));
    }

    createObject(jsonObject: IAssociation): Observable<Association> {
        return this.http
            .post(this.url, jsonObject, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: IAssociation) => this.jsonToObjectHelper(res))
            .catch(this.handleError);
    }

    jsonToObjectHelper(json: IAssociation): Association {
        if (this.objects !== undefined) {
            const foundObjects = this.objects.filter(
                objectIt => objectIt.getId() === json.id
            );
            if (foundObjects.length === 1) {
                return foundObjects.shift();
            }
        }

        const association = new Association(json.name);
        association.setId(json.id);
        return association;
    }

    objectToJsonHelper(object: Association): any {
        const json = {
            id: object.getId(),
            name: object.getName()
        };
        return json;
    }

    editObject(object: Association): Observable<Association> {
        const url = this.url + '/' + object.getId();
        return this.http
            .put(url, JSON.stringify(object), { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: IAssociation) => this.jsonToObjectHelper(res))
            .catch(this.handleError);
    }

    removeObject(object: Association): Observable<void> {
        const url = this.url + '/' + object.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: Response) => res)
            .catch(this.handleError);
    }
}

export interface IAssociation {
    id?: number;
    name: string;
}
