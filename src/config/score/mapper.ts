import { Config } from '../../config';
import { ConfigScore } from '../score';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfigScoreMapper {

    constructor() {
    }

    toObject(json: JsonConfigScore, config: Config): ConfigScore {
        let parent;
        if (json.parent !== undefined) {
            parent = this.toObject(json.parent, config);
        }
        const roundScoreConfig = new ConfigScore(config, parent);
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
