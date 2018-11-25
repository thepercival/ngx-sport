import { RoundNumberConfig } from '../../config';
import { RoundNumberConfigScore } from '../score';

/**
 * Created by coen on 3-3-17.
 */
export class RoundNumberConfigScoreRepository {

    constructor() {
    }

    jsonToObject(json: IRoundNumberConfigScore, roundConfig: RoundNumberConfig): RoundNumberConfigScore {
        let parent;
        if (json.parent !== undefined) {
            parent = this.jsonToObject(json.parent, roundConfig);
        }
        const roundScoreConfig = new RoundNumberConfigScore(roundConfig, parent);
        roundScoreConfig.setId(json.id);
        roundScoreConfig.setName(json.name);
        roundScoreConfig.setDirection(json.direction);
        roundScoreConfig.setMaximum(json.maximum);
        return roundScoreConfig;
    }

    objectsToJsonArray(objects: RoundNumberConfigScore[]): IRoundNumberConfigScore[] {
        const jsonArray: IRoundNumberConfigScore[] = [];
        for (const object of objects) {
            const json = this.objectToJson(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJson(object: RoundNumberConfigScore): IRoundNumberConfigScore {
        return {
            id: object.getId(),
            name: object.getName(),
            direction: object.getDirection(),
            maximum: object.getMaximum(),
            parent: object.getParent() !== undefined ? this.objectToJson(object.getParent()) : undefined
        };
    }
}

export interface IRoundNumberConfigScore {
    id?: number;
    name: string;
    direction: number;
    maximum: number;
    parent: IRoundNumberConfigScore;
}
