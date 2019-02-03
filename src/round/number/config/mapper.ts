import { Injectable } from '@angular/core';

import { RoundNumber } from '../../number';
import { RoundNumberConfig } from '../../number/config';
import { JsonRoundNumberConfigScore, RoundNumberConfigScoreMapper } from './score/mapper';

@Injectable()
export class RoundNumberConfigMapper {
    constructor(private scoreConfigMapper: RoundNumberConfigScoreMapper) { }

    toObject(json: JsonRoundNumberConfig, roundNumber: RoundNumber, config?: RoundNumberConfig): RoundNumberConfig {
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
        config.setScore(this.scoreConfigMapper.toObject(json.score, config));
        config.setTeamup(json.teamup);
        config.setPointsCalculation(json.pointsCalculation);
        config.setSelfReferee(json.selfReferee);
        return config;
    }

    toJson(config: RoundNumberConfig): JsonRoundNumberConfig {
        return {
            id: config.getId(),
            nrOfHeadtoheadMatches: config.getNrOfHeadtoheadMatches(),
            qualifyRule: config.getQualifyRule(),
            winPoints: config.getWinPoints(),
            drawPoints: config.getDrawPoints(),
            hasExtension: config.getHasExtension(),
            winPointsExt: config.getWinPointsExt(),
            drawPointsExt: config.getDrawPointsExt(),
            minutesPerGameExt: config.getMinutesPerGameExt(),
            enableTime: config.getEnableTime(),
            minutesPerGame: config.getMinutesPerGame(),
            minutesBetweenGames: config.getMinutesBetweenGames(),
            minutesAfter: config.getMinutesAfter(),
            score: this.scoreConfigMapper.toJson(config.getScore()),
            teamup: config.getTeamup(),
            pointsCalculation: config.getPointsCalculation(),
            selfReferee: config.getSelfReferee(),
        };
    }
}

export interface JsonRoundNumberConfig {
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
    score: JsonRoundNumberConfigScore;
    teamup: boolean;
    pointsCalculation: number;
    selfReferee: boolean;
}
