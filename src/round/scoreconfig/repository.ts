import { Round } from '../../round';
import { RoundScoreConfig } from '../scoreconfig';

/**
 * Created by coen on 3-3-17.
 */
export class RoundScoreConfigRepository {

    constructor() {
    }

    // make editObject, with roundnumber instead of roundid

    jsonToObjectHelper(json: IRoundScoreConfig, round: Round): RoundScoreConfig {
        let parent;
        if (json.parent !== undefined) {
            parent = this.jsonToObjectHelper(json.parent, round);
        }
        const roundScoreConfig = new RoundScoreConfig(round, parent);
        roundScoreConfig.setId(json.id);
        roundScoreConfig.setName(json.name);
        roundScoreConfig.setDirection(json.direction);
        roundScoreConfig.setMaximum(json.maximum);
        return roundScoreConfig;
    }

    objectsToJsonArray(objects: RoundScoreConfig[]): IRoundScoreConfig[] {
        const jsonArray: IRoundScoreConfig[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: RoundScoreConfig): IRoundScoreConfig {
        return {
            id: object.getId(),
            name: object.getName(),
            direction: object.getDirection(),
            maximum: object.getMaximum(),
            parent: object.getParent() !== undefined ? this.objectToJsonHelper(object.getParent()) : undefined
        };
    }
}

export interface IRoundScoreConfig {
    id?: number;
    name: string;
    direction: number;
    maximum: number;
    parent: IRoundScoreConfig;
}
