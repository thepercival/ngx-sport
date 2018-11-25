import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

    /*createObject(game: Game, poule: Poule): Observable<Game> {
        return this.http.post(this.url, this.objectToJson(game), this.getOptions(poule)).pipe(
            map((gameRes: IGame) => game.setId(gameRes.id)),
            catchError((err) => this.handleError(err))
        );
    }*/

    editObject(game: Game, poule: Poule): Observable<Game> {
        return this.http.put(this.url + '/' + game.getId(), this.objectToJson(game), this.getOptions(poule)).pipe(
            map((res: IGame) => this.jsonToObject(res, game.getPoule(), game)),
            catchError((err) => this.handleError(err))
        );
    }

    protected getOptions(poule: Poule): { headers: HttpHeaders; params: HttpParams } {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('pouleid', poule.getId().toString());
        httpParams = httpParams.set('competitionid', poule.getRound().getCompetition().getId().toString());
        return {
            headers: super.getHeaders(),
            params: httpParams
        };
    }

    jsonArrayToObject(jsonArray: IGame[], poule: Poule): Game[] {
        const objects: Game[] = [];
        for (const json of jsonArray) {
            const game = poule.getGames().find(gameIt => gameIt.getId() === json.id);
            objects.push(this.jsonToObject(json, poule, game));
        }
        return objects;
    }

    jsonToObject(json: IGame, poule: Poule, game?: Game): Game {
        if (game === undefined) {
            game = new Game(
                poule,
                poule.getPlaces().find(pouleplaceIt => json.homePoulePlace.number === pouleplaceIt.getNumber()),
                poule.getPlaces().find(pouleplaceIt => json.awayPoulePlace.number === pouleplaceIt.getNumber()),
                json.roundNumber, json.subNumber
            );
        }
        game.setId(json.id);
        game.setResourceBatch(json.resourceBatch);
        game.setState(json.state);
        game.setScoresMoment(json.scoresMoment);
        game.setField(json.field !== undefined ? poule.getCompetition().getFieldByNumber(json.field.number) : undefined);
        game.setReferee(undefined);
        game.setReferee(json.referee !== undefined ? poule.getCompetition().getRefereeById(json.referee.id) : undefined);
        game.setStartDateTime(undefined);
        game.setStartDateTime(json.startDateTime !== undefined ? new Date(json.startDateTime) : undefined);
        while (game.getScores().length > 0) {
            game.getScores().pop();
        }
        this.gameScoreRepos.jsonArrayToObject(json.scores, game);
        return game;
    }

    objectsToJsonArray(objects: Game[]): IGame[] {
        const jsonArray: IGame[] = [];
        for (const object of objects) {
            const json = this.objectToJson(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJson(object: Game): IGame {
        return {
            id: object.getId(),
            homePoulePlace: this.pouleplaceRepos.objectToJson(object.getHomePoulePlace()),
            awayPoulePlace: this.pouleplaceRepos.objectToJson(object.getAwayPoulePlace()),
            roundNumber: object.getRoundNumber(),
            subNumber: object.getSubNumber(),
            resourceBatch: object.getResourceBatch(),
            field: object.getField() ? this.fieldRepos.objectToJson(object.getField()) : undefined,
            state: object.getState(),
            referee: object.getReferee() ? this.refereeRepos.objectToJson(object.getReferee()) : undefined,
            startDateTime: object.getStartDateTime() ? object.getStartDateTime().toISOString() : undefined,
            scoresMoment: object.getScoresMoment(),
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
    scoresMoment?: number;
    scores?: IGameScore[];
}
