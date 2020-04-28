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
            config = new PlanningConfig(roundNumber);
        }
        config.setId(json.id);
        config.setExtension(json.extension);
        config.setEnableTime(json.enableTime);
        config.setMinutesPerGame(json.minutesPerGame);
        config.setMinutesPerGameExt(json.minutesPerGameExt);
        config.setMinutesBetweenGames(json.minutesBetweenGames);
        config.setMinutesAfter(json.minutesAfter);
        config.setTeamup(json.teamup);
        config.setSelfReferee(json.selfReferee);
        config.setNrOfHeadtohead(json.nrOfHeadtohead);
        return config;
    }

    toJson(config: PlanningConfig): JsonPlanningConfig {
        return {
            id: config.getId(),
            extension: config.getExtension(),
            enableTime: config.getEnableTime(),
            minutesPerGame: config.getMinutesPerGame(),
            minutesPerGameExt: config.getMinutesPerGameExt(),
            minutesBetweenGames: config.getMinutesBetweenGames(),
            minutesAfter: config.getMinutesAfter(),
            teamup: config.getTeamup(),
            selfReferee: config.getSelfReferee(),
            nrOfHeadtohead: config.getNrOfHeadtohead()
        };
    }
}
