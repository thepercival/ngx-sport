import { SportConfig } from '../../config';
import { SportConfigScore } from '../score';
import { Injectable } from '@angular/core';

@Injectable()
export class SportConfigScoreMapper {

    constructor() {
    }

    toObject(json: JsonSportConfigScore, sportConfig: SportConfig, parentConfigScore?: SportConfigScore): SportConfigScore {
        const scoreConfig = new SportConfigScore(sportConfig, parentConfigScore);
        scoreConfig.setId(json.id);
        scoreConfig.setDirection(json.direction);
        scoreConfig.setMaximum(json.maximum);
        if (json.child !== undefined) {
            this.toObject(json.child, sportConfig, scoreConfig);
        }
        return scoreConfig;
    }

    toJson(scoreConfig: SportConfigScore): JsonSportConfigScore {
        return {
            id: scoreConfig.getId(),
            direction: scoreConfig.getDirection(),
            maximum: scoreConfig.getMaximum(),
            child: scoreConfig.getChild() !== undefined ? this.toJson(scoreConfig.getChild()) : undefined
        };
    }
}

export interface JsonSportConfigScore {
    id?: number;
    direction: number;
    maximum: number;
    child?: JsonSportConfigScore;
}
