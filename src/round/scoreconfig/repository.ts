/**
 * Created by coen on 3-3-17.
 */
import { Round } from '../../round';
import { RoundScoreConfig } from '../scoreconfig';


export class RoundScoreConfigRepository {

    constructor() {

    }

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

    createObjectFromParent(round: Round): RoundScoreConfig {

        let json: IRoundScoreConfig;
        if (round.getParentRound() !== undefined) {
            json = this.objectToJsonHelper(round.getParentRound().getScoreConfig());
        } else if (round.getCompetitionseason().getSport() === 'darten') {
            json = {
                id: undefined,
                name: 'punten',
                direction: RoundScoreConfig.DOWNWARDS,
                maximum: 501,
                parent: {
                    id: undefined,
                    name: 'legs',
                    direction: RoundScoreConfig.UPWARDS,
                    maximum: 2,
                    parent: {
                        id: undefined,
                        name: 'sets',
                        direction: RoundScoreConfig.UPWARDS,
                        maximum: 0,
                        parent: undefined
                    }
                }
            };
        } else if (round.getCompetitionseason().getSport() === 'tafeltennis') {
            json = {
                id: undefined,
                name: 'punten',
                direction: RoundScoreConfig.UPWARDS,
                maximum: 21,
                parent: {
                    id: undefined,
                    name: 'sets',
                    direction: RoundScoreConfig.UPWARDS,
                    maximum: 0,
                    parent: undefined
                }
            };
        } else if (round.getCompetitionseason().getSport() === 'voetbal') {
            json = {
                id: undefined,
                name: 'goals',
                direction: RoundScoreConfig.UPWARDS,
                maximum: 0,
                parent: undefined
            };
        } else {
            json = {
                id: undefined,
                name: 'punten',
                direction: RoundScoreConfig.UPWARDS,
                maximum: 0,
                parent: undefined
            };
        }
        return this.jsonToObjectHelper(json, round);
    }
}

export interface IRoundScoreConfig {
    id?: number;
    name: string;
    direction: number;
    maximum: number;
    parent: IRoundScoreConfig;
}
