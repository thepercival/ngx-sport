import { Injectable } from '@angular/core';

import { RoundNumber } from '../../round/number';
import { PlanningConfig } from '../config';
import { JsonPlanningConfig } from './json';

@Injectable({
    providedIn: 'root'
})
export class PlanningConfigMapper {
    constructor() { }

    toObject(json: JsonPlanningConfig, roundNumber: RoundNumber, config?: PlanningConfig): PlanningConfig {
        if (config === undefined) {
            config = new PlanningConfig(
                roundNumber,
                json.gameMode,
                json.extension,
                json.enableTime,
                json.minutesPerGame,
                json.minutesPerGameExt,
                json.minutesBetweenGames,
                json.minutesAfter,
                json.selfReferee);
        }
        return config;
    }

    toJson(config: PlanningConfig): JsonPlanningConfig {
        return {
            id: config.getId(),
            gameMode: config.getGameMode(),
            extension: config.getExtension(),
            enableTime: config.getEnableTime(),
            minutesPerGame: config.getMinutesPerGame(),
            minutesPerGameExt: config.getMinutesPerGameExt(),
            minutesBetweenGames: config.getMinutesBetweenGames(),
            minutesAfter: config.getMinutesAfter(),
            selfReferee: config.getSelfReferee()
        };
    }
}
