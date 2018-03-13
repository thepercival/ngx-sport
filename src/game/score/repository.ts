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
            const object = this.jsonToObjectHelper(json, game);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IGameScore, game: Game, gameScore?: GameScore): GameScore {
        if (gameScore === undefined) {
            gameScore = new GameScore(game, json.number);
        }
        gameScore.setId(json.id);
        gameScore.setHome(json.home);
        gameScore.setAway(json.away);
        gameScore.setMoment(json.moment);

        return gameScore;
    }

    objectsToJsonArray(objects: GameScore[]): IGameScore[] {
        const jsonArray: IGameScore[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: GameScore): IGameScore {
        return {
            id: object.getId(),
            number: object.getNumber(),
            home: object.getHome(),
            away: object.getAway(),
            moment: object.getMoment()
        };
    }
}

export interface IGameScore {
    id?: number;
    number: number;
    home: number;
    away: number;
    moment: number;
}
