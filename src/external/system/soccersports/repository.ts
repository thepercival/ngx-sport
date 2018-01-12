/**
 * Created by coen on 17-2-17.
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

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
export class ExternalSystemSoccerSportsRepository {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private asspociationsByCompetitionId: any = {};
    private competitionseasons: Competitionseason[];

    // maak hier een cache voor, omdat er maar weinig api-calls mogelijk zijn
    constructor(
        private http: Http,
        private externalSystem: ExternalSystemSoccerSports,
        private externalSystemRepository: ExternalSystemRepository
    ) {
        console.log('constructor ExternalSystemSoccerSportsRepository');
    }

    getToken(): string {
        return this.externalSystem.getApikey();
    }

    getCacheName(cachename): string {
        return this.externalSystem.getName().toLowerCase().replace(" ", "") + '-' + cachename;
    }

    getCacheItem(cachename: string): string {
        let valueAsString = localStorage.getItem(this.getCacheName(cachename));
        if (valueAsString == undefined) {
            return undefined;
        }
        let json = JSON.parse(valueAsString);
        if (json.expiredate < (new Date())) {
            localStorage.removeItem(this.getCacheName(cachename));
            return undefined;
        }

        return JSON.parse(json.value);
    }

    setCacheItem(cachename: string, value: string, expireDate: Date): void {
        let json = { "expiredate": expireDate.toJSON(), "value": value };
        localStorage.setItem(this.getCacheName(cachename), JSON.stringify(json));
    }

    getHeaders(): Headers {
        let headers = new Headers(this.headers);
        if (this.getToken() != undefined) {
            headers = headers.append('X-Mashape-Key', this.getToken());
        }
        return headers;
    }

    getAssociations(): Observable<Association[]> {
        let cacheName = Association.classname;
        let jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects != undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonAssociationsToArrayHelper(jsonObjects));
                observer.complete();
            });
        }

        let url = this.externalSystem.getApiurl() + 'leagues';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }))
            .map((res) => {
                let json = res.json().data;
                let associations = this.jsonAssociationsToArrayHelper(json.leagues)
                this.setCacheItem(cacheName, JSON.stringify(json.leagues), this.getExpireDate(Association.classname));
                return associations;
            })
            .catch(this.handleError);
    }

    // identifier: "8e7fa444c4b60383727fb61fcc6aa387",
    // league_slug: "bundesliga",
    // name: "Bundesliga",
    // nation: "Germany",
    // level: "1"
    // cup: false,
    // federation: "UEFA"

    jsonAssociationsToArrayHelper(jsonArray: any): Association[] {
        let associations: Association[] = [];
        for (let json of jsonArray) {
            let object = this.jsonAssociationToObjectHelper(json);
            let foundObjects = associations.filter(assFilter => assFilter.getId() == object.getId());
            if (foundObjects.length > 0) {
                continue;
            }
            associations.push(object);
        }
        return associations;
    }

    jsonAssociationToObjectHelper(json: any): Association {
        let association = new Association(json.federation);
        association.setId(json.federation);
        return association;
    }

    getExpireDate(className: string): Date {
        let expireDate = new Date();
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
        let cacheName = Competition.classname;
        let jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects != undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonCompetitionsToArrayHelper(jsonObjects));
                observer.complete();
            });
        }

        let url = this.externalSystem.getApiurl() + 'leagues';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }))
            .map((res) => {
                let json = res.json().data;
                let objects = this.jsonCompetitionsToArrayHelper(json.leagues)
                this.setCacheItem(cacheName, JSON.stringify(json.leagues), this.getExpireDate(Competition.classname));
                return objects;
            })
            .catch(this.handleError);
    }

    jsonCompetitionsToArrayHelper(jsonArray: any): Competition[] {
        let competitions: Competition[] = [];
        for (let json of jsonArray) {
            let object = this.jsonCompetitionToObjectHelper(json);
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

        let competition = new Competition(json.name);
        competition.setId(json.league_slug);
        competition.setAbbreviation(competition.getName().substr(0, Competition.MAX_LENGTH_ABBREVIATION));
        this.setAsspociationByCompetitionId(competition.getId(), this.jsonAssociationToObjectHelper(json));

        return competition;
    }

    getSeasons(): Observable<Season[]> {
        let cacheName = Season.classname;
        let jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects != undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonSeasonsToArrayHelper(jsonObjects));
                observer.complete();
            });
        }

        let url = this.externalSystem.getApiurl() + 'leagues' + '/premier-league/seasons';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }))
            .map((res) => {
                let json = res.json().data;
                let objects = this.jsonSeasonsToArrayHelper(json.seasons)
                this.setCacheItem(cacheName, JSON.stringify(json.seasons), this.getExpireDate(Season.classname));
                return objects;
            })
            .catch(this.handleError);
    }

    jsonSeasonsToArrayHelper(jsonArray: any): Season[] {
        let seasons: Season[] = [];
        for (let json of jsonArray) {
            let object = this.jsonSeasonToObjectHelper(json);
            let foundObjects = seasons.filter(seasonFilter => seasonFilter.getId() == object.getId());
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

        let season = new Season(json.name);
        season.setId(json.season_slug);
        let startDate = new Date(json.season_start);
        if (startDate == undefined) {
            throw new Error("het geimporteerde seizoen heeft geen startdatum");
        }
        season.setStartdate(startDate);
        let endDate = new Date(json.season_end);
        if (endDate == undefined) {
            throw new Error("het geimporteerde seizoen heeft geen einddatum");
        }
        season.setEnddate(endDate);

        return season;
    }

    getCompetitionseasons(): Observable<Competitionseason[]> {
        let cacheName = Competitionseason.classname;
        let jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects != undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonSeasonsToArrayHelper(jsonObjects));
                observer.complete();
            });
        }

        let competitionseasons = [];

        return Observable.create(observer => {

            let competitionsObservable: Observable<Competition[]> = this.getCompetitions();

            competitionsObservable.forEach(externalcompetitions => {
                for (let externalcompetition of externalcompetitions) {

                    if (externalcompetition.getId().toString() != 'premier-league' && externalcompetition.getId().toString() != 'eredivisie') {
                        continue;
                    }

                    let observableCompetitionseasonsTmp = this.getCompetitionseasonsHelper(externalcompetition);
                    observableCompetitionseasonsTmp.forEach(competitionseasonsIt => {
                        for (let competitionseasonIt of competitionseasonsIt) {
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
        let cacheName = Competitionseason.classname + '-' + Competition.classname + '-' + externalcompetition.getId();
        let jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects != undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonCompetitionseasonsToArrayHelper(jsonObjects, externalcompetition));
                observer.complete();
            });
        }

        let url = this.externalSystem.getApiurl() + 'leagues/' + externalcompetition.getId() + '/seasons';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }))
            .map((res: Response) => {
                let json = res.json().data;
                let objects = this.jsonCompetitionseasonsToArrayHelper(json.seasons, externalcompetition)
                this.setCacheItem(cacheName, JSON.stringify(json.seasons), this.getExpireDate(Competitionseason.classname));
                return objects;
            })
            .catch(this.handleError);
    }

    jsonCompetitionseasonsToArrayHelper(jsonArray: any, externalcompetition: Competition): Competitionseason[] {
        let competitionseasons: Competitionseason[] = [];
        for (let json of jsonArray) {
            let object = this.jsonCompetitionseasonToObjectHelper(json, externalcompetition);
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

        let season: Season = this.jsonSeasonToObjectHelper(json);
        let association = this.getAsspociationByCompetitionId(competition.getId());
        // console.log(association);
        let competitionseason = new Competitionseason(association, competition, season);
        competitionseason.setId(association.getId().toString() + '_' + competition.getId().toString() + '_' + season.getId().toString());

        return competitionseason;
    }

    getTeams(competitionseason: Competitionseason): Observable<Team[]> {
        let cacheName = Team.classname + '-' + Competitionseason.classname + '-' + competitionseason.getId();
        let jsonObjects = this.getCacheItem(cacheName);
        if (jsonObjects != undefined) {
            return Observable.create(observer => {
                observer.next(this.jsonTeamsToArrayHelper(jsonObjects, competitionseason.getCompetition()));
                observer.complete();
            });
        }

        let url = this.externalSystem.getApiurl() + 'leagues' + '/' + competitionseason.getCompetition().getId() + '/seasons/' + competitionseason.getSeason().getId() + '/teams';
        return this.http.get(url, new RequestOptions({ headers: this.getHeaders() }))
            .map((res) => {
                let json = res.json().data;
                let objects = this.jsonTeamsToArrayHelper(json.teams, competitionseason.getCompetition());
                this.setCacheItem(cacheName, JSON.stringify(json.teams), this.getExpireDate(Team.classname));
                return objects;
            })
            .catch(this.handleError);
    }

    jsonTeamsToArrayHelper(jsonArray: any, competition: Competition): Team[] {
        let objects: Team[] = [];
        for (let json of jsonArray) {
            let object = this.jsonTeamToObjectHelper(json, competition);
            let foundObjects = objects.filter(objFilter => objFilter.getId() == object.getId());
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

        let team = new Team(json.name);
        team.setId(json.team_slug);
        team.setAssociation(this.getAsspociationByCompetitionId(competition.getId()));
        return team;
    }

    getStructure(competitionseason: Competitionseason): Observable<Round[]> {
        return Observable.create(observer => {

            let rounds: Round[] = [];
            let firstroundNumber: number = 1;
            let round = new Round(competitionseason, firstroundNumber);
            {
                round.setId(firstroundNumber);
                // @TODO CALCULATE WITH NROFTEAMS AND NROFGAMEROUNDS
                round.setNrofheadtoheadmatches(2);

                let firstpouleNumber: number = 1;
                let poule = new Poule(round, firstpouleNumber);
                {
                    poule.setId(firstpouleNumber);
                    this.getTeams(competitionseason)
                        .subscribe(
                            /* happy path */ teams => {
                            for (let team of teams) {
                                let pouleplace = new PoulePlace(poule);
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
        console.log(error);
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

