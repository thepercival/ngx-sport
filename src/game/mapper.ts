import { Injectable } from '@angular/core';

import { Game } from '../game';
import { Poule } from '../poule';
import { GamePlaceMapper } from './place/mapper';
import { GameScoreMapper } from './score/mapper';
import { JsonGame } from './json';
import { PlanningReferences } from '../planning/mapper';

@Injectable({
    providedIn: 'root'
})
export class GameMapper {

    constructor(
        private gamePlaceMapper: GamePlaceMapper,
        private scoreMapper: GameScoreMapper,
    ) { }

    toNewObject(json: JsonGame, poule: Poule, planningMapperCache: PlanningReferences): Game {
        const game = new Game(poule, json.batchNr);
        game.setId(json.id);
        game.setState(json.state);
        game.setField(planningMapperCache.fields[json.fieldPriority]);
        game.setReferee(planningMapperCache.referees[json.refereePriority]);
        game.setRefereePlace(planningMapperCache.places[json.refereePlaceLocId]);
        game.setStartDateTime(json.startDateTime !== undefined ? new Date(json.startDateTime) : undefined);
        json.scores.map(jsonScore => this.scoreMapper.toObject(jsonScore, game));
        json.places.map(jsonGamePlace => this.gamePlaceMapper.toObject(jsonGamePlace, game, planningMapperCache));
        return game;
    }

    toExistingObject(json: JsonGame, game: Game): Game {
        game.setState(json.state);
        game.setStartDateTime(json.startDateTime !== undefined ? new Date(json.startDateTime) : undefined);
        while (game.getScores().length > 0) {
            game.getScores().pop();
        }
        json.scores.map(jsonScore => this.scoreMapper.toObject(jsonScore, game));
        return game;
    }

    toJson(game: Game): JsonGame {
        return {
            id: game.getId(),
            places: game.getPlaces().map(gamePlace => this.gamePlaceMapper.toJson(gamePlace)),
            batchNr: game.getBatchNr(),
            fieldPriority: game.getField().getPriority(),
            state: game.getState(),
            refereePriority: game.getReferee() ? game.getReferee().getPriority() : undefined,
            refereePlaceLocId: game.getRefereePlace() ? game.getRefereePlace().getLocationId() : undefined,
            startDateTime: game.getStartDateTime() ? game.getStartDateTime().toISOString() : undefined,
            scores: game.getScores().map(score => this.scoreMapper.toJson(score))
        };
    }
}
