/**
 * Created by coen on 16-2-17.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';

import { AssociationRepository, IAssociation } from '../association/repository';
import { CompetitionRepository, ICompetition } from '../competition/repository';
import { Competitionseason } from '../competitionseason';
import { FieldRepository, IField } from '../field/repository';
import { IReferee, RefereeRepository } from '../referee/repository';
import { SportRepository } from '../repository';
import { ISeason, SeasonRepository } from '../season/repository';


@Injectable()
export class CompetitionseasonRepository extends SportRepository {

    private url: string;
    private objects: Competitionseason[];

    constructor(private http: HttpClient,
        private associationRepository: AssociationRepository,
        private competitionRepository: CompetitionRepository,
        private seasonRepository: SeasonRepository,
        private fieldRepository: FieldRepository,
        private refereeRepository: RefereeRepository,
        router: Router
    ) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'competitionseasons';
    }

    getObjects(): Observable<Competitionseason[]> {
        // if (this.objects !== undefined) {
        //     return Observable.create(observer => {
        //         observer.next(this.objects);
        //         observer.complete();
        //     });
        // }

        return this.http.get(this.url, { headers: super.getHeaders() }).pipe(
            map((res: ICompetitionseason[]) => {
                this.objects = this.jsonArrayToObject(res);
                return this.objects;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    getObject(id: number): Observable<Competitionseason> {
        const observable = Observable.create(observer => {
            this.getObjects().subscribe(
                /* happy path */ competitionseasons => {
                    const competitionseason = competitionseasons.filter(
                        competitionseasonsIt => competitionseasonsIt.getId() === id
                    ).shift();
                    observer.next(competitionseason);
                    observer.complete();
                },
                /* error path */ e => { /* @TODO replace with variant of forkjoin */ },
                /* onComplete */() => { }
            );
        });
        return observable;
    }

    createObject(json: ICompetitionseason): Observable<Competitionseason> {
        return this.http.post(this.url, json, { headers: super.getHeaders() }).pipe(
            map((res: ICompetitionseason) => this.jsonToObjectHelper(res)),
            catchError((err) => this.handleError(err))
        );
    }

    editObject(competitionseason: Competitionseason): Observable<Competitionseason> {
        const url = this.url + '/' + competitionseason.getId();

        return this.http.put(url, this.objectToJsonHelper(competitionseason), { headers: super.getHeaders() }).pipe(
            map((res: ICompetitionseason) => this.jsonToObjectHelper(res, competitionseason)),
            catchError((err) => this.handleError(err))
        );
    }

    removeObject(object: Competitionseason): Observable<Competitionseason> {
        const url = this.url + '/' + object.getId();
        return this.http.delete(url, { headers: super.getHeaders() }).pipe(
            map((res: Competitionseason) => res),
            catchError((err) => this.handleError(err))
        );
    }

    jsonArrayToObject(jsonArray: ICompetitionseason[]): Competitionseason[] {
        const competitionseasons: Competitionseason[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json);
            competitionseasons.push(object);
        }
        return competitionseasons;
    }

    jsonToObjectHelper(json: ICompetitionseason, competitionseason?: Competitionseason): Competitionseason {
        // if (this.objects !== undefined) {
        //     const foundObjects = this.objects.filter(
        //         objectIt => objectIt.getId() === json.id
        //     );
        //     if (foundObjects.length === 1) {
        //         return foundObjects.shift();
        //     }
        // }
        if (competitionseason === undefined) {
            const association = this.associationRepository.jsonToObjectHelper(json.association);
            const competition = this.competitionRepository.jsonToObjectHelper(json.competition);
            const season = this.seasonRepository.jsonToObjectHelper(json.season);
            competitionseason = new Competitionseason(association, competition, season);
        }
        competitionseason.setId(json.id);
        competitionseason.setState(json.state);
        competitionseason.setStartDateTime(new Date(json.startDateTime));
        this.fieldRepository.jsonArrayToObject(json.fields, competitionseason);
        this.refereeRepository.jsonArrayToObject(json.referees, competitionseason);
        return competitionseason;
    }

    objectToJsonHelper(object: Competitionseason): ICompetitionseason {
        const json: ICompetitionseason = {
            id: object.getId(),
            association: this.associationRepository.objectToJsonHelper(object.getAssociation()),
            competition: this.competitionRepository.objectToJsonHelper(object.getCompetition()),
            season: this.seasonRepository.objectToJsonHelper(object.getSeason()),
            fields: this.fieldRepository.objectsToJsonArray(object.getFields()),
            referees: this.refereeRepository.objectsToJsonArray(object.getReferees()),
            startDateTime: object.getStartDateTime().toISOString(),
            state: object.getState()
        };
        return json;
    }
}

export interface ICompetitionseason {
    id?: number;
    association: IAssociation;
    competition: ICompetition;
    season: ISeason;
    fields: IField[];
    referees: IReferee[];
    startDateTime: string;
    state: number;
}
