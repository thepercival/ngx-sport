import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { SportRepository } from '../repository';
import { JsonPoulePlace, PoulePlaceMapper } from './mapper';

@Injectable()
export class PoulePlaceRepository extends SportRepository {

    private url: string;

    constructor(
        private mapper: PoulePlaceMapper,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'pouleplaces';
    }

    editObject(poulePlace: PoulePlace, poule: Poule): Observable<PoulePlace> {
        return this.http.put(this.url + '/' + poulePlace.getId(), this.mapper.toJson(poulePlace), this.getOptions(poule)).pipe(
            map((jsonRes: JsonPoulePlace) => this.mapper.toObject(jsonRes, poulePlace.getPoule(), poulePlace)),
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
}


