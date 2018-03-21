import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { Game } from '../game';
import { GameRepository, IGame } from '../game/repository';
import { Poule } from '../poule';
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
        return 'planning';
    }

    createObject(rounds: Round[]): Observable<Game[][]> {
        const reposCreates: Observable<Game[]>[] = [];
        const poules = this.getPoules(rounds);
        poules.forEach(poule => {
            const options = {
                headers: super.getHeaders(),
                params: new HttpParams().set('pouleid', poule.getId().toString())
            };
            const removedGames = poule.getGames().splice(0, poule.getGames().length);
            reposCreates.push(
                this.http.post(this.url, this.gameRepos.objectsToJsonArray(removedGames), options).pipe(
                    map((gamesRes: IGame[]) => this.gameRepos.jsonArrayToObject(gamesRes, poule)),
                    catchError((err) => this.handleError(err))
                )
            );
        });
        return forkJoin(reposCreates);
    }

    private getPoules(rounds: Round[]): Poule[] {
        let poules: Poule[] = [];
        rounds.forEach(round => {
            poules = poules.concat(round.getPoules());
            poules = poules.concat(this.getPoules(round.getChildRounds()));
        });
        return poules.filter(poule => poule.getGames().length > 0);
    }

    editObject(rounds: Round[]): Observable<Game[][]> {
        const reposUpdates: Observable<Game[]>[] = [];
        const poules = this.getPoules(rounds);
        poules.forEach(poule => {
            const options = {
                headers: super.getHeaders(),
                params: new HttpParams().set('pouleid', poule.getId().toString())
            };
            reposUpdates.push(
                this.http.put(this.url, this.gameRepos.objectsToJsonArray(poule.getGames()), options).pipe(
                    map((gamesRes: IGame[]) => this.gameRepos.jsonArrayToObject(gamesRes, poule)),
                    catchError((err) => this.handleError(err))
                )
            );
        });
        return forkJoin(reposUpdates);
    }
}
