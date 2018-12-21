import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Game } from '../game';
import { GameMapper, JsonGame } from '../game/mapper';
import { Poule } from '../poule';
import { SportRepository } from '../repository';
import { RoundNumber } from '../round/number';

@Injectable()
export class PlanningRepository extends SportRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private gameMapper: GameMapper,
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
            const jsonRemovedGames = removedGames.map(removedGame => this.gameMapper.toJson(removedGame));
            reposCreates.push(
                this.http.post(this.url, jsonRemovedGames, this.getOptions(poule)).pipe(
                    map((jsonGames: JsonGame[]) => this.gameMapper.toArray(jsonGames, poule)),
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
            const jsonGames = poule.getGames().map(game => this.gameMapper.toJson(game));
            reposUpdates.push(
                this.http.put(this.url, jsonGames, this.getOptions(poule)).pipe(
                    map((jsonGamesRes: JsonGame[]) => this.gameMapper.toArray(jsonGamesRes, poule)),
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
