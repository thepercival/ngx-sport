import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Competition } from '../../competition';
import { SportRepository } from '../../repository';
import { Round } from '../../round';
import { RoundConfig } from '../config';
import { IRoundConfigScore, RoundConfigScoreRepository } from './score/repository';

/**
 * Created by coen on 3-3-17.
 */
@Injectable()
export class RoundConfigRepository extends SportRepository {

    private url: string;
    private selfCache: Round[] = [];

    constructor(
        private scoreRepository: RoundConfigScoreRepository,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'roundconfigs';
    }

    editObject(competition: Competition, roundNumber: number, roundConfig: IRoundConfig): Observable<boolean> {
        const options = this.getOptions(competition, roundNumber);
        return this.http.post(this.url, roundConfig, options).pipe(
            map((res: boolean) => res),
            catchError((err) => this.handleError(err))
        );
    }

    protected getOptions(competition: Competition, roundNumber: number): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('competitionid', competition.getId().toString());
        httpParams = httpParams.set('roundnumber', roundNumber.toString());
        if (name !== undefined) {
            httpParams = httpParams.set('name', name);
        }
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }

    jsonArrayToObject(jsonArray: IRoundConfig[], round: Round): RoundConfig[] {
        const objects: RoundConfig[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, round);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IRoundConfig, round: Round): RoundConfig {
        const roundConfig = new RoundConfig(round);
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
        roundConfig.setMinutesInBetween(json.minutesInBetween);
        roundConfig.setScore(this.scoreRepository.jsonToObjectHelper(json.score, roundConfig));
        return roundConfig;
    }

    objectsToJsonArray(objects: RoundConfig[]): IRoundConfig[] {
        const jsonArray: IRoundConfig[] = [];
        for (const object of objects) {
            jsonArray.push(this.objectToJsonHelper(object));
        }
        return jsonArray;
    }

    objectToJsonHelper(object: RoundConfig): IRoundConfig {
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
            minutesInBetween: object.getMinutesInBetween(),
            score: this.scoreRepository.objectToJsonHelper(object.getScore())
        };
    }
}

export interface IRoundConfig {
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
    minutesInBetween: number;
    score: IRoundConfigScore;
}
