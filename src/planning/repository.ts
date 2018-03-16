import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { Game } from '../game';
import { GameRepository } from '../game/repository';
import { SportRepository } from '../repository';
import { Round } from '../round';

/**
 * Created by coen on 3-3-17.
 */

@Injectable()
export class PlanningRepository extends SportRepository {

    private url: string;
    private selfCache: Round[] = [];

    constructor(
        private http: HttpClient,
        private gameRepos: GameRepository,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'games';
    }

    createObject(round: Round): Observable<Game[]> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('roundid', round.getCompetition().getId().toString())
        };

        const reposCreates: Observable<Game>[] = [];

        round.getPoules().forEach(pouleIt => {
            pouleIt.getGames().forEach(game => {
                reposCreates.push(this.gameRepos.createObject(game, game.getPoule()));
            });
        });

        return forkJoin(reposCreates);
    }

    // editObject(round: Round, competition: Competition): Observable<Round> {

    //     const options = {
    //         headers: super.getHeaders(),
    //         params: new HttpParams().set('competitionid', competition.getId().toString())
    //     };

    //     return this.http.put(this.url + '/' + round.getId(), this.roundRepos.objectToJsonHelper(round), options).pipe(
    //         map((res: IRound) => {
    //             const roundOut = this.roundRepos.jsonToObjectHelper(res, competition);
    //             return roundOut;
    //         }),
    //         catchError((err) => this.handleError(err))
    //     );
    // }
}
