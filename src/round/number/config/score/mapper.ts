import { RoundNumberConfig } from '../../config';
import { RoundNumberConfigScore } from '../score';
import { Injectable } from '@angular/core';

@Injectable()
export class RoundNumberConfigScoreMapper {

    constructor() {
    }

    toObject(json: JsonRoundNumberConfigScore, roundConfig: RoundNumberConfig): RoundNumberConfigScore {
        let parent;
        if (json.parent !== undefined) {
            parent = this.toObject(json.parent, roundConfig);
        }
        const roundScoreConfig = new RoundNumberConfigScore(roundConfig, parent);
        roundScoreConfig.setId(json.id);
        roundScoreConfig.setName(json.name);
        roundScoreConfig.setDirection(json.direction);
        roundScoreConfig.setMaximum(json.maximum);
        return roundScoreConfig;
    }

    toJson(scoreConfig: RoundNumberConfigScore): JsonRoundNumberConfigScore {
        return {
            id: scoreConfig.getId(),
            name: scoreConfig.getName(),
            direction: scoreConfig.getDirection(),
            maximum: scoreConfig.getMaximum(),
            parent: scoreConfig.getParent() !== undefined ? this.toJson(scoreConfig.getParent()) : undefined
        };
    }
}

export interface JsonRoundNumberConfigScore {
    id?: number;
    name: string;
    direction: number;
    maximum: number;
    parent?: JsonRoundNumberConfigScore;
}
