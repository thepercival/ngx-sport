import { RoundConfig } from '../../config';
import { RoundConfigScore } from '../score';

/**
 * Created by coen on 3-3-17.
 */
export class RoundConfigScoreRepository {

    constructor() {
    }

    jsonToObjectHelper(json: IRoundConfigScore, roundConfig: RoundConfig): RoundConfigScore {
        let parent;
        if (json.parent !== undefined) {
            parent = this.jsonToObjectHelper(json.parent, roundConfig);
        }
        const roundScoreConfig = new RoundConfigScore(roundConfig, parent);
        roundScoreConfig.setId(json.id);
        roundScoreConfig.setName(json.name);
        roundScoreConfig.setDirection(json.direction);
        roundScoreConfig.setMaximum(json.maximum);
        return roundScoreConfig;
    }

    objectsToJsonArray(objects: RoundConfigScore[]): IRoundConfigScore[] {
        const jsonArray: IRoundConfigScore[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: RoundConfigScore): IRoundConfigScore {
        return {
            id: object.getId(),
            name: object.getName(),
            direction: object.getDirection(),
            maximum: object.getMaximum(),
            parent: object.getParent() !== undefined ? this.objectToJsonHelper(object.getParent()) : undefined
        };
    }
}

export interface IRoundConfigScore {
    id?: number;
    name: string;
    direction: number;
    maximum: number;
    parent: IRoundConfigScore;
}
