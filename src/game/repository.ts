import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { FieldRepository, IField } from '../field/repository';
import { Game } from '../game';
import { Poule } from '../poule';
import { IPoulePlace, PoulePlaceRepository } from '../pouleplace/repository';
import { IReferee, RefereeRepository } from '../referee/repository';
import { SportRepository } from '../repository';
import { GameScoreRepository, IGameScore } from './score/repository';

/**
 * Created by coen on 20-3-17.
 */
@Injectable()
export class GameRepository extends SportRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private pouleplaceRepos: PoulePlaceRepository,
        private fieldRepos: FieldRepository,
        private refereeRepos: RefereeRepository,
        private gameScoreRepos: GameScoreRepository,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'games';
    }

    editObject(game: Game, poule: Poule): Observable<Game> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('pouleid', poule.getId().toString())
        };

        return this.http.put(this.url + '/' + game.getId(), this.objectToJsonHelper(game), options).pipe(
            map((res: IGame) => {
                return this.jsonToObjectHelper(res, game.getPoule(), game);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: IGame[], poule: Poule): Game[] {
        const objects: Game[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, poule);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IGame, poule: Poule, game?: Game): Game {
        if (game === undefined && json.id !== undefined) {
            game = this.cache[json.id];
        }
        if (game === undefined) {
            game = new Game(
                poule,
                poule.getPlaces().find(pouleplaceIt => json.homePoulePlace.number === pouleplaceIt.getNumber()),
                poule.getPlaces().find(pouleplaceIt => json.awayPoulePlace.number === pouleplaceIt.getNumber()),
                json.roundNumber, json.subNumber
            );
            game.setId(json.id);
            this.cache[game.getId()] = game;
        }
        game.setResourceBatch(json.resourceBatch);
        game.setState(json.state);
        if (json.field !== undefined) {
            game.setField(poule.getCompetition().getFieldByNumber(json.field.number));
        }
        game.setReferee(undefined);
        if (json.referee !== undefined) {
            game.setReferee(poule.getCompetition().getRefereeById(json.referee.id));
        }
        game.setStartDateTime(undefined);
        if (json.startDateTime !== undefined) {
            game.setStartDateTime(new Date(json.startDateTime));
        }
        while (game.getScores().length > 0) {
            game.getScores().pop();
        }
        this.gameScoreRepos.jsonArrayToObject(json.scores, game);
        return game;
    }

    objectsToJsonArray(objects: Game[]): IGame[] {
        const jsonArray: IGame[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Game): IGame {
        return {
            id: object.getId(),
            homePoulePlace: this.pouleplaceRepos.objectToJsonHelper(object.getHomePoulePlace()),
            awayPoulePlace: this.pouleplaceRepos.objectToJsonHelper(object.getAwayPoulePlace()),
            roundNumber: object.getRoundNumber(),
            subNumber: object.getSubNumber(),
            resourceBatch: object.getResourceBatch(),
            field: object.getField() ? this.fieldRepos.objectToJsonHelper(object.getField()) : undefined,
            state: object.getState(),
            referee: object.getReferee() ? this.refereeRepos.objectToJsonHelper(object.getReferee()) : undefined,
            startDateTime: object.getStartDateTime() ? object.getStartDateTime().toISOString() : undefined,
            scores: this.gameScoreRepos.objectsToJsonArray(object.getScores())
        };
    }
}

export interface IGame {
    id?: number;
    homePoulePlace: IPoulePlace;
    awayPoulePlace: IPoulePlace;
    roundNumber: number;
    subNumber: number;
    resourceBatch: number;
    field?: IField;
    state: number;
    startDateTime?: string;
    referee?: IReferee;
    scores?: IGameScore[];
}
