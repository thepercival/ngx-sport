import { Injectable } from '@angular/core';

import { RoundNumber } from '../../round/number';
import { PlanningConfig } from '../config';
import { JsonPlanningConfig } from './json';

@Injectable({
    providedIn: 'root'
})
export class PlanningConfigMapper {
    constructor() { }

    toObject(json: JsonPlanningConfig, roundNumber: RoundNumber): PlanningConfig {
        return new PlanningConfig(
            roundNumber,
            json.editMode,
            json.gamePlaceStrategy,
            json.extension,
            json.enableTime,
            json.minutesPerGame,
            json.minutesPerGameExt,
            json.minutesBetweenGames,
            json.minutesAfter,
            json.selfReferee);
    }

    toJson(config: PlanningConfig): JsonPlanningConfig {
        return {
            id: config.getId(),
            editMode: config.getEditMode(),
            gamePlaceStrategy: config.getGamePlaceStrategy(),
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
