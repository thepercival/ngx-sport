import { Injectable } from '@angular/core';

import { GameMapper } from '../game/mapper';
import { Poule } from '../poule';
import { PlaceMapper } from '../place/mapper';
import { JsonPoule } from './json';
import { Round } from '../qualify/group';

@Injectable({
    providedIn: 'root'
})
export class PouleMapper {
    constructor(private placeMapper: PlaceMapper, private gameMapper: GameMapper) { }

    toObject(json: JsonPoule, round: Round, existingPoule: Poule | undefined): Poule {
        const poule = existingPoule ? existingPoule : new Poule(round, json.number);
        poule.setId(json.id);
        poule.setName(json.name);
        json.places.sort((placeA, placeB) => (placeA.number > placeB.number) ? 1 : -1);
        json.places.map(jsonPlace => this.placeMapper.toObject(jsonPlace, poule));
        return poule;
    }

    toJson(poule: Poule): JsonPoule {
        return {
            id: poule.getId(),
            number: poule.getNumber(),
            name: poule.getName(),
            places: poule.getPlaces().map(place => this.placeMapper.toJson(place)),
            againstGames: poule.getAgainstGames().map(game => this.gameMapper.toJsonAgainst(game)),
            togetherGames: poule.getTogetherGames().map(game => this.gameMapper.toJsonTogether(game))
        };
    }
}
