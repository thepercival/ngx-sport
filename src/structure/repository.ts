import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Competition } from '../competition';
import { SportRepository } from '../repository';
import { IRoundNumber, RoundNumberRepository } from '../round/number/repository';
import { IRound, RoundRepository } from '../round/repository';
import { Structure } from '../structure';

/**
 * Created by coen on 3-3-17.
 */

@Injectable()
export class StructureRepository extends SportRepository {
    private url: string;

    constructor(
        private http: HttpClient,
        private roundRepos: RoundRepository,
        private roundNumberRepos: RoundNumberRepository,
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
            map((json: IStructure) => this.jsonToObject(json, competition)),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(jsonStructure: IStructure, competition: Competition): Observable<Structure> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionid', competition.getId().toString())
        };
        return this.http.post(this.url, jsonStructure, options).pipe(
            map((structureRes: IStructure) => this.jsonToObject(structureRes, competition)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(structure: Structure, competition: Competition): Observable<Structure> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionid', competition.getId().toString())
        };
        return this.http.put(this.url + '/' + competition.getId(), this.objectToJson(structure), options).pipe(
            map((res: IStructure) => this.jsonToObject(res, competition)),
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

    objectToJson(structure: Structure): IStructure {
        return {
            firstRoundNumber: this.roundNumberRepos.objectToJson(structure.getFirstRoundNumber()),
            rootRound: this.roundRepos.objectToJson(structure.getRootRound())
        };
    }

    jsonToObject(json: IStructure, competition: Competition): Structure {
        const firstRoundNumber = this.roundNumberRepos.jsonToObject(json.firstRoundNumber, competition);
        return new Structure(firstRoundNumber, this.roundRepos.jsonToObject(json.rootRound, firstRoundNumber));
    }
}

export class IStructure {
    firstRoundNumber: IRoundNumber;
    rootRound: IRound;
}
