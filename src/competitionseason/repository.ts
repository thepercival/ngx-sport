/**
 * Created by coen on 16-2-17.
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AssociationRepository, IAssociation } from '../association/repository';
import { CompetitionRepository, ICompetition } from '../competition/repository';
import { Competitionseason } from '../competitionseason';
import { FieldRepository, IField } from '../field/repository';
import { IReferee, RefereeRepository } from '../referee/repository';
import { VoetbalRepository } from '../repository';
import { ISeason, SeasonRepository } from '../season/repository';


@Injectable()
export class CompetitionseasonRepository extends VoetbalRepository {

    private url: string;
    private objects: Competitionseason[];

    constructor(private http: HttpClient,
        private associationRepository: AssociationRepository,
        private competitionRepository: CompetitionRepository,
        private seasonRepository: SeasonRepository,
        private fieldRepository: FieldRepository,
        private refereeRepository: RefereeRepository
    ) {
        super();
        this.http = http;
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'competitionseasons';
    }

    getObjects(): Observable<Competitionseason[]> {
        if (this.objects !== undefined) {
            return Observable.create(observer => {
                observer.next(this.objects);
                observer.complete();
            });
        }

        return this.http.get(this.url, { headers: super.getHeaders() })
            .map((res: ICompetitionseason[]) => {
                this.objects = this.jsonArrayToObject(res);
                return this.objects;
            })
            .catch(this.handleError);
    }

    jsonArrayToObject(jsonArray: ICompetitionseason[]): Competitionseason[] {
        const competitionseasons: Competitionseason[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json);
            competitionseasons.push(object);
        }
        return competitionseasons;
    }

    getObject(id: number): Observable<Competitionseason> {
        // console.log('id',id);
        const observable = Observable.create(observer => {
            this.getObjects().subscribe(
                /* happy path */ competitionseasons => {
                    const competitionseason = competitionseasons.filter(
                        competitionseasonsIt => competitionseasonsIt.getId() === id
                    ).shift();
                    observer.next(competitionseason);
                    observer.complete();
                },
                /* error path */ e => { this.handleError(e); },
                /* onComplete */() => { }
            );
        });
        return observable;
    }

    jsonToObjectHelper(json: ICompetitionseason): Competitionseason {
        if (this.objects !== undefined) {
            const foundObjects = this.objects.filter(
                objectIt => objectIt.getId() === json.id
            );
            if (foundObjects.length === 1) {
                return foundObjects.shift();
            }
        }

        const association = this.associationRepository.jsonToObjectHelper(json.association);
        const competition = this.competitionRepository.jsonToObjectHelper(json.competition);
        const season = this.seasonRepository.jsonToObjectHelper(json.season);

        const competitionseason = new Competitionseason(association, competition, season);
        competitionseason.setId(json.id);
        competitionseason.setState(json.state);
        competitionseason.setSport(json.sport);
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
            sport: object.getSport(),
            startDateTime: object.getStartDateTime().toISOString(),
            state: object.getState()
        };
        return json;
    }

    createObject(jsonObject: ICompetitionseason): Observable<Competitionseason> {
        return this.http
            .post(this.url, jsonObject, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: ICompetitionseason) => this.jsonToObjectHelper(res))
            .catch(this.handleError);
    }

    editObject(object: Competitionseason): Observable<Competitionseason> {
        const url = this.url + '/' + object.getId();

        return this.http
            .put(url, JSON.stringify(object), { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: ICompetitionseason) => { console.log(res); return this.jsonToObjectHelper(res); })
            .catch(this.handleError);
    }

    removeObject(object: Competitionseason): Observable<void> {
        const url = this.url + '/' + object.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: Response) => res)
            .catch(this.handleError);
    }
}

export interface ICompetitionseason {
    id?: number;
    association: IAssociation;
    competition: ICompetition;
    season: ISeason;
    fields: IField[];
    referees: IReferee[];
    sport: string;
    startDateTime: string;
    state: number;
}
