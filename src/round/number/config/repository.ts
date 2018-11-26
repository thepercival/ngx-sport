import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

    editObject(roundNumber: RoundNumber, roundNumberConfig: IRoundNumberConfig): Observable<boolean> {
        const options = this.getOptions(roundNumber);
        return this.http.post(this.url, roundNumberConfig, options).pipe(
            map((res: boolean) => res),
            catchError((err) => this.handleError(err))
        );
    }

    protected getOptions(roundNumber: RoundNumber): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('competitionid', roundNumber.getCompetition().getId().toString());
        httpParams = httpParams.set('roundnumber', roundNumber.getNumber().toString());
        if (name !== undefined) {
            httpParams = httpParams.set('name', name);
        }
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

    jsonToObject(json: IRoundNumberConfig, roundNumber: RoundNumber): RoundNumberConfig {
        const roundConfig = new RoundNumberConfig(roundNumber);
        roundConfig.setId(json.id);
        roundConfig.setNrOfHeadtoheadMatches(json.nrOfHeadtoheadMatches);
        roundConfig.setQualifyRule(json.qualifyRule);
        roundConfig.setWinPoints(json.winPoints);
        roundConfig.setDrawPoints(json.drawPoints);
        roundConfig.setHasExtension(json.hasExtension);
        roundConfig.setWinPointsExt(json.winPointsExt);
        roundConfig.setDrawPointsExt(json.drawPointsExt);
        roundConfig.setMinutesPerGameExt(json.minutesPerGameExt);
        roundConfig.setEnableTime(json.enableTime);
        roundConfig.setMinutesPerGame(json.minutesPerGame);
        roundConfig.setMinutesBetweenGames(json.minutesBetweenGames);
        roundConfig.setMinutesAfter(json.minutesAfter);
        roundConfig.setScore(this.scoreRepository.jsonToObject(json.score, roundConfig));
        return roundConfig;
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
