import { RoundNumber } from '../../round/number';
import { Sport } from '../../sport';
import { SportScoreConfig } from '../scoreconfig';
import { Injectable } from '@angular/core';

@Injectable()
export class SportScoreConfigMapper {

    constructor() {
    }

    toObject(json: JsonSportScoreConfig, sport: Sport, roundNumber: RoundNumber,
        config?: SportScoreConfig, previous?: SportScoreConfig): SportScoreConfig {
        if (config === undefined) {
            config = new SportScoreConfig(sport, roundNumber, previous);
        }
        config.setId(json.id);
        config.setDirection(json.direction);
        config.setMaximum(json.maximum);
        config.setEnabled(json.enabled);
        if (json.next !== undefined) {
            this.toObject(json.next, sport, roundNumber, config.getNext(), config);
        }
        return config;
    }

    toJson(scoreConfig: SportScoreConfig): JsonSportScoreConfig {
        return {
            id: scoreConfig.getId(),
            sportId: scoreConfig.getSport().getId(),
            direction: scoreConfig.getDirection(),
            maximum: scoreConfig.getMaximum(),
            enabled: scoreConfig.getEnabled(),
            next: scoreConfig.getNext() !== undefined ? this.toJson(scoreConfig.getNext()) : undefined
        };
    }
}

export interface JsonSportScoreConfig {
    id?: number;
    sportId: number;
    direction: number;
    maximum: number;
    enabled: boolean;
    next?: JsonSportScoreConfig;
}
