import { GameScore } from '../score';
import { Game } from '../../game';
import { Injectable } from '@angular/core';

@Injectable()
export class GameScoreMapper {

    constructor()  {}

    toObject(json: JsonGameScore, game: Game, gameScore?: GameScore): GameScore {
        if (gameScore === undefined) {
            gameScore = new GameScore(game, json.home, json.away, json.number);
        }
        gameScore.setId(json.id);
        return gameScore;
    }

    toJson(gameScore: GameScore): JsonGameScore {
        return {
            id: gameScore.getId(),
            number: gameScore.getNumber(),
            home: gameScore.getHome(),
            away: gameScore.getAway()
        };
    }
}

export interface JsonGameScore {
    id?: number;
    number: number;
    home: number;
    away: number;
}
