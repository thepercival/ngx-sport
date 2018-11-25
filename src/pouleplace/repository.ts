import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { SportRepository } from '../repository';
import { ITeam, TeamRepository } from '../team/repository';

/**
 * Created by coen on 3-3-17.
 */
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
        return this.http.put(this.url + '/' + poulePlace.getId(), this.objectToJson(poulePlace), this.getOptions(poule)).pipe(
            map((res: IPoulePlace) => {
                return this.jsonToObject(res, poulePlace.getPoule(), poulePlace);
            }),
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

    jsonArrayToObject(jsonArray: IPoulePlace[], poule: Poule): PoulePlace[] {
        const objects: PoulePlace[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObject(json, poule/*, poule.getPlace(json.number)*/);
            objects.push(object);
        }
        return objects;
    }

    jsonToObject(json: IPoulePlace, poule: Poule, poulePlace?: PoulePlace): PoulePlace {
        if (poulePlace === undefined) {
            poulePlace = new PoulePlace(poule, json.number);
        }
        poulePlace.setId(json.id);
        // poule.setName(json.name);
        let team;
        if (json.team) {
            team = this.teamRepos.jsonToObject(json.team, poule.getCompetition().getLeague().getAssociation());
        }
        poulePlace.setTeam(team);
        poulePlace.setPenaltyPoints(json.penaltyPoints);
        return poulePlace;
    }

    objectsToJsonArray(objects: PoulePlace[]): IPoulePlace[] {
        const jsonArray: IPoulePlace[] = [];
        for (const object of objects) {
            jsonArray.push(this.objectToJson(object));
        }
        return jsonArray;
    }

    objectToJson(object: PoulePlace): IPoulePlace {
        return {
            id: object.getId(),
            number: object.getNumber(),
            name: object.getName(),
            team: object.getTeam() ? this.teamRepos.objectToJson(object.getTeam()) : undefined,
            penaltyPoints: object.getPenaltyPoints()
        };
    }
}

export interface IPoulePlace {
    id?: number;
    number: number;
    name: string;
    team?: ITeam;
    penaltyPoints: number;
}
