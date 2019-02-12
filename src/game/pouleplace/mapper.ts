import { Injectable } from '@angular/core';

import { Game } from '../../game';
import { GamePoulePlace } from '../pouleplace';

@Injectable()
export class GamePoulePlaceMapper {

    constructor() { }

    toObject(json: JsonGamePoulePlace, game: Game, gamePoulePlace?: GamePoulePlace): GamePoulePlace {
        if (gamePoulePlace === undefined) {
            const poulePlace = game.getPoule().getPlaces().find(pouleplaceIt => json.poulePlaceNr === pouleplaceIt.getNumber());
            gamePoulePlace = new GamePoulePlace(game, poulePlace, json.homeaway);
        }
        gamePoulePlace.setId(json.id);
        return gamePoulePlace;
    }

    toJson(gamePoulePlace: GamePoulePlace): JsonGamePoulePlace {
        return {
            id: gamePoulePlace.getId(),
            poulePlaceNr: gamePoulePlace.getPoulePlace().getNumber(),
            homeaway: gamePoulePlace.getHomeaway()
        };
    }
}

export interface JsonGamePoulePlace {
    id?: number;
    poulePlaceNr: number;
    homeaway: boolean;
}