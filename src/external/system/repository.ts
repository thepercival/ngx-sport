/**
 * Created by cdunnink on 7-2-2017.
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { VoetbalRepository } from '../../repository';
import { ExternalSystem } from '../system';
import { ExternalSystemSoccerOdds } from './soccerodds';
import { ExternalSystemSoccerSports } from './soccersports';


@Injectable()
export class ExternalSystemRepository extends VoetbalRepository {

    private url: string;
    private http: Http;
    private objects: ExternalSystem[];
    private specificObjects: ExternalSystem[] = [];

    constructor(http: Http) {
        this.http = http; super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'external/systems';
    }

    getObjects(): Observable<ExternalSystem[]> {

        if (this.objects !== undefined) {
            return Observable.create(observer => {
                observer.next(this.objects);
                observer.complete();
            });
        }
        return this.http.get(this.url, new RequestOptions({ headers: super.getHeaders() }))
            .map((res) => {
                const objects = this.jsonArrayToObject(res.json());
                this.objects = objects;
                return this.objects;
            })
            .catch(this.handleError);
    }

    jsonArrayToObject(jsonArray: any): ExternalSystem[] {
        const objects: ExternalSystem[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json);
            objects.push(object);
        }
        return objects;
    }

    getObject(id: number): Observable<ExternalSystem> {
        const url = this.url + '/' + id;
        return this.http.get(url)
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            .catch((error: any) => Observable.throw(error.message || 'Server error'));
    }

    jsonToObjectHelper(json: any): ExternalSystem {
        const externalSystem = this.getObjectByName(json.name);
        if (externalSystem == undefined) {
            return externalSystem;
        }
        externalSystem.setId(json.id);
        externalSystem.setWebsite(json.website);
        externalSystem.setUsername(json.username);
        externalSystem.setPassword(json.password);
        externalSystem.setApiurl(json.apiurl);
        externalSystem.setApikey(json.apikey);
        return externalSystem;
    }

    private getObjectByName(name: string): ExternalSystem {
        const foundObjects = this.specificObjects.filter(objectFilter => objectFilter.getName() == name);
        const foundObject = foundObjects.shift();
        if (foundObject) {
            return foundObject;
        }
        let externalSystem;
        if (name === 'Soccer Odds') {
            externalSystem = new ExternalSystemSoccerOdds(name, this.http, this);
        } else if (name === 'Soccer Sports') {
            externalSystem = new ExternalSystemSoccerSports(name, this.http, this);
        } else {
            externalSystem = new ExternalSystem(name);
        }
        if (externalSystem != undefined) {
            this.specificObjects.push(externalSystem);
        }
        return externalSystem;
    }

    createObject(jsonObject: any): Observable<ExternalSystem> {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: super.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            .catch(this.handleError);
    }

    editObject(object: ExternalSystem): Observable<ExternalSystem> {
        const url = this.url + '/' + object.getId();
        // console.log(JSON.stringify( object ));
        console.log(this.objectToJsonHelper(object));

        // return Observable.throw( "wat gaat er fout?" );

        return this.http
            .put(url, JSON.stringify(this.objectToJsonHelper(object)), new RequestOptions({ headers: super.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json()))
            .catch(this.handleError);
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: ExternalSystem): any {
        return {
            id: object.getId(),
            name: object.getName(),
            website: object.getWebsite(),
            username: object.getUsername(),
            password: object.getPassword(),
            apiurl: object.getApiurl(),
            apikey: object.getApikey()
        };
    }

    removeObject(object: ExternalSystem): Observable<void> {
        const url = this.url + '/' + object.getId();
        return this.http
            .delete(url, new RequestOptions({ headers: super.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res: Response) => res)
            .catch(this.handleError);
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error(res);
        // throw an application level error
        return Observable.throw(res.statusText);
    }
}
