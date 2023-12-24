import { Injectable } from '@angular/core';

import { Game } from '../game';
import { Poule } from '../poule';
import { GamePlaceMapper } from './place/mapper';
import { JsonTogetherGame } from './together/json';
import { JsonAgainstGame } from './against/json';
import { AgainstGame } from './against';
import { TogetherGame } from './together';
import { CompetitionSportMap, CompetitionSportMapper } from '../competition/sport/mapper';
import { ScoreMapper } from '../score/mapper';
import { FieldMapper } from '../field/mapper';
import { RefereeMapper } from '../referee/mapper';
import { PlaceMap } from '../place/mapper';
import { CompetitionSport } from '../competition/sport';
import { Place } from '../place';
import { AgainstVariant } from '../sport/variant/against';
import { JsonTogetherGamePlace } from './place/together/json';
import { JsonTogetherScore } from '../score/together/json';
import { TogetherGamePlace } from './place/together';

@Injectable({
    providedIn: 'root'
})
export class GameMapper {
    private placeMap: PlaceMap | undefined;

    constructor(
        private gamePlaceMapper: GamePlaceMapper,
        private fieldMapper: FieldMapper,
        private refereeMapper: RefereeMapper,
        private scoreMapper: ScoreMapper,
        private competitionSportMapper: CompetitionSportMapper
    ) { }

    setPlaceMap(placeMap: PlaceMap) {
        this.placeMap = placeMap;
    }

    toNew(json: JsonTogetherGame | JsonAgainstGame, poule: Poule, map: CompetitionSportMap): TogetherGame | AgainstGame {
        const competitionSport = map[json.competitionSport.id];
        if (competitionSport.getVariant() instanceof AgainstVariant) {
            return this.toNewAgainst(<JsonAgainstGame>json, poule, competitionSport);
        }
        return this.toNewTogether(<JsonTogetherGame>json, poule, competitionSport);
    }

    toNewAgainst(json: JsonAgainstGame, poule: Poule, competitionSport: CompetitionSport): AgainstGame {
        const game = new AgainstGame(poule, json.batchNr, new Date(json.startDateTime), competitionSport, json.gameRoundNumber);
        this.toNewHelper(json, game);
        game.setHomeExtraPoints(json.homeExtraPoints);
        game.setAwayExtraPoints(json.awayExtraPoints);
        json.scores.map(jsonScore => this.scoreMapper.toAgainstObject(jsonScore, game));
        json.places.map(jsonGamePlace => this.gamePlaceMapper.toAgainstObject(jsonGamePlace, game));
        return game;
    }

    toNewTogether(json: JsonTogetherGame, poule: Poule, competitionSport: CompetitionSport): TogetherGame {
        const game = new TogetherGame(poule, json.batchNr, new Date(json.startDateTime), competitionSport);
        this.toNewHelper(json, game);
        json.places.map(jsonGamePlace => this.gamePlaceMapper.toTogetherObject(jsonGamePlace, game));
        return game;
    }

    protected toNewHelper(json: JsonAgainstGame | JsonTogetherGame, game: AgainstGame | TogetherGame): AgainstGame | TogetherGame {
        game.setId(json.id);
        game.setState(json.state);
        if (json.field) {
            game.setField(this.fieldMapper.getFromCompetitionSport(json.field.id, game.getCompetitionSport()));
        }
        if (json.referee) {
            game.setReferee(this.refereeMapper.getFromCompetition(json.referee.id, game.getCompetition()));
        }

        if (json.refereeStructureLocation) {
            game.setRefereePlace(this.getRefereePlace(json.refereeStructureLocation));
        }
        game.setStartDateTime(new Date(json.startDateTime));
        return game;
    }

    protected getRefereePlace(refereeStructureLocation: string): Place | undefined {
        if (this.placeMap === undefined) {
            return undefined;
        }
        return this.placeMap[refereeStructureLocation];
    }

    toExisting(json: JsonTogetherGame | JsonAgainstGame, game: TogetherGame | AgainstGame): TogetherGame | AgainstGame {
        if (game instanceof AgainstGame) {
            return this.toExistingAgainst(<JsonAgainstGame>json, game);
        }
        return this.toExistingTogether(<JsonTogetherGame>json, game);
    }

    toExistingTogether(json: JsonTogetherGame, game: TogetherGame): TogetherGame {
        json.places.forEach((jsonGamePlace: JsonTogetherGamePlace) => {
            const gamePlace = this.getGamePlaceById(game.getTogetherPlaces(), jsonGamePlace.id);
            if( gamePlace === undefined) {
                return;
            }
            while (gamePlace.getScores().length > 0) {
                gamePlace.getScores().pop();
            }
            jsonGamePlace.scores.forEach((jsonScore: JsonTogetherScore) => {
                this.scoreMapper.toTogetherObject(jsonScore, gamePlace);
            });
        });
        this.toExistingHelper(json, game);
        return game;
    }

    private getGamePlaceById(gamePlaces: TogetherGamePlace[], id: string|number): TogetherGamePlace|undefined {
        return gamePlaces.find(gamePlace => gamePlace.getId() === id);
    }

    toExistingAgainst(json: JsonAgainstGame, game: AgainstGame): AgainstGame {
        while (game.getScores().length > 0) {
            game.getScores().pop();
        }
        json.scores.map(jsonScore => this.scoreMapper.toAgainstObject(jsonScore, game));
        game.setHomeExtraPoints(json.homeExtraPoints);
        game.setAwayExtraPoints(json.awayExtraPoints);
        this.toExistingHelper(json, game);
        return game;
    }

    protected toExistingHelper(json: JsonAgainstGame | JsonTogetherGame, game: Game | TogetherGame) {
        game.setState(json.state);
        game.setStartDateTime(new Date(json.startDateTime));
        return game;
    }

    toJson(game: AgainstGame | TogetherGame): JsonAgainstGame | JsonTogetherGame {
        return (game instanceof AgainstGame) ? this.toJsonAgainst(game) : this.toJsonTogether(game);
    }

    toJsonAgainst(game: AgainstGame): JsonAgainstGame {
        const field = game.getField();
        const referee = game.getReferee();
        const refereePlace = game.getRefereePlace();
        return {
            id: game.getId(),
            places: game.getAgainstPlaces().map(gamePlace => this.gamePlaceMapper.toJsonAgainst(gamePlace)),
            competitionSport: this.competitionSportMapper.toJson(game.getCompetitionSport()),
            batchNr: game.getBatchNr(),
            field: field ? this.fieldMapper.toJson(field) : undefined,
            referee: referee ? this.refereeMapper.toJson(referee) : undefined,
            state: game.getState(),
            refereeStructureLocation: refereePlace ? refereePlace.getStructureLocation() : undefined,
            startDateTime: game.getStartDateTime()?.toISOString(),
            scores: game.getScores().map(score => this.scoreMapper.toJsonAgainst(score)),
            gameRoundNumber: game.getGameRoundNumber(),
            homeExtraPoints: game.getHomeExtraPoints(),
            awayExtraPoints: game.getAwayExtraPoints()
        };
    }

    toJsonTogether(game: TogetherGame): JsonTogetherGame {
        const field = game.getField();
        const referee = game.getReferee();
        const refereePlace = game.getRefereePlace();
        return {
            id: game.getId(),
            places: game.getTogetherPlaces().map(gamePlace => this.gamePlaceMapper.toJsonTogether(gamePlace)),
            competitionSport: this.competitionSportMapper.toJson(game.getCompetitionSport()),
            batchNr: game.getBatchNr(),
            field: field ? this.fieldMapper.toJson(field) : undefined,
            referee: referee ? this.refereeMapper.toJson(referee) : undefined,
            state: game.getState(),
            refereeStructureLocation: refereePlace ? refereePlace.getStructureLocation() : undefined,
            startDateTime: game.getStartDateTime()?.toISOString()
        };
    }
}
