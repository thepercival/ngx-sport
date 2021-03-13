import { Injectable } from '@angular/core';

import { Game } from '../game';
import { Poule } from '../poule';
import { GamePlaceMapper } from './place/mapper';
import { PlanningReferences } from '../planning/mapper';
import { JsonTogetherGame } from './together/json';
import { JsonAgainstGame } from './against/json';
import { AgainstGame } from './against';
import { TogetherGame } from './together';
import { CompetitionSportMapper } from '../competition/sport/mapper';
import { ScoreMapper } from '../score/mapper';
import { FieldMapper } from '../field/mapper';
import { GameMode } from '../planning/gameMode';
import { RefereeMapper } from '../referee/mapper';

@Injectable({
    providedIn: 'root'
})
export class GameMapper {
    constructor(
        private gamePlaceMapper: GamePlaceMapper,
        private fieldMapper: FieldMapper,
        private refereeMapper: RefereeMapper,
        private scoreMapper: ScoreMapper,
        private competitionSportMapper: CompetitionSportMapper
    ) { }

    toNewAgainst(json: JsonAgainstGame, poule: Poule, planningMapperCache: PlanningReferences): Game {
        const game = new AgainstGame(poule, json.batchNr, planningMapperCache.sports[json.competitionSport.id]);
        this.toNewHelper(json, game, planningMapperCache);
        json.scores.map(jsonScore => this.scoreMapper.toAgainstObject(jsonScore, game));
        json.places.map(jsonGamePlace => this.gamePlaceMapper.toAgainstObject(jsonGamePlace, game, planningMapperCache));
        return game;
    }

    toNewTogether(json: JsonTogetherGame, poule: Poule, planningMapperCache: PlanningReferences): Game {
        const game = new TogetherGame(poule, json.batchNr, planningMapperCache.sports[json.competitionSport.id]);
        this.toNewHelper(json, game, planningMapperCache);
        json.places.map(jsonGamePlace => this.gamePlaceMapper.toTogetherObject(jsonGamePlace, game, planningMapperCache));
        return game;
    }

    protected toNewHelper(json: JsonAgainstGame | JsonTogetherGame, game: AgainstGame | TogetherGame, planningMapperCache: PlanningReferences): Game {
        game.setId(json.id);
        game.setState(json.state);
        if (json.field) {
            game.setField(this.fieldMapper.getFromCompetitionSport(json.field.id, game.getCompetitionSport()));
        }
        if (json.referee) {
            game.setReferee(this.refereeMapper.getFromCompetition(json.referee.id, game.getCompetition()));
        }
        if (json.refereePlaceLocId) {
            game.setRefereePlace(planningMapperCache.places[json.refereePlaceLocId]);
        }
        game.setStartDateTime(json.startDateTime !== undefined ? new Date(json.startDateTime) : undefined);
        // json.places.map(jsonGamePlace => this.gamePlaceMapper.toObject(jsonGamePlace, game, planningMapperCache));
        return game;
    }

    toExisting(json: JsonTogetherGame | JsonAgainstGame, game: TogetherGame | AgainstGame): TogetherGame | AgainstGame {
        if (game instanceof AgainstGame) {
            return this.toExistingAgainst(<JsonAgainstGame>json, game);
        }
        return this.toExistingTogether(<JsonTogetherGame>json, game);
    }

    toExistingTogether(json: JsonTogetherGame, game: TogetherGame): TogetherGame {
        this.toExistingHelper(json, game);
        return game;
    }

    toExistingAgainst(json: JsonAgainstGame, game: AgainstGame): AgainstGame {
        while (game.getScores().length > 0) {
            game.getScores().pop();
        }
        json.scores.map(jsonScore => this.scoreMapper.toAgainstObject(jsonScore, game));
        this.toExistingHelper(json, game);
        return game;
    }

    protected toExistingHelper(json: JsonAgainstGame | JsonTogetherGame, game: Game | TogetherGame) {
        game.setState(json.state);
        game.setStartDateTime(json.startDateTime !== undefined ? new Date(json.startDateTime) : undefined);
        return game;
    }

    toJson(game: AgainstGame | TogetherGame): JsonAgainstGame | JsonTogetherGame {
        return (game instanceof AgainstGame) ? this.toJsonAgainst(game) : this.toJsonTogether(game);
    }

    toJsonAgainst(game: AgainstGame): JsonAgainstGame {
        const field = game.getField();
        const referee = game.getReferee();
        return {
            id: game.getId(),
            places: game.getAgainstPlaces().map(gamePlace => this.gamePlaceMapper.toJsonAgainst(gamePlace)),
            competitionSport: this.competitionSportMapper.toJson(game.getCompetitionSport()),
            batchNr: game.getBatchNr(),
            field: field ? this.fieldMapper.toJson(field) : undefined,
            referee: referee ? this.refereeMapper.toJson(referee) : undefined,
            state: game.getState(),
            refereePlaceLocId: game.getRefereePlace()?.getRoundLocationId(),
            startDateTime: game.getStartDateTime()?.toISOString(),
            scores: game.getScores().map(score => this.scoreMapper.toJsonAgainst(score))
        };
    }

    toJsonTogether(game: TogetherGame): JsonTogetherGame {
        const field = game.getField();
        const referee = game.getReferee();
        return {
            id: game.getId(),
            places: game.getTogetherPlaces().map(gamePlace => this.gamePlaceMapper.toJsonTogether(gamePlace)),
            competitionSport: this.competitionSportMapper.toJson(game.getCompetitionSport()),
            batchNr: game.getBatchNr(),
            field: field ? this.fieldMapper.toJson(field) : undefined,
            referee: referee ? this.refereeMapper.toJson(referee) : undefined,
            state: game.getState(),
            refereePlaceLocId: game.getRefereePlace()?.getRoundLocationId(),
            startDateTime: game.getStartDateTime()?.toISOString()
        };
    }
}
