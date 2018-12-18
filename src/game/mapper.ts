import { Poule } from '../poule';
import { Game } from '../game';
import { JsonPoulePlace, PoulePlaceMapper } from '../pouleplace/mapper';
import { FieldMapper, JsonField } from '../field/mapper';
import { RefereeMapper, JsonReferee } from '../referee/mapper';
import { GameScoreMapper, JsonGameScore } from './score/mapper';
import { Injectable } from '@angular/core';

@Injectable()
export class GameMapper {

    constructor(
        private pouleplaceMapper: PoulePlaceMapper,
        private fieldMapper: FieldMapper,
        private refereeMapper: RefereeMapper,
        private scoreMapper: GameScoreMapper
        ) {}

    toObject(json: JsonGame, poule: Poule, game?: Game): Game {
        if (game === undefined) {
            game = new Game(
                poule,
                poule.getPlaces().find(pouleplaceIt => json.homePoulePlace.number === pouleplaceIt.getNumber()),
                poule.getPlaces().find(pouleplaceIt => json.awayPoulePlace.number === pouleplaceIt.getNumber()),
                json.roundNumber, json.subNumber
            );
        }
        game.setId(json.id);
        game.setResourceBatch(json.resourceBatch);
        game.setState(json.state);
        game.setScoresMoment(json.scoresMoment);
        game.setField(json.field !== undefined ? poule.getCompetition().getFieldByNumber(json.field.number) : undefined);
        game.setReferee(undefined);
        game.setReferee(json.referee !== undefined ? poule.getCompetition().getRefereeById(json.referee.id) : undefined);
        game.setStartDateTime(undefined);
        game.setStartDateTime(json.startDateTime !== undefined ? new Date(json.startDateTime) : undefined);
        while (game.getScores().length > 0) {
            game.getScores().pop();
        }
        json.scores.map( jsonScore => this.scoreMapper.toObject( jsonScore, game) );
        return game;
    }

    toArray(json: JsonGame[], poule: Poule): Game[] {
        return json.map( jsonGame => {
            const game = poule.getGames().find(gameIt => gameIt.getId() === jsonGame.id);
            return this.toObject(jsonGame, poule, game);
        } );
    }

    toJson(game: Game): JsonGame {
        return {
            id: game.getId(),
            homePoulePlace: this.pouleplaceMapper.toJson(game.getHomePoulePlace()),
            awayPoulePlace: this.pouleplaceMapper.toJson(game.getAwayPoulePlace()),
            roundNumber: game.getRoundNumber(),
            subNumber: game.getSubNumber(),
            resourceBatch: game.getResourceBatch(),
            field: game.getField() ? this.fieldMapper.toJson(game.getField()) : undefined,
            state: game.getState(),
            referee: game.getReferee() ? this.refereeMapper.toJson(game.getReferee()) : undefined,
            startDateTime: game.getStartDateTime() ? game.getStartDateTime().toISOString() : undefined,
            scoresMoment: game.getScoresMoment(),
            scores: game.getScores().map( score => this.scoreMapper.toJson(score) )
        };
    }
}

export interface JsonGame {
    id?: number;
    homePoulePlace: JsonPoulePlace;
    awayPoulePlace: JsonPoulePlace;
    roundNumber: number;
    subNumber: number;
    resourceBatch: number;
    field?: JsonField;
    state: number;
    startDateTime?: string;
    referee?: JsonReferee;
    scoresMoment?: number;
    scores?: JsonGameScore[];
}