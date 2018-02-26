/**
 * Created by coen on 3-3-17.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { GameRepository, IGame } from '../game/repository';
import { Poule } from '../poule';
import { IPoulePlace, PoulePlaceRepository } from '../pouleplace/repository';
import { SportRepository } from '../repository';
import { Round } from '../round';

@Injectable()
export class PouleRepository extends SportRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private pouleplaceRepos: PoulePlaceRepository,
        private gameRepos: GameRepository,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'poules';
    }

    jsonArrayToObject(jsonArray: any, round: Round): Poule[] {
        const objects: Poule[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, round);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: any, round: Round, poule?: Poule): Poule {
        if (poule === undefined && json.id !== undefined) {
            poule = this.cache[json.id];
        }
        if (poule === undefined) {
            poule = new Poule(round, json.number);
            poule.setId(json.id);
            this.cache[poule.getId()] = poule;
        }
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
