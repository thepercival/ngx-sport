import { SportConfig } from '../../config';
import { SportConfigScore } from '../score';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfigScoreMapper {

    constructor() {
    }

    toObject(json: JsonSportConfigScore, countConfig: SportConfig): SportConfigScore {
        let parent;
        if (json.parent !== undefined) {
            parent = this.toObject(json.parent, countConfig);
        }
        const roundScoreConfig = new SportConfigScore(countConfig, parent);
        roundScoreConfig.setId(json.id);
        roundScoreConfig.setDirection(json.direction);
        roundScoreConfig.setMaximum(json.maximum);
        return roundScoreConfig;
    }

    toJson(scoreConfig: SportConfigScore): JsonSportConfigScore {
        return {
            id: scoreConfig.getId(),
            direction: scoreConfig.getDirection(),
            maximum: scoreConfig.getMaximum(),
            parent: scoreConfig.getParent() !== undefined ? this.toJson(scoreConfig.getParent()) : undefined
        };
    }
}

export interface JsonSportConfigScore {
    id?: number;
    direction: number;
    maximum: number;
    parent?: JsonSportConfigScore;
}
