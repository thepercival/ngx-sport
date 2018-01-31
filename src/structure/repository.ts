import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { Competitionseason } from '../competitionseason';
import { SportRepository } from '../repository';
import { Round } from '../round';
import { IRound, RoundRepository } from '../round/repository';

/**
 * Created by coen on 3-3-17.
 */

@Injectable()
export class StructureRepository extends SportRepository {

    private url: string;
    private cache: Round[] = [];

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

    getObject(competitionseason: Competitionseason): Observable<Round> {
        const foundStructure = this.findObject(competitionseason);
        if (foundStructure !== undefined) {
            return Observable.create((observer: Observer<Round>) => {
                observer.next(foundStructure);
                observer.complete();
            });
        }

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId().toString())
        };

        return this.http.get<Array<IRound>>(this.url, options).pipe(
            map((res) => {
                const jsonRound = res.shift();
                console.log(jsonRound);
                const round = this.roundRepos.jsonToObjectHelper(jsonRound, competitionseason);
                this.updateCache(round, competitionseason);
                return round;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    createObject(round: Round, competitionseason: Competitionseason): Observable<Round> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId().toString())
        };

        console.log('posted', this.roundRepos.objectToJsonHelper(round));

        return this.http.post(this.url, this.roundRepos.objectToJsonHelper(round), options).pipe(
            map((res: IRound) => {
                console.log(res);
                const roundOut = this.roundRepos.jsonToObjectHelper(res, competitionseason);
                this.updateCache(roundOut, competitionseason);
                return roundOut;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(round: Round, competitionseason: Competitionseason): Observable<Round> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId().toString())
        };

        console.log('puted', this.roundRepos.objectToJsonHelper(round));

        return this.http.put(this.url + '/' + round.getId(), this.roundRepos.objectToJsonHelper(round), options).pipe(
            map((res: IRound) => {
                console.log(res);
                const roundOut = this.roundRepos.jsonToObjectHelper(res, competitionseason);
                this.updateCache(roundOut, competitionseason);
                return roundOut;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(round: Round): Observable<void> {
        const url = this.url + '/' + round.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: Response) => {
                this.removeFromCache(round, round.getCompetitionseason());
            }),
            catchError((err) => this.handleError(err))
        );
    }

    private findObject(competitionseason: Competitionseason) {
        return this.cache.find(round => round.getCompetitionseason() === competitionseason);
    }

    private updateCache(round: Round, competitionseason: Competitionseason) {
        this.removeFromCache(round, competitionseason);
        this.cache.push(round);
    }

    private removeFromCache(structure: Round, competitionseason: Competitionseason) {
        const foundRound = this.findObject(competitionseason);
        if (foundRound !== undefined) {
            const index = this.cache.indexOf(foundRound);
            if (index > -1) {
                this.cache.splice(index, 1);
            }
        }
    }
}
