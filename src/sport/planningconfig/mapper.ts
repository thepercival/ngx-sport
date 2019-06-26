import { RoundNumber } from '../../round/number';
import { Sport } from '../../sport';
import { SportPlanningConfig } from '../planningconfig';
import { Injectable } from '@angular/core';

@Injectable()
export class SportPlanningConfigMapper {

    constructor() {
    }

    toObject(json: JsonSportPlanningConfig, sport: Sport, roundNumber: RoundNumber): SportPlanningConfig {
        const sportPlanningConfig = new SportPlanningConfig(sport, roundNumber);
        sportPlanningConfig.setId(json.id);
        sportPlanningConfig.setNrOfHeadtoheadMatches(json.nrOfHeadtoheadMatches);
        return sportPlanningConfig;
    }

    toJson(sportPlanningConfig: SportPlanningConfig): JsonSportPlanningConfig {
        return {
            id: sportPlanningConfig.getId(),
            sportId: sportPlanningConfig.getSport().getId(),
            nrOfHeadtoheadMatches: sportPlanningConfig.getNrOfHeadtoheadMatches()
        };
    }
}

export interface JsonSportPlanningConfig {
    id?: number;
    sportId: number;
    nrOfHeadtoheadMatches: number;
}
