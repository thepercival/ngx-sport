import { Injectable } from '@angular/core';

import { PlanningConfigSupplier } from '../supplier';
import { PlanningConfig } from '../planning';

@Injectable()
export class PlanningConfigMapper {
    constructor() { }

    toObject(json: JsonPlanningConfig, supplier: PlanningConfigSupplier, config?: PlanningConfig): PlanningConfig {
        if (config === undefined) {
            config = new PlanningConfig(supplier);
        }
        config.setId(json.id);
        config.setNrOfHeadtoheadMatches(json.nrOfHeadtoheadMatches);
        config.setHasExtension(json.hasExtension);
        config.setMinutesPerGameExt(json.minutesPerGameExt);
        config.setEnableTime(json.enableTime);
        config.setMinutesPerGame(json.minutesPerGame);
        config.setMinutesBetweenGames(json.minutesBetweenGames);
        config.setMinutesAfter(json.minutesAfter);
        config.setTeamup(json.teamup);
        config.setSelfReferee(json.selfReferee);
        return config;
    }

    toJson(config: PlanningConfig): JsonPlanningConfig {
        return {
            id: config.getId(),
            nrOfHeadtoheadMatches: config.getNrOfHeadtoheadMatches(),
            hasExtension: config.getHasExtension(),
            minutesPerGameExt: config.getMinutesPerGameExt(),
            enableTime: config.getEnableTime(),
            minutesPerGame: config.getMinutesPerGame(),
            minutesBetweenGames: config.getMinutesBetweenGames(),
            minutesAfter: config.getMinutesAfter(),
            teamup: config.getTeamup(),
            selfReferee: config.getSelfReferee()
        };
    }
}

export interface JsonPlanningConfig {
    id?: number;
    nrOfHeadtoheadMatches: number;
    hasExtension: boolean;
    minutesPerGameExt: number;
    enableTime: boolean;
    minutesPerGame: number;
    minutesBetweenGames: number;
    minutesAfter: number;
    teamup: boolean;
    selfReferee: boolean;
}
