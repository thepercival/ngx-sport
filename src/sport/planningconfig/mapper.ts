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
        sportPlanningConfig.setMinNrOfGames(json.minNrOfGames);
        return sportPlanningConfig;
    }

    toJson(config: SportPlanningConfig): JsonSportPlanningConfig {
        return {
            id: config.getId(),
            sportId: config.getSport().getId(),
            minNrOfGames: config.getMinNrOfGames()
        };
    }
}

export interface JsonSportPlanningConfig {
    id?: number;
    sportId: number;
    minNrOfGames: number;
}
