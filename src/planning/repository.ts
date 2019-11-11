import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../api/repository';
import { Game } from '../game';
import { RoundNumber } from '../round/number';
import { JsonRound } from '../round/mapper';
import { GameMapper, JsonGame } from '../game/mapper';
import { Round } from '../round';
import { Poule } from '../poule';
import { PlanningPeriod } from './period';

@Injectable()
export class PlanningRepository extends APIRepository {

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

    /**
     * games verwijderen en weer toevoegen
     * 
     * @param roundNumber
     */
    createObject(roundNumber: RoundNumber, blockedPeriod: PlanningPeriod): Observable<Game[][]> {
        ik moet toch de hele structuur opnieuw inlezen omdat ik moet weten als het de beste planning is en omdat ook ondeeliggende rondenummers gedaan moeten worden
        tevens geen recursie hier en aan de server kant
        this.removeGames(roundNumber);
        return this.http.post(this.url, undefined, this.getOptions(roundNumber, blockedPeriod)).pipe(
            map((retVal: boolean[]) => this.getGames(roundNumber)),
            catchError((err) => this.handleError(err))
        );
    }

    protected removeGames(roundNumber: RoundNumber) {
        roundNumber.getPoules().forEach(poule => {
            poule.getGames().splice(0, poule.getGames().length);
        });
    }

    protected getGames(roundNumber: RoundNumber): Observable<Game[][]> {
        const gamesGet: Observable<Game[]>[] = [];
        const poules = this.getPoules(roundNumber);
        poules.forEach(poule => {
            gamesGet.push(
                this.http.get(this.url, this.getGetOptions(poule)).pipe(
                    map((jsoGames: JsonGame[]) => {
                        return jsoGames.map(jsonGame => this.gameMapper.toObject(jsonGame, poule));
                    }),
                    catchError((err) => this.handleError(err))
                )
            );
        });
        return forkJoin(gamesGet);
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

    editObject(roundNumber: RoundNumber, blockedPeriod: PlanningPeriod): Observable<boolean> {
        return this.http.put(this.url, undefined, this.getOptions(roundNumber, blockedPeriod)).pipe(
            map((dates: Date[]) => this.setDates(roundNumber, dates)),
            catchError((err) => this.handleError(err))
        );
    }

    private setDates(roundNumber: RoundNumber, dates: Date[]): boolean {
        let previousBatchNr, gameDate;
        roundNumber.getGames(Game.ORDER_BY_BATCH).forEach(game => {
            if (previousBatchNr === undefined || previousBatchNr !== game.getBatchNr()) {
                previousBatchNr = game.getBatchNr();
                if (dates.length === 0) {
                    throw new Error('niet genoeg datums om planning aan te passen');
                }
                gameDate = dates.pop();
            }
            game.setStartDateTime(gameDate);
        });
        if (roundNumber.hasNext()) {
            // batchDates
            this.setDates(roundNumber.getNext(), dates);
        }
        return true;
    }

    protected getOptions(roundNumber: RoundNumber, blockedPeriod: PlanningPeriod): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('competitionid', roundNumber.getCompetition().getId().toString());
        httpParams = httpParams.set('roundnumber', roundNumber.getNumber().toString());
        if (blockedPeriod !== undefined) {
            httpParams = httpParams.set('blockedperiodstart', blockedPeriod.start.toISOString());
            httpParams = httpParams.set('blockedperiodend', blockedPeriod.end.toISOString());
        }

        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }

    protected getGetOptions(poule: Poule): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('competitionid', poule.getRound().getNumber().getCompetition().getId().toString());
        httpParams = httpParams.set('pouleid', poule.getId().toString());
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }
}
