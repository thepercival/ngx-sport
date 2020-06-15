import { Injectable } from '@angular/core';

import { Game } from '../../game';
import { GamePlace } from '../place';
import { JsonGamePlace } from './json';
import { PlanningReferences } from '../../planning/mapper';

@Injectable({
    providedIn: 'root'
})
export class GamePlaceMapper {

    constructor() { }

    toObject(json: JsonGamePlace, game: Game, planningMapperCache: PlanningReferences): GamePlace {
        const place = planningMapperCache.places[game.getPoule().getStructureNumber() + '.' + json.placeNr];
        const gamePlace = new GamePlace(game, place, json.homeaway);
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
