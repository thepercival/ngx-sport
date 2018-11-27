import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

import { SportRepository } from '../../../repository';
import { RoundNumber } from '../../../round/number';
import { RoundNumberConfig } from '../config';
import { IRoundNumberConfigScore, RoundNumberConfigScoreRepository } from './score/repository';

/**
 * Created by coen on 3-3-17.
 */
@Injectable()
export class RoundNumberConfigRepository extends SportRepository {
    private url: string;

    constructor(
        private scoreRepository: RoundNumberConfigScoreRepository,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'roundconfigs';
    }

    editObject(roundNumber: RoundNumber, roundNumberConfig: IRoundNumberConfig): Observable<RoundNumberConfig[][]> {
        return forkJoin(this.getUpdates(roundNumber, roundNumberConfig));
    }

    getUpdates(roundNumber: RoundNumber, roundNumberConfig: IRoundNumberConfig): Observable<RoundNumberConfig[]>[] {
        let reposUpdates: Observable<RoundNumberConfig[]>[] = [];
        const options = this.getOptions(roundNumber);
        reposUpdates.push(
            this.http.put(this.url + '/' + roundNumber.getConfig().getId(), roundNumberConfig, options).pipe(
                map((res: IRoundNumberConfig) => this.jsonToObject(res, roundNumber)),
                catchError((err) => this.handleError(err))
            )
        );
        if ( roundNumber.hasNext() ) {
            reposUpdates = reposUpdates.concat( this.getUpdates(roundNumber.getNext(), roundNumberConfig) );
        }
        return reposUpdates;
    }

    protected getOptions(roundNumber: RoundNumber): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('competitionid', roundNumber.getCompetition().getId().toString());
        httpParams = httpParams.set('roundnumberid', roundNumber.getId().toString());
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }

    jsonArrayToObject(jsonArray: IRoundNumberConfig[], roundNumber: RoundNumber): RoundNumberConfig[] {
        const objects: RoundNumberConfig[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObject(json, roundNumber);
            objects.push(object);
        }
        return objects;
    }

    jsonToObject(json: IRoundNumberConfig, roundNumber: RoundNumber, config?: RoundNumberConfig): RoundNumberConfig {
        if (config === undefined) {
            config = new RoundNumberConfig(roundNumber);
        }
        config.setId(json.id);
        config.setNrOfHeadtoheadMatches(json.nrOfHeadtoheadMatches);
        config.setQualifyRule(json.qualifyRule);
        config.setWinPoints(json.winPoints);
        config.setDrawPoints(json.drawPoints);
        config.setHasExtension(json.hasExtension);
        config.setWinPointsExt(json.winPointsExt);
        config.setDrawPointsExt(json.drawPointsExt);
        config.setMinutesPerGameExt(json.minutesPerGameExt);
        config.setEnableTime(json.enableTime);
        config.setMinutesPerGame(json.minutesPerGame);
        config.setMinutesBetweenGames(json.minutesBetweenGames);
        config.setMinutesAfter(json.minutesAfter);
        config.setScore(this.scoreRepository.jsonToObject(json.score, config));
        return config;
    }

    objectsToJsonArray(objects: RoundNumberConfig[]): IRoundNumberConfig[] {
        const jsonArray: IRoundNumberConfig[] = [];
        for (const object of objects) {
            jsonArray.push(this.objectToJson(object));
        }
        return jsonArray;
    }

    objectToJson(object: RoundNumberConfig): IRoundNumberConfig {
        return {
            id: object.getId(),
            nrOfHeadtoheadMatches: object.getNrOfHeadtoheadMatches(),
            qualifyRule: object.getQualifyRule(),
            winPoints: object.getWinPoints(),
            drawPoints: object.getDrawPoints(),
            hasExtension: object.getHasExtension(),
            winPointsExt: object.getWinPointsExt(),
            drawPointsExt: object.getDrawPointsExt(),
            minutesPerGameExt: object.getMinutesPerGameExt(),
            enableTime: object.getEnableTime(),
            minutesPerGame: object.getMinutesPerGame(),
            minutesBetweenGames: object.getMinutesBetweenGames(),
            minutesAfter: object.getMinutesAfter(),
            score: this.scoreRepository.objectToJson(object.getScore())
        };
    }
}

export interface IRoundNumberConfig {
    id?: number;
    nrOfHeadtoheadMatches: number;
    qualifyRule: number;
    winPoints: number;
    drawPoints: number;
    hasExtension: boolean;
    winPointsExt: number;
    drawPointsExt: number;
    minutesPerGameExt: number;
    enableTime: boolean;
    minutesPerGame: number;
    minutesBetweenGames: number;
    minutesAfter: number;
    score: IRoundNumberConfigScore;
}
