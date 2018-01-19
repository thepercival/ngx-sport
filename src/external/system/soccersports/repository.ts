/**
 * Created by coen on 17-2-17.
 */

import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { SportRepository } from '../../../repository';
import { Association } from '../../../association';
import { Competition } from '../../../competition';
import { Competitionseason } from '../../../competitionseason';
import { Poule } from '../../../poule';
import { PoulePlace } from '../../../pouleplace';
import { Round } from '../../../round';
import { Season } from '../../../season';
import { Team } from '../../../team';
import { ExternalSystemRepository } from '../repository';
import { ExternalSystemSoccerSports } from '../soccersports';


@Injectable()
export class ExternalSystemSoccerSportsRepository extends SportRepository {

    private headers = { 'Content-Type': 'application/json' };
    private asspociationsByCompetitionId: any = {};
    private competitionseasons: Competitionseason[];

    // maak hier een cache voor, omdat er maar weinig api-calls mogelijk zijn
    constructor(
        private http: HttpClient,
        private externalSystem: ExternalSystemSoccerSports,
        private externalSystemRepository: ExternalSystemRepository
    ) {
        super();
    }

    getToken(): string {
        return this.externalSystem.getApikey();
    }

    getCacheName(cachename): string {
        return this.externalSystem.getName().toLowerCase().replace(' ', '') + '-' + cachename;
    }

    getCacheItem(cachename: string): string {
        const valueAsString = localStorage.getItem(this.getCacheName(cachename));
        if (valueAsString === undefined) {
            return undefined;
        }
        const json = JSON.parse(valueAsString);
        if (json.expiredate < (new Date())) {
            localStorage.removeItem(this.getCacheName(cachename));
            return undefined;
        }

        return JSON.parse(json.value);
    }

    setCacheItem(cachename: string, value: string, expireDate: Date): void {
        const json = { 'expiredate': expireDate.toJSON(), 'value': value };
        localStorage.setItem(this.getCacheName(cachename), JSON.stringify(json));
    }

    getHeaders(): HttpHeaders {
        let headers = new HttpHeaders(this.headers);
        if (this.getToken() !== undefined) {
            headers = headers.append('X-Mashape-Key', this.getToken());
        }
        return headers;
    }

    getAssociations(): Observable<Association[]> {
        const cacheName = 'Association';
        const jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects !== undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonAssociationsToArrayHelper(jsonObjects));
                observer.complete();
            });
        }

        const url = this.externalSystem.getApiurl() + 'leagues';
        return this.http.get(url, { headers: this.getHeaders() }).pipe(
            map((res: any) => {
                const json = res;
                const associations = this.jsonAssociationsToArrayHelper(json.data.leagues);
                this.setCacheItem(cacheName, JSON.stringify(json.data.leagues), this.getExpireDate('Association'));
                return associations;
            }),
            catchError( super.handleError )
        );
    }

    // identifier: "8e7fa444c4b60383727fb61fcc6aa387",
    // league_slug: "bundesliga",
    // name: "Bundesliga",
    // nation: "Germany",
    // level: "1"
    // cup: false,
    // federation: "UEFA"

    jsonAssociationsToArrayHelper(jsonArray: any): Association[] {
        const associations: Association[] = [];
        for (const json of jsonArray) {
            const object = this.jsonAssociationToObjectHelper(json);
            const foundObjects = associations.filter(assFilter => assFilter.getId() === object.getId());
            if (foundObjects.length > 0) {
                continue;
            }
            associations.push(object);
        }
        return associations;
    }

    jsonAssociationToObjectHelper(json: any): Association {
        const association = new Association(json.federation);
        association.setId(json.federation);
        return association;
    }

    getExpireDate(className: string): Date {
        const expireDate = new Date();
        // if ( className == Association.classname ){
        //     expireDate.setDate(expireDate.getDate() + 14);
        // }
        // else if ( className == Competition.classname ){
        //     expireDate.setDate(expireDate.getDate() + 14);
        // }
        expireDate.setDate(expireDate.getDate() + 14);


        return expireDate;
    }

    getCompetitions(): Observable<Competition[]> {
        const cacheName = 'Competition';
        const jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects !== undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonCompetitionsToArrayHelper(jsonObjects));
                observer.complete();
            });
        }

        const url = this.externalSystem.getApiurl() + 'leagues';
        return this.http.get(url, { headers: this.getHeaders() }).pipe(
            map((res: any) => {
                const json = res.data;
                const objects = this.jsonCompetitionsToArrayHelper(json.leagues);
                this.setCacheItem(cacheName, JSON.stringify(json.leagues), this.getExpireDate('Competition'));
                return objects;
            }),
            catchError( super.handleError )
        );
    }

    jsonCompetitionsToArrayHelper(jsonArray: any): Competition[] {
        const competitions: Competition[] = [];
        for (const json of jsonArray) {
            const object = this.jsonCompetitionToObjectHelper(json);
            competitions.push(object);
        }
        return competitions;
    }

    jsonCompetitionToObjectHelper(json: any): Competition {
        // identifier: "8e7fa444c4b60383727fb61fcc6aa387",
        // league_slug: "bundesliga",
        // name: "Bundesliga",
        // nation: "Germany",
        // level: "1"
        // cup: false,
        // federation: "UEFA"

        const competition = new Competition(json.name);
        competition.setId(json.league_slug);
        competition.setAbbreviation(competition.getName().substr(0, Competition.MAX_LENGTH_ABBREVIATION));
        this.setAsspociationByCompetitionId(competition.getId(), this.jsonAssociationToObjectHelper(json));

        return competition;
    }

    getSeasons(): Observable<Season[]> {
        const cacheName = 'Season';
        const jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects !== undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonSeasonsToArrayHelper(jsonObjects));
                observer.complete();
            });
        }

        const url = this.externalSystem.getApiurl() + 'leagues' + '/premier-league/seasons';
        return this.http.get(url, { headers: this.getHeaders() }).pipe(
            map((res: any) => {
                const json = res.data;
                const objects = this.jsonSeasonsToArrayHelper(json.seasons);
                this.setCacheItem(cacheName, JSON.stringify(json.seasons), this.getExpireDate('Season'));
                return objects;
            }),
            catchError( super.handleError )
        );
    }

    jsonSeasonsToArrayHelper(jsonArray: any): Season[] {
        const seasons: Season[] = [];
        for (const json of jsonArray) {
            const object = this.jsonSeasonToObjectHelper(json);
            const foundObjects = seasons.filter(seasonFilter => seasonFilter.getId() === object.getId());
            if (foundObjects.length > 0) {
                continue;
            }
            seasons.push(object);
        }
        return seasons;
    }

    jsonSeasonToObjectHelper(json: any): Season {
        // "identifier": "ef5f67b10885e37c43bccb02c70b6e1d",
        // "league_identifier": "726a53a8c50d6c7a66fe0ab16bdf9bb1",
        // "season_slug": "15-16",
        // "name": "2015-2016",
        // "season_start": "2015-07-01T00:00:00+0200",
        // "season_end": "2016-06-30T00:00:00+0200"

        const season = new Season(json.name);
        season.setId(json.season_slug);
        const startDate = new Date(json.season_start);
        if (startDate === undefined) {
            throw new Error('het geimporteerde seizoen heeft geen startdatum');
        }
        season.setStartDateTime(startDate);
        const endDate = new Date(json.season_end);
        if (endDate === undefined) {
            throw new Error('het geimporteerde seizoen heeft geen einddatum');
        }
        season.setEndDateTime(endDate);

        return season;
    }

    getCompetitionseasons(): Observable<Competitionseason[]> {
        const cacheName = 'Competitionseason';
        const jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects !== undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonSeasonsToArrayHelper(jsonObjects));
                observer.complete();
            });
        }

        const competitionseasons = [];

        return Observable.create(observer => {

            const competitionsObservable: Observable<Competition[]> = this.getCompetitions();

            competitionsObservable.forEach(externalcompetitions => {
                for (const externalcompetition of externalcompetitions) {

                    if (externalcompetition.getId().toString() !== 'premier-league'
                        && externalcompetition.getId().toString() !== 'eredivisie') {
                        continue;
                    }

                    const observableCompetitionseasonsTmp = this.getCompetitionseasonsHelper(externalcompetition);
                    observableCompetitionseasonsTmp.forEach(competitionseasonsIt => {
                        for (const competitionseasonIt of competitionseasonsIt) {
                            competitionseasons.push(competitionseasonIt);
                        }
                        observer.next(competitionseasonsIt);
                    });
                }
            });

            setTimeout(() => {
                observer.complete();
            }, 5000);

        });
    }

    getCompetitionseasonsHelper(externalcompetition: Competition): Observable<Competitionseason[]> {
        const cacheName = 'Competitionseason' + '-' + 'Competition' + '-' + externalcompetition.getId();
        const jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects !== undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonCompetitionseasonsToArrayHelper(jsonObjects, externalcompetition));
                observer.complete();
            });
        }

        const url = this.externalSystem.getApiurl() + 'leagues/' + externalcompetition.getId() + '/seasons';
        return this.http.get(url, { headers: this.getHeaders() }).pipe(
            map((res: any) => {
                const json = res.data;
                const objects = this.jsonCompetitionseasonsToArrayHelper(json.seasons, externalcompetition);
                this.setCacheItem(cacheName, JSON.stringify(json.seasons), this.getExpireDate('Competitionseason'));
                return objects;
            }),
            catchError( super.handleError )
        );
    }

    jsonCompetitionseasonsToArrayHelper(jsonArray: any, externalcompetition: Competition): Competitionseason[] {
        const competitionseasons: Competitionseason[] = [];
        for (const json of jsonArray) {
            const object = this.jsonCompetitionseasonToObjectHelper(json, externalcompetition);
            competitionseasons.push(object);
        }
        return competitionseasons;
    }

    jsonCompetitionseasonToObjectHelper(json: any, competition: Competition): Competitionseason {
        // "identifier": "ef5f67b10885e37c43bccb02c70b6e1d",
        // "league_identifier": "726a53a8c50d6c7a66fe0ab16bdf9bb1",
        // "season_slug": "15-16",
        // "name": "2015-2016",
        // "season_start": "2015-07-01T00:00:00+0200",
        // "season_end": "2016-06-30T00:00:00+0200"

        const season: Season = this.jsonSeasonToObjectHelper(json);
        const association = this.getAsspociationByCompetitionId(competition.getId());
        // console.log(association);
        const competitionseason = new Competitionseason(association, competition, season);
        // competitionseason.setId(association.getId().toString() + '_' + competition.getId().toString() + '_' + season.getId().toString());

        return competitionseason;
    }

    getTeams(competitionseason: Competitionseason): Observable<Team[]> {
        const cacheName = 'Team' + '-' + 'Competitionseason' + '-' + competitionseason.getId();
        const jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects !== undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonTeamsToArrayHelper(jsonObjects, competitionseason.getCompetition()));
                observer.complete();
            });
        }

        const url = this.externalSystem.getApiurl() + 'leagues' + '/' + competitionseason.getCompetition().getId()
            + '/seasons/' + competitionseason.getSeason().getId() + '/teams';
        return this.http.get(url, { headers: this.getHeaders() }).pipe(
            map((res: any) => {
                const json = res.data;
                const objects = this.jsonTeamsToArrayHelper(json.teams, competitionseason.getCompetition());
                this.setCacheItem(cacheName, JSON.stringify(json.teams), this.getExpireDate('Team'));
                return objects;
            }),
            catchError( super.handleError )
        );
    }

    jsonTeamsToArrayHelper(jsonArray: any, competition: Competition): Team[] {
        const objects: Team[] = [];
        for (const json of jsonArray) {
            const object = this.jsonTeamToObjectHelper(json, competition);
            const foundObjects = objects.filter(objFilter => objFilter.getId() === object.getId());
            if (foundObjects.length > 0) {
                continue;
            }
            objects.push(object);
        }
        return objects;
    }

    jsonTeamToObjectHelper(json: any, competition: Competition): Team {
        // "identifier": "r4xhp8c6tpedhrd9v14valjgye847oa5",
        // "team_slug": "ado",
        // "name": "ADO",
        // "flag": "",
        // "notes": ""

        const association = this.getAsspociationByCompetitionId(competition.getId());
        const team = new Team(association, json.name);
        team.setId(json.team_slug);
        return team;
    }

    getStructure(competitionseason: Competitionseason): Observable<Round[]> {
        return Observable.create(observer => {

            const rounds: Round[] = [];
            const firstroundNumber = 1;
            const round = new Round(competitionseason, null, Round.WINNERS);
            {
                round.setId(firstroundNumber);
                // @TODO CALCULATE WITH NROFTEAMS AND NROFGAMEROUNDS
                // round.setNrofheadtoheadmatches(2);

                const firstpouleNumber = 1;
                const poule = new Poule(round, firstpouleNumber);
                {
                    poule.setId(firstpouleNumber);
                    this.getTeams(competitionseason)
                        .subscribe(
                            /* happy path */ teams => {
                            for (const team of teams) {
                                const pouleplace = new PoulePlace(poule);
                                pouleplace.setId(pouleplace.getNumber());
                                pouleplace.setTeam(team);
                            }
                        },
                            /* error path */ e => { },
                            /* onComplete */() => { }
                        );
                }

                rounds.push(round);
            }

            observer.next(rounds);
            observer.complete();
        });
    }

    getAsspociationByCompetitionId(competitionId) {
        return this.asspociationsByCompetitionId[competitionId];
    }
    setAsspociationByCompetitionId(competitionId, association) {
        this.asspociationsByCompetitionId[competitionId] = association;
    }


    // this could also be a private method of the component class
    handleError(error: any): Observable<any> {
        let message;
        if (error && error.message !== undefined) {
            message = error.message;
        } else if (error && error.statusText !== undefined) {
            message = error.statusText;
        }
        // throw an application level error
        return Observable.throw(message);
    }
}

