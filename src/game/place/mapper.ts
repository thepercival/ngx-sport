import { Injectable } from '@angular/core';

import { GamePlace } from '../place';
import { PlanningReferences } from '../../planning/mapper';
import { AgainstGame } from '../against';
import { TogetherGame } from '../together';
import { JsonAgainstGamePlace } from './against/json';
import { JsonTogetherGamePlace } from './together/json';
import { AgainstGamePlace } from './against';
import { TogetherGamePlace } from './together';
import { ScoreMapper } from '../../score/mapper';
import { Place } from '../../place';

@Injectable({
    providedIn: 'root'
})
export class GamePlaceMapper {

    constructor(private scoreMapper: ScoreMapper) { }

    toAgainstObject(json: JsonAgainstGamePlace, game: AgainstGame): GamePlace {
        const place = game.getPoule().getPlace(json.placeNr);
        const gamePlace = new AgainstGamePlace(game, place, json.side);
        gamePlace.setId(json.id);
        return gamePlace;
    }

    toTogetherObject(json: JsonTogetherGamePlace, game: TogetherGame): GamePlace {
        const place = game.getPoule().getPlace(json.placeNr);
        const gamePlace = new TogetherGamePlace(game, place, json.gameRoundNumber);
        gamePlace.setId(json.id);
        json.scores.map(jsonScore => this.scoreMapper.toTogetherObject(jsonScore, gamePlace));
        return gamePlace;
    }

    toJsonAgainst(gamePlace: AgainstGamePlace): JsonAgainstGamePlace {
        return {
            id: gamePlace.getId(),
            placeNr: gamePlace.getPlace().getNumber(),
            side: gamePlace.getSide()
        };
    }

    toJsonTogether(gamePlace: TogetherGamePlace): JsonTogetherGamePlace {
        const json = {
            id: gamePlace.getId(),
            placeNr: gamePlace.getPlace().getNumber(),
            gameRoundNumber: gamePlace.getGameRoundNumber(),
            scores: []
        };
        while (gamePlace.getScores().length > 0) {
            gamePlace.getScores().pop();
        }
        json.scores.map(jsonScore => this.scoreMapper.toTogetherObject(jsonScore, gamePlace));
        return json;
    }
}
