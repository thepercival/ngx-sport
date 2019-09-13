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
        if (json.next !== undefined) {
            this.toObject(json.next, sport, roundNumber, scoreConfig);
        }
        return scoreConfig;
    }

    toJson(scoreConfig: SportScoreConfig): JsonSportScoreConfig {
        return {
            id: scoreConfig.getId(),
            sportId: scoreConfig.getSport().getId(),
            direction: scoreConfig.getDirection(),
            maximum: scoreConfig.getMaximum(),
            next: scoreConfig.getNext() !== undefined ? this.toJson(scoreConfig.getNext()) : undefined
        };
    }
}

export interface JsonSportScoreConfig {
    id?: number;
    sportId: number;
    direction: number;
    maximum: number;
    next?: JsonSportScoreConfig;
}
