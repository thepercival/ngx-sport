import { RoundNumber } from '../../round/number';
import { Sport } from '../../sport';
import { SportScoreConfig } from '../scoreconfig';
import { Injectable } from '@angular/core';

@Injectable()
export class SportScoreConfigMapper {

    constructor() {
    }

    toObject(json: JsonSportScoreConfig, sport: Sport, roundNumber: RoundNumber, parent?: SportScoreConfig): SportScoreConfig {
        const scoreConfig = new SportScoreConfig(sport, roundNumber, parent);
        scoreConfig.setId(json.id);
        scoreConfig.setDirection(json.direction);
        scoreConfig.setMaximum(json.maximum);
        if (json.child !== undefined) {
            this.toObject(json.child, sport, roundNumber, scoreConfig);
        }
        return scoreConfig;
    }

    toJson(scoreConfig: SportScoreConfig): JsonSportScoreConfig {
        return {
            id: scoreConfig.getId(),
            sportId: scoreConfig.getSport().getId(),
            direction: scoreConfig.getDirection(),
            maximum: scoreConfig.getMaximum(),
            child: scoreConfig.getChild() !== undefined ? this.toJson(scoreConfig.getChild()) : undefined
        };
    }
}

export interface JsonSportScoreConfig {
    id?: number;
    sportId: number;
    direction: number;
    maximum: number;
    child?: JsonSportScoreConfig;
}
