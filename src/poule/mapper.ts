import { Injectable } from '@angular/core';

import { GameMapper } from '../game/mapper';
import { Poule } from '../poule';
import { PlaceMapper } from '../place/mapper';
import { Round } from '../round';
import { JsonPoule } from './json';

@Injectable()
export class PouleMapper {
    constructor(private placeMapper: PlaceMapper, private gameMapper: GameMapper) { }

    toObject(json: JsonPoule, round: Round, poule?: Poule): Poule {
        poule = new Poule(round, json.number);
        poule.setId(json.id);
        poule.setName(json.name);
        json.places.sort((placeA, placeB) => {
            return (placeA.number > placeB.number) ? 1 : -1;
        });
        json.places.map(jsonPlace => this.placeMapper.toObject(jsonPlace, poule));
        if (json.games !== undefined) {
            json.games.forEach(jsonGame => {
                const game = poule.getGames().find(gameIt => gameIt.getId() === jsonGame.id);
                this.gameMapper.toObject(jsonGame, poule, game);
            });
        }
        return poule;
    }

    toJson(poule: Poule): JsonPoule {
        return {
            id: poule.getId(),
            number: poule.getNumber(),
            name: poule.getName(),
            places: poule.getPlaces().map(place => this.placeMapper.toJson(place)),
            games: poule.getGames().map(game => this.gameMapper.toJson(game))
        };
    }
}
