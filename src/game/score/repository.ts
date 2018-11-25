import { Injectable } from '@angular/core';

import { Game } from '../../game';
import { GameScore } from '../score';

@Injectable()
export class GameScoreRepository {

    constructor(
    ) {
    }

    jsonArrayToObject(jsonArray: IGameScore[], game: Game): GameScore[] {
        const objects: GameScore[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObject(json, game);
            objects.push(object);
        }
        return objects;
    }

    jsonToObject(json: IGameScore, game: Game, gameScore?: GameScore): GameScore {
        if (gameScore === undefined) {
            gameScore = new GameScore(game, json.home, json.away, json.number);
        }
        gameScore.setId(json.id);
        return gameScore;
    }

    objectsToJsonArray(objects: GameScore[]): IGameScore[] {
        const jsonArray: IGameScore[] = [];
        for (const object of objects) {
            const json = this.objectToJson(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJson(object: GameScore): IGameScore {
        return {
            id: object.getId(),
            number: object.getNumber(),
            home: object.getHome(),
            away: object.getAway()
        };
    }
}

export interface IGameScore {
    id?: number;
    number: number;
    home: number;
    away: number;
}
