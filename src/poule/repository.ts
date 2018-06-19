import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { GameRepository, IGame } from '../game/repository';
import { Poule } from '../poule';
import { IPoulePlace, PoulePlaceRepository } from '../pouleplace/repository';
import { SportRepository } from '../repository';
import { Round } from '../round';

/**
 * Created by coen on 3-3-17.
 */
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

    jsonArrayToObject(jsonArray: IPoule[], round: Round): Poule[] {
        const poules: Poule[] = [];
        for (const json of jsonArray) {
            poules.push(this.jsonToObjectHelper(json, round, round.getPoule(json.number)));
        }
        return poules;
    }

    jsonToObjectHelper(json: IPoule, round: Round, poule?: Poule): Poule {
        poule = new Poule(round, json.number);
        poule.setId(json.id);
        poule.setName(json.name);
        json.places.sort((poulePlaceA, poulePlaceB) => {
            return (poulePlaceA.number > poulePlaceB.number) ? 1 : -1;
        });
        this.pouleplaceRepos.jsonArrayToObject(json.places, poule);
        if (json.games !== undefined) {
            this.gameRepos.jsonArrayToObject(json.games, poule);
        }
        return poule;
    }

    objectsToJsonArray(objects: Poule[]): IPoule[] {
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
