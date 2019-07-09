import { Injectable } from '@angular/core';

import { RoundNumber } from '../../round/number';
import { PlanningConfig } from '../config';

@Injectable()
export class PlanningConfigMapper {
    constructor() { }

    toObject(json: JsonPlanningConfig, roundNumber: RoundNumber, config?: PlanningConfig): PlanningConfig {
        if (config === undefined) {
            config = new PlanningConfig(roundNumber);
        }
        config.setId(json.id);
        config.setHasExtension(json.hasExtension);
        config.setMinutesPerGameExt(json.minutesPerGameExt);
        config.setEnableTime(json.enableTime);
        config.setMinutesPerGame(json.minutesPerGame);
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
            hasExtension: config.getHasExtension(),
            minutesPerGameExt: config.getMinutesPerGameExt(),
            enableTime: config.getEnableTime(),
            minutesPerGame: config.getMinutesPerGame(),
            minutesBetweenGames: config.getMinutesBetweenGames(),
            minutesAfter: config.getMinutesAfter(),
            teamup: config.getTeamup(),
            selfReferee: config.getSelfReferee(),
            nrOfHeadtohead: config.getNrOfHeadtohead()
        };
    }
}

export interface JsonPlanningConfig {
    id?: number;
    hasExtension: boolean;
    minutesPerGameExt: number;
    enableTime: boolean;
    minutesPerGame: number;
    minutesBetweenGames: number;
    minutesAfter: number;
    teamup: boolean;
    selfReferee: boolean;
    nrOfHeadtohead: number;
}
