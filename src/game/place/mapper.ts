import { Injectable } from '@angular/core';

import { Game } from '../../game';
import { GamePlace } from '../place';
import { JsonGamePlace } from './json';

@Injectable({
    providedIn: 'root'
})
export class GamePlaceMapper {

    constructor() { }

    toObject(json: JsonGamePlace, game: Game, gamePlace?: GamePlace): GamePlace {
        if (gamePlace === undefined) {
            const place = game.getPoule().getPlaces().find(placeIt => json.placeNr === placeIt.getNumber());
            gamePlace = new GamePlace(game, place, json.homeaway);
        }
        gamePlace.setId(json.id);
        return gamePlace;
    }

    toJson(gamePlace: GamePlace): JsonGamePlace {
        return {
            id: gamePlace.getId(),
            placeNr: gamePlace.getPlace().getNumber(),
            homeaway: gamePlace.getHomeaway()
        };
    }
}
