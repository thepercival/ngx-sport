import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Competition } from '../competition';
import { APIRepository } from '../api/repository';
import { Structure } from '../structure';
import { StructureMapper } from '../structure/mapper';
import { JsonStructure } from './mapper';

@Injectable()
export class StructureRepository extends APIRepository {
    private url: string;

    constructor(
        private mapper: StructureMapper,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'structures';
    }

    getObject(competition: Competition): Observable<Structure> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionid', competition.getId().toString())
        };
        return this.http.get(this.url, options).pipe(
            map((json: JsonStructure) => this.mapper.toObject(json, competition)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(structure: Structure, competition: Competition): Observable<Structure> {
        const options = { headers: super.getHeaders() };
        return this.http.put(this.url + '/' + competition.getId(), this.mapper.toJson(structure), options).pipe(
            map((jsonRes: JsonStructure) => this.mapper.toObject(jsonRes, competition)),
            catchError((err) => this.handleError(err))
        );
    }

    /*removeObject(round: Round): Observable<void> {
        const url = this.url + '/' + round.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: Response) => { }),
            catchError((err) => this.handleError(err))
        );
    }*/
}
