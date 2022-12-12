import { Injectable } from '@angular/core';
import { SelfReferee } from '../../referee/self';

import { RoundNumber } from '../../round/number';
import { PlanningConfig } from '../config';
import { PlanningEditMode } from '../editMode';
import { GamePlaceStrategy } from '../strategy';
import { JsonPlanningConfig } from './json';

@Injectable({
    providedIn: 'root'
})
export class PlanningConfigMapper {
    constructor() { }

    toObject(json: JsonPlanningConfig | undefined, roundNumber: RoundNumber): PlanningConfig {
        if (json === undefined) {
            return new PlanningConfig(
                roundNumber,
                PlanningEditMode.Manual,
                GamePlaceStrategy.EquallyAssigned,
                false,
                false,
                0,
                0,
                0,
                0,
                false,
                SelfReferee.Disabled
            );
        }
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
            json.perPoule,
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
            perPoule: config.getPerPoule(),
            selfReferee: config.getSelfReferee()
        };
    }
}
