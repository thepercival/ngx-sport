import { CountConfig } from '../../count';
import { ConfigScore } from '../score';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfigScoreMapper {

    constructor() {
    }

    toObject(json: JsonConfigScore, countConfig: CountConfig): ConfigScore {
        let parent;
        if (json.parent !== undefined) {
            parent = this.toObject(json.parent, countConfig);
        }
        const roundScoreConfig = new ConfigScore(countConfig, parent);
        roundScoreConfig.setId(json.id);
        roundScoreConfig.setName(json.name);
        roundScoreConfig.setDirection(json.direction);
        roundScoreConfig.setMaximum(json.maximum);
        return roundScoreConfig;
    }

    toJson(scoreConfig: ConfigScore): JsonConfigScore {
        return {
            id: scoreConfig.getId(),
            name: scoreConfig.getName(),
            direction: scoreConfig.getDirection(),
            maximum: scoreConfig.getMaximum(),
            parent: scoreConfig.getParent() !== undefined ? this.toJson(scoreConfig.getParent()) : undefined
        };
    }
}

export interface JsonConfigScore {
    id?: number;
    name: string;
    direction: number;
    maximum: number;
    parent?: JsonConfigScore;
}
