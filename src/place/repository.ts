import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../api/repository';
import { Place } from '../place';
import { Poule } from '../poule';
import { JsonPlace, PlaceMapper } from './mapper';

@Injectable()
export class PlaceRepository extends APIRepository {

    private url: string;

    constructor(
        private mapper: PlaceMapper,
        private http: HttpClient,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'places';
    }

    editObject(place: Place, poule: Poule): Observable<Place> {
        return this.http.put(this.url + '/' + place.getId(), this.mapper.toJson(place), this.getOptions(poule)).pipe(
            map((jsonRes: JsonPlace) => this.mapper.toObject(jsonRes, place.getPoule(), place)),
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


