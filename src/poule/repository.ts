/**
 * Created by coen on 3-3-17.
 */
import { Injectable } from '@angular/core';

import { GameRepository, IGame } from '../game/repository';
import { Poule } from '../poule';
import { IPoulePlace, PoulePlaceRepository } from '../pouleplace/repository';
import { Round } from '../round';


@Injectable()
export class PouleRepository {

    constructor(private pouleplaceRepos: PoulePlaceRepository, private gameRepos: GameRepository) {

    }

    jsonArrayToObject(jsonArray: any, round: Round): Poule[] {
        const objects: Poule[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, round);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: any, round: Round): Poule {
        const poule = new Poule(round, json.number);
        poule.setId(json.id);
        poule.setName(json.name);
        this.pouleplaceRepos.jsonArrayToObject(json.places, poule);
        if (json.games !== undefined) {
            this.gameRepos.jsonArrayToObject(json.games, poule);
        }
        return poule;
    }

    objectsToJsonArray(objects: any[]): IPoule[] {
        const jsonArray: IPoule[] = [];
        for (const object of objects) {
            jsonArray.push(this.objectToJsonHelper(object));
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Poule): IPoule {
        const json: IPoule = {
            id: object.getId(),
            number: object.getNumber(),
            name: object.getName(),
            places: this.pouleplaceRepos.objectsToJsonArray(object.getPlaces()),
            games: this.gameRepos.objectsToJsonArray(object.getGames())
        };
        return json;
    }
}

export interface IPoule {
    id?: number;
    number: number;
    name: string;
    places: IPoulePlace[];
    games: IGame[];
}
