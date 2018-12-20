import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Association } from '../association';
import { AssociationMapper, JsonAssociation } from '../association/mapper';
import { SportCache } from '../cache';
import { SportRepository } from '../repository';

@Injectable()
export class AssociationRepository extends SportRepository {

    private url: string;

    constructor(private mapper: AssociationMapper, private http: HttpClient, router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'associations';
    }

    getObjects(): Observable<Association[]> {
        return this.http.get(this.url, { headers: super.getHeaders() }).pipe(
            map((json: JsonAssociation[]) => json.map(jsonAss => this.mapper.toObject(jsonAss))),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number): Observable<Association> {
        const url = this.url + '/' + id;
        return this.http.get(url).pipe(
            map((json: JsonAssociation) => this.mapper.toObject(json)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(json: JsonAssociation): Observable<Association> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((jsonRes: JsonAssociation) => this.mapper.toObject(jsonRes)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(association: Association): Observable<Association> {
        const url = this.url + '/' + association.getId();
        return this.http.put(url, this.mapper.toJson(association), { headers: super.getHeaders() }).pipe(
            map((res: JsonAssociation) => this.mapper.toObject(res, association))
        );
    }

    removeObject(association: Association): Observable<JsonAssociation> {
        const url = this.url + '/' + association.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((json: JsonAssociation) => {
                SportCache.associations[association.getId()] = undefined;
                return json;
            }),
            catchError((err) => this.handleError(err))
        );
    }
}

