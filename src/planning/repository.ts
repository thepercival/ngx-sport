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
import { JsonStructure } from '../structure/mapper';
import { Structure } from '../structure';
import { JsonRoundNumber } from '../round/number/mapper';

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
    createObject(structure: Structure, blockedPeriod: PlanningPeriod): Observable<Structure> {
        const firstRoundNumber = structure.getFirstRoundNumber();
        this.removeGames(firstRoundNumber);
        return this.http.post(this.url, undefined, this.getOptions(firstRoundNumber, blockedPeriod)).pipe(
            map((jsonStructure: JsonStructure) => this.toObject(jsonStructure, structure)),
            catchError((err) => this.handleError(err))
        );
    }

    protected removeGames(roundNumber: RoundNumber) {
        roundNumber.getPoules().forEach(poule => {
            poule.getGames().splice(0, poule.getGames().length);
        });
        if (roundNumber.hasNext()) {
            this.removeGames(roundNumber);
        }
    }

    toObject(json: JsonStructure, structure: Structure): Structure {
        this.toRoundNumber(json.firstRoundNumber, structure.getFirstRoundNumber());
        this.toRoundGames(json.rootRound, structure.getRootRound());
        return structure;
    }

    protected toRoundNumber(jsonRoundNumber: JsonRoundNumber, roundNumber: RoundNumber) {
        if (jsonRoundNumber.hasBestPlanning) {
            roundNumber.setBestPlanning();
        }
        if (roundNumber.hasNext()) {
            this.toRoundNumber(jsonRoundNumber.next, roundNumber.getNext());
        }
    }
    protected toRoundGames(jsonRound: JsonRound, round: Round) {
        jsonRound.poules.forEach(jsonPoule => {
            const poule = round.getPoule(jsonPoule.number);
            if (jsonPoule.games !== undefined) {
                jsonPoule.games.forEach(jsonGame => {
                    this.gameMapper.toObject(jsonGame, poule);
                });
            }
        });
        jsonRound.qualifyGroups.forEach((jsonQualifyGroup) => {
            const qualifyGroup = round.getQualifyGroup(jsonQualifyGroup.winnersOrLosers, jsonQualifyGroup.number);
            this.toRoundGames(jsonQualifyGroup.childRound, qualifyGroup.getChildRound());
        });
    }

    // protected toGames(roundNumber: RoundNumber): Observable<Game[][]> {
    //     const gamesGet: Observable<Game[]>[] = [];
    //     const poules = this.getPoules(roundNumber);
    //     poules.forEach(poule => {
    //         gamesGet.push(
    //             this.http.get(this.url, this.getGetOptions(poule)).pipe(
    //                 map((jsoGames: JsonGame[]) => {

    //                 }),
    //                 catchError((err) => this.handleError(err))
    //             )
    //         );
    //     });
    //     return forkJoin(gamesGet);
    // }

    // private getPoules(roundNumber: RoundNumber): Poule[] {
    //     let poules: Poule[] = [];
    //     roundNumber.getRounds().forEach(round => {
    //         poules = poules.concat(round.getPoules());
    //     });
    //     if (roundNumber.hasNext()) {
    //         poules = poules.concat(this.getPoules(roundNumber.getNext()));
    //     }
    //     return poules.filter(poule => poule.getGames().length > 0);
    // }

    editObject(roundNumber: RoundNumber, blockedPeriod: PlanningPeriod): Observable<boolean> {
        return this.http.put(this.url, undefined, this.getOptions(roundNumber, blockedPeriod)).pipe(
            map((dates: Date[]) => this.reschedule(roundNumber, dates)),
            catchError((err) => this.handleError(err))
        );
    }

    isBestObject(roundNumber: RoundNumber): Observable<boolean> {
        return this.http.get(this.url + '/isbest', this.getOptions(roundNumber)).pipe(
            map((isBestObject: boolean) => isBestObject),
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

    protected getOptions(roundNumber: RoundNumber, blockedPeriod?: PlanningPeriod): { headers: HttpHeaders; params: HttpParams } {
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
