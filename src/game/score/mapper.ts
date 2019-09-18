import { GameScore } from '../score';
import { Game } from '../../game';
import { Injectable } from '@angular/core';

@Injectable()
export class GameScoreMapper {

    constructor() { }

    toObject(json: JsonGameScore, game: Game, gameScore?: GameScore): GameScore {
        if (gameScore === undefined) {
            gameScore = new GameScore(game, json.home, json.away, json.phase, json.number);
        }
        gameScore.setId(json.id);
        return gameScore;
    }

    toJson(gameScore: GameScore): JsonGameScore {
        return {
            id: gameScore.getId(),
            home: gameScore.getHome(),
            away: gameScore.getAway(),
            phase: gameScore.getPhase(),
            number: gameScore.getNumber()
        };
    }
}

export interface JsonGameScore {
    id?: number;
    home: number;
    away: number;
    phase: number;
    number: number;
}
