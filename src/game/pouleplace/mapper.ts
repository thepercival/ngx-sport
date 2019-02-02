import { Injectable } from '@angular/core';

import { Game } from '../../game';
import { JsonPoulePlace, PoulePlaceMapper } from '../../pouleplace/mapper';
import { GamePoulePlace } from '../pouleplace';

@Injectable()
export class GamePoulePlaceMapper {

    constructor(private pouleplaceMapper: PoulePlaceMapper) { }

    toObject(json: JsonGamePoulePlace, game: Game, gamePoulePlace?: GamePoulePlace): GamePoulePlace {
        if (gamePoulePlace === undefined) {
            const poulePlace = game.getPoule().getPlaces().find(pouleplaceIt => json.poulePlace.number === pouleplaceIt.getNumber());
            gamePoulePlace = new GamePoulePlace(game, poulePlace, json.homeaway);
        }
        gamePoulePlace.setId(json.id);
        return gamePoulePlace;
    }

    toJson(gamePoulePlace: GamePoulePlace): JsonGamePoulePlace {
        return {
            id: gamePoulePlace.getId(),
            poulePlace: this.pouleplaceMapper.toJson(gamePoulePlace.getPoulePlace()),
            homeaway: gamePoulePlace.getHomeaway()
        };
    }
}

export interface JsonGamePoulePlace {
    id?: number;
    poulePlace: JsonPoulePlace;
    homeaway: boolean;
}