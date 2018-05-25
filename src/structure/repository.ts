import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError ,  map } from 'rxjs/operators';

import { Competition } from '../competition';
import { SportRepository } from '../repository';
import { Round } from '../round';
import { IRound, RoundRepository } from '../round/repository';

/**
 * Created by coen on 3-3-17.
 */

@Injectable()
export class StructureRepository extends SportRepository {

    private url: string;
    // private selfCache: Round[] = [];

    constructor(
        private http: HttpClient,
        private roundRepos: RoundRepository,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'structures';
    }

    getObject(competition: Competition): Observable<Round> {
        // const foundStructure = this.findObject(competition);
        // if (foundStructure !== undefined) {
        //     return Observable.create((observer: Observer<Round>) => {
        //         observer.next(foundStructure);
        //         observer.complete();
        //     });
        // }

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionid', competition.getId().toString())
        };

        return this.http.get<Array<IRound>>(this.url, options).pipe(
            map((roundRes: IRound[]) => {
                const jsonRound = roundRes.shift();
                if (jsonRound === undefined) {
                    return undefined;
                }
                const round = this.roundRepos.jsonToObjectHelper(jsonRound, competition);
                // this.updateCache(round, competition);
                return round;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(jsonRound: IRound, competition: Competition, parentRound?: Round): Observable<Round> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionid', competition.getId().toString())
        };
        return this.http.post(this.url, jsonRound, options).pipe(
            map((roundRes: IRound) => {
                const round = this.roundRepos.jsonToObjectHelper(roundRes, competition, parentRound);
                // this.updateCache(round, competition);
                return round;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(round: Round, competition: Competition, parentRound?: Round): Observable<Round> {
        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionid', competition.getId().toString())
        };
        return this.http.put(this.url + '/' + round.getId(), this.roundRepos.objectToJsonHelper(round), options).pipe(
            map((res: IRound) => this.roundRepos.jsonToObjectHelper(res, competition, parentRound, round)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(round: Round): Observable<void> {
        const url = this.url + '/' + round.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: Response) => {
                // this.removeFromCache(round, round.getCompetition());
            }),
            catchError((err) => this.handleError(err))
        );
    }

    // private findObject(competition: Competition) {
    //     return this.selfCache.find(round => round.getCompetition() === competition);
    // }

    // private updateCache(round: Round, competition: Competition) {
    //     this.removeFromCache(round, competition);
    //     this.selfCache.push(round);
    // }

    // private removeFromCache(structure: Round, competition: Competition) {
    //     const foundRound = this.findObject(competition);
    //     if (foundRound !== undefined) {
    //         const index = this.selfCache.indexOf(foundRound);
    //         if (index > -1) {
    //             this.selfCache.splice(index, 1);
    //         }
    //     }
    // }
}
