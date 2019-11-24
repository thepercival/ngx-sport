import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../api/repository';
import { Game } from '../game';
import { RoundNumber } from '../round/number';
import { PlanningPeriod } from './period';
import { JsonStructure } from '../structure/mapper';
import { PlanningMapper } from './mapper';

@Injectable()
export class PlanningRepository extends APIRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private planningMapper: PlanningMapper,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'planning';
    }

    getObject(roundNumber: RoundNumber): Observable<RoundNumber> {
        return this.http.get(this.url, this.getOptions(roundNumber)).pipe(
            map((jsonStructure: JsonStructure) => this.planningMapper.toObject(jsonStructure, roundNumber)),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * games verwijderen en weer toevoegen
     *
     * @param roundNumber
     */
    createObject(roundNumber: RoundNumber, blockedPeriod: PlanningPeriod): Observable<RoundNumber> {
        this.removeGames(roundNumber);
        return this.http.post(this.url, undefined, this.getOptions(roundNumber, blockedPeriod)).pipe(
            map((jsonStructure: JsonStructure) => this.planningMapper.toObject(jsonStructure, roundNumber)),
            catchError((err) => this.handleError(err))
        );
    }

    protected removeGames(roundNumber: RoundNumber) {
        roundNumber.getPoules().forEach(poule => {
            poule.getGames().splice(0, poule.getGames().length);
        });
        if (roundNumber.hasNext()) {
            this.removeGames(roundNumber.getNext());
        }
    }

    editObject(roundNumber: RoundNumber, blockedPeriod: PlanningPeriod): Observable<boolean> {
        return this.http.put(this.url, undefined, this.getOptions(roundNumber, blockedPeriod)).pipe(
            map((dates: Date[]) => this.reschedule(roundNumber, dates)),
            catchError((err) => this.handleError(err))
        );
    }

    private reschedule(roundNumber: RoundNumber, dates: Date[]): boolean {
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
            this.reschedule(roundNumber.getNext(), dates);
        }
        return true;
    }

    protected getOptions(
        roundNumber: RoundNumber, blockedPeriod?: PlanningPeriod, withNext?: boolean
    ): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('competitionid', roundNumber.getCompetition().getId().toString());
        httpParams = httpParams.set('roundnumber', roundNumber.getNumber().toString());
        if (blockedPeriod !== undefined) {
            httpParams = httpParams.set('blockedperiodstart', blockedPeriod.start.toISOString());
            httpParams = httpParams.set('blockedperiodend', blockedPeriod.end.toISOString());
        }
        if (withNext !== undefined) {
            httpParams = httpParams.set('withnext', withNext.toString());
        }

        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }
}
