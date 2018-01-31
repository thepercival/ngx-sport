/**
 * Created by coen on 3-3-17.
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { SportRepository } from '../repository';
import { ITeam, TeamRepository } from '../team/repository';

@Injectable()
export class PoulePlaceRepository extends SportRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private teamRepos: TeamRepository,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'pouleplaces';
    }

    editObject(poulePlace: PoulePlace, poule: Poule): Observable<PoulePlace> {

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('pouleid', poule.getId().toString())
        };

        return this.http.put(this.url + '/' + poulePlace.getId(), this.objectToJsonHelper(poulePlace), options).pipe(
            map((res: IPoulePlace) => {
                return this.jsonToObjectHelper(res, poulePlace.getPoule(), poulePlace);
            }),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: any, poule: Poule): PoulePlace[] {
        const objects: PoulePlace[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, poule);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IPoulePlace, poule: Poule, poulePlace?: PoulePlace): PoulePlace {
        if (poulePlace === undefined) {
            poulePlace = new PoulePlace(poule, json.number);
        }
        poulePlace.setId(json.id);
        poule.setName(json.name);
        if (json.team) {
            poulePlace.setTeam(this.teamRepos.jsonToObjectHelper(json.team, poule.getCompetitionseason().getAssociation()));
        }
        return poulePlace;
    }

    objectsToJsonArray(objects: PoulePlace[]): IPoulePlace[] {
        const jsonArray: IPoulePlace[] = [];
        for (const object of objects) {
            jsonArray.push(this.objectToJsonHelper(object));
        }
        return jsonArray;
    }

    objectToJsonHelper(object: PoulePlace): IPoulePlace {
        return {
            id: object.getId(),
            number: object.getNumber(),
            name: object.getName(),
            team: object.getTeam() ? this.teamRepos.objectToJsonHelper(object.getTeam()) : undefined
        };
    }
}

export interface IPoulePlace {
    id?: number;
    number: number;
    name: string;
    team?: ITeam;
}
