import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Game } from '../game';
import { GameRepository, IGame } from '../game/repository';
import { Poule } from '../poule';
import { SportRepository } from '../repository';
import { RoundNumber } from '../round/number';

/**
 * Created by coen on 3-3-17.
 */

@Injectable()
export class PlanningRepository extends SportRepository {

    private url: string;

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

    createObject(roundNumber: RoundNumber): Observable<Game[][]> {
        const reposCreates: Observable<Game[]>[] = [];
        const poules = this.getPoules(roundNumber);
        poules.forEach(poule => {
            const removedGames = poule.getGames().splice(0, poule.getGames().length);
            reposCreates.push(
                this.http.post(this.url, this.gameRepos.objectsToJsonArray(removedGames), this.getOptions(poule)).pipe(
                    map((gamesRes: IGame[]) => this.gameRepos.jsonArrayToObject(gamesRes, poule)),
                    catchError((err) => this.handleError(err))
                )
            );
        });
        return forkJoin(reposCreates);
    }

    private getPoules(roundNumber: RoundNumber): Poule[] {
        let poules: Poule[] = [];
        roundNumber.getRounds().forEach(round => {
            poules = poules.concat(round.getPoules());
        });
        if (roundNumber.hasNext()) {
            poules = poules.concat(this.getPoules(roundNumber.getNext()));
        }
        return poules.filter(poule => poule.getGames().length > 0);
    }

    editObject(roundNumber: RoundNumber): Observable<Game[][]> {
        const reposUpdates: Observable<Game[]>[] = [];
        const poules = this.getPoules(roundNumber);
        poules.forEach(poule => {
            reposUpdates.push(
                this.http.put(this.url, this.gameRepos.objectsToJsonArray(poule.getGames()), this.getOptions(poule)).pipe(
                    map((gamesRes: IGame[]) => this.gameRepos.jsonArrayToObject(gamesRes, poule)),
                    catchError((err) => this.handleError(err))
                )
            );
        });
        return forkJoin(reposUpdates);
    }

    protected getOptions(poule: Poule): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('pouleid', poule.getId().toString());
        httpParams = httpParams.set('competitionid', poule.getRound().getCompetition().getId().toString());
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }
}
