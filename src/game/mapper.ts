import { Injectable } from '@angular/core';

import { FieldMapper, JsonField } from '../field/mapper';
import { Game } from '../game';
import { GamePoulePlaceMapper, JsonGamePoulePlace } from '../game/pouleplace/mapper';
import { Poule } from '../poule';
import { JsonPoulePlace, PoulePlaceMapper } from '../pouleplace/mapper';
import { JsonReferee, RefereeMapper } from '../referee/mapper';
import { GameScoreMapper, JsonGameScore } from './score/mapper';

@Injectable()
export class GameMapper {

    constructor(
        private gamePouleplaceMapper: GamePoulePlaceMapper,
        private fieldMapper: FieldMapper,
        private refereeMapper: RefereeMapper,
        private scoreMapper: GameScoreMapper,
        private poulePlaceMapper: PoulePlaceMapper,
    ) { }

    toObject(json: JsonGame, poule: Poule, game?: Game): Game {
        if (game === undefined) {
            game = new Game(poule, json.roundNumber, json.subNumber);
        }
        game.setId(json.id);
        game.setResourceBatch(json.resourceBatch);
        game.setState(json.state);
        game.setScoresMoment(json.scoresMoment);
        game.setField(json.field !== undefined ? poule.getCompetition().getFieldByNumber(json.field.number) : undefined);
        game.setReferee(json.referee !== undefined ? poule.getCompetition().getRefereeById(json.referee.id) : undefined);
        if (json.poulePlaceReferee !== undefined) {
            const poulePlaceReferee = poule.getPlaces().find(pouleplaceIt => json.poulePlaceReferee.number === pouleplaceIt.getNumber());
            game.setPoulePlaceReferee(poulePlaceReferee);
        }
        game.setStartDateTime(json.startDateTime !== undefined ? new Date(json.startDateTime) : undefined);
        while (game.getScores().length > 0) {
            game.getScores().pop();
        }
        json.scores.map(jsonScore => this.scoreMapper.toObject(jsonScore, game));
        while (game.getPoulePlaces().length > 0) {
            game.getPoulePlaces().pop();
        }
        json.poulePlaces.map(jsonGamePoulePlace => this.gamePouleplaceMapper.toObject(jsonGamePoulePlace, game));
        return game;
    }

    toArray(json: JsonGame[], poule: Poule): Game[] {
        return json.map(jsonGame => {
            const game = poule.getGames().find(gameIt => gameIt.getId() === jsonGame.id);
            return this.toObject(jsonGame, poule, game);
        });
    }

    toJson(game: Game): JsonGame {
        return {
            id: game.getId(),
            poulePlaces: game.getPoulePlaces().map(gamePoulePlace => this.gamePouleplaceMapper.toJson(gamePoulePlace)),
            roundNumber: game.getRoundNumber(),
            subNumber: game.getSubNumber(),
            resourceBatch: game.getResourceBatch(),
            field: game.getField() ? this.fieldMapper.toJson(game.getField()) : undefined,
            state: game.getState(),
            referee: game.getReferee() ? this.refereeMapper.toJson(game.getReferee()) : undefined,
            poulePlaceReferee: game.getPoulePlaceReferee() ? this.poulePlaceMapper.toJson(game.getPoulePlaceReferee()) : undefined,
            startDateTime: game.getStartDateTime() ? game.getStartDateTime().toISOString() : undefined,
            scoresMoment: game.getScoresMoment(),
            scores: game.getScores().map(score => this.scoreMapper.toJson(score))
        };
    }
}

export interface JsonGame {
    id?: number;
    poulePlaces: JsonGamePoulePlace[];
    roundNumber: number;
    subNumber: number;
    resourceBatch: number;
    field?: JsonField;
    state: number;
    startDateTime?: string;
    referee?: JsonReferee;
    poulePlaceReferee?: JsonPoulePlace;
    scoresMoment?: number;
    scores?: JsonGameScore[];
}
