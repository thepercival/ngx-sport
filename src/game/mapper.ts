import { Injectable } from '@angular/core';

import { Game } from '../game';
import { Poule } from '../poule';
import { GamePlaceMapper } from './place/mapper';
import { PlanningReferences } from '../planning/mapper';
import { JsonTogetherGame } from './together/json';
import { JsonAgainstGame } from './against/json';
import { AgainstGame } from './against';
import { TogetherGame } from './together';
import { CompetitionSportMapper } from 'src/competition/sport/mapper';
import { ScoreMapper } from 'src/score/mapper';

@Injectable({
    providedIn: 'root'
})
export class GameMapper {
    constructor(
        private gamePlaceMapper: GamePlaceMapper,
        private scoreMapper: ScoreMapper,
        private competitionSportMapper: CompetitionSportMapper
    ) { }

    toNewAgainst(json: JsonAgainstGame, poule: Poule, planningMapperCache: PlanningReferences): Game {
        const game = new AgainstGame(poule, json.batchNr, planningMapperCache.sports[json.competitionSport.id]);
        this.toNew(json, game, planningMapperCache);
        json.scores.map(jsonScore => this.scoreMapper.toAgainstObject(jsonScore, game));
        json.places.map(jsonGamePlace => this.gamePlaceMapper.toAgainstObject(jsonGamePlace, game, planningMapperCache));
        return game;
    }

    toNewTogether(json: JsonTogetherGame, poule: Poule, planningMapperCache: PlanningReferences): Game {
        const game = new TogetherGame(poule, json.batchNr, planningMapperCache.sports[json.competitionSport.id]);
        this.toNew(json, game, planningMapperCache);
        json.places.map(jsonGamePlace => this.gamePlaceMapper.toTogetherObject(jsonGamePlace, game, planningMapperCache));
        return game;
    }

    protected toNew(json: JsonAgainstGame | JsonTogetherGame, game: AgainstGame | TogetherGame, planningMapperCache: PlanningReferences): Game {
        game.setId(json.id);
        game.setState(json.state);
        if (json.fieldPriority) {
            game.setField(planningMapperCache.fields[json.fieldPriority]);
        }
        if (json.refereePriority) {
            game.setReferee(planningMapperCache.referees[json.refereePriority]);
        }
        if (json.refereePlaceLocId) {
            game.setRefereePlace(planningMapperCache.places[json.refereePlaceLocId]);
        }
        game.setStartDateTime(json.startDateTime !== undefined ? new Date(json.startDateTime) : undefined);
        // json.places.map(jsonGamePlace => this.gamePlaceMapper.toObject(jsonGamePlace, game, planningMapperCache));
        return game;
    }

    toExistingTogether(json: JsonTogetherGame, game: TogetherGame): TogetherGame {
        this.toExisting(json, game);
        return game;
    }

    toExistingAgainst(json: JsonAgainstGame, game: AgainstGame): AgainstGame {
        while (game.getScores().length > 0) {
            game.getScores().pop();
        }
        json.scores.map(jsonScore => this.scoreMapper.toAgainstObject(jsonScore, game));
        this.toExisting(json, game);
        return game;
    }

    protected toExisting(json: JsonAgainstGame | JsonTogetherGame, game: Game | TogetherGame) {
        game.setState(json.state);
        game.setStartDateTime(json.startDateTime !== undefined ? new Date(json.startDateTime) : undefined);
        return game;
    }

    toJsonAgainst(game: AgainstGame): JsonAgainstGame {
        return {
            id: game.getId(),
            places: game.getAgainstPlaces().map(gamePlace => this.gamePlaceMapper.toJsonAgainst(gamePlace)),
            competitionSport: this.competitionSportMapper.toJson(game.getCompetitionSport()),
            batchNr: game.getBatchNr(),
            fieldPriority: game.getField()?.getPriority(),
            state: game.getState(),
            refereePriority: game.getReferee()?.getPriority(),
            refereePlaceLocId: game.getRefereePlace()?.getLocationId(),
            startDateTime: game.getStartDateTime()?.toISOString(),
            scores: game.getScores().map(score => this.scoreMapper.toJsonAgainst(score))
        };
    }

    toJsonTogether(game: TogetherGame): JsonTogetherGame {
        return {
            id: game.getId(),
            places: game.getTogetherPlaces().map(gamePlace => this.gamePlaceMapper.toJsonTogether(gamePlace)),
            competitionSport: this.competitionSportMapper.toJson(game.getCompetitionSport()),
            batchNr: game.getBatchNr(),
            fieldPriority: game.getField()?.getPriority(),
            state: game.getState(),
            refereePriority: game.getReferee()?.getPriority(),
            refereePlaceLocId: game.getRefereePlace()?.getLocationId(),
            startDateTime: game.getStartDateTime()?.toISOString()
        };
    }
}
