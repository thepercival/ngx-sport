import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Game } from '../game';
import { GameMapper, JsonGame } from '../game/mapper';
import { Poule } from '../poule';
import { SportRepository } from '../repository';

@Injectable()
export class GameRepository extends SportRepository {

    private url: string;

    constructor(
        private mapper: GameMapper,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'games';
    }

    editObject(game: Game, poule: Poule): Observable<Game> {
        return this.http.put(this.url + '/' + game.getId(), this.mapper.toJson(game), this.getOptions(poule)).pipe(
            map((json: JsonGame) => this.mapper.toObject(json, game.getPoule(), game)),
            catchError((err) => this.handleError(err))
        );
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

