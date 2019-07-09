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
        sportPlanningConfig.setNrOfGames(json.nrOfGames);
        return sportPlanningConfig;
    }

    toJson(config: SportPlanningConfig): JsonSportPlanningConfig {
        return {
            id: config.getId(),
            sportId: config.getSport().getId(),
            nrOfGames: config.getNrOfGames()
        };
    }
}

export interface JsonSportPlanningConfig {
    id?: number;
    sportId: number;
    nrOfGames: number;
}
