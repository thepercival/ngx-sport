import { Injectable } from '@angular/core';

import { Game } from '../game';
import { Poule } from '../poule';
import { GamePlaceMapper } from './place/mapper';
import { GameScoreMapper } from './score/mapper';
import { JsonGame } from './json';

@Injectable({
    providedIn: 'root'
})
export class GameMapper {

    constructor(
        private gamePlaceMapper: GamePlaceMapper,
        private scoreMapper: GameScoreMapper,
    ) { }

    toObject(json: JsonGame, poule: Poule, game?: Game): Game {
        if (game === undefined) {
            game = new Game(poule, json.batchNr);
        }
        game.setId(json.id);
        game.setState(json.state);
        game.setField(poule.getCompetition().getField(json.fieldNr));
        game.setReferee(json.refereeRank !== undefined ? poule.getCompetition().getReferee(json.refereeRank) : undefined);

        game.setStartDateTime(json.startDateTime !== undefined ? new Date(json.startDateTime) : undefined);
        while (game.getScores().length > 0) {
            game.getScores().pop();
        }
        json.scores.map(jsonScore => this.scoreMapper.toObject(jsonScore, game));
        while (game.getPlaces().length > 0) {
            game.getPlaces().pop();
        }
        json.places.map(jsonGamePlace => this.gamePlaceMapper.toObject(jsonGamePlace, game));
        return game;
    }

    toJson(game: Game): JsonGame {
        return {
            id: game.getId(),
            places: game.getPlaces().map(gamePlace => this.gamePlaceMapper.toJson(gamePlace)),
            batchNr: game.getBatchNr(),
            fieldNr: game.getField().getNumber(),
            state: game.getState(),
            refereeRank: game.getReferee() ? game.getReferee().getRank() : undefined,
            refereePlaceId: game.getRefereePlace() ? game.getRefereePlace().getId() : undefined,
            startDateTime: game.getStartDateTime() ? game.getStartDateTime().toISOString() : undefined,
            scores: game.getScores().map(score => this.scoreMapper.toJson(score))
        };
    }

    toArray(json: JsonGame[], poule: Poule): Game[] {
        return json.map(jsonGame => {
            const game = poule.getGames().find(gameIt => gameIt.getId() === jsonGame.id);
            return this.toObject(jsonGame, poule, game);
        });
    }
}
