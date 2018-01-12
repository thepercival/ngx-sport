/**
 * Created by coen on 13-2-17.
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { VoetbalRepository } from '../../repository';
import { ExternalObject } from '../object';
import { ExternalSystem } from '../system';
import { ExternalSystemRepository } from '../system/repository';


/**
 * Created by cdunnink on 7-2-2017.
 */

@Injectable()
export class ExternalObjectRepository extends VoetbalRepository{

    private url : string;

    constructor( private http: Http, private externalSystemRepository: ExternalSystemRepository ) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'external';
    }

    getObjects( importableObjectRepository:any ): Observable<ExternalObject[]>
    {
        let url = this.url + '/'+importableObjectRepository.getUrlpostfix();
        return this.http.get(url, new RequestOptions({ headers: super.getHeaders() }) )
            .map((res) => {
                return this.jsonArrayToObject(res.json(), importableObjectRepository);
            })
            .catch( this.handleError );
    }

    jsonArrayToObject( jsonArray : any, importableObjectRepository: any ): ExternalObject[]
    {
        let externalObjects: ExternalObject[] = [];
        for (let json of jsonArray) {
            externalObjects.push( this.jsonToObjectHelper(json, importableObjectRepository) );
        }
        return externalObjects;
    }

    jsonToObjectHelper( json : any, importableObjectRepository:any ): ExternalObject
    {
        let externalSystem = undefined;
        if (json.externalsystem != undefined ){
            externalSystem = this.externalSystemRepository.jsonToObjectHelper( json.externalsystem );
        }
        let importableObject = undefined;
        if (json.importableobject != undefined ){
            importableObject = importableObjectRepository.jsonToObjectHelper( json.importableobject );
        }
        let externalObject = new ExternalObject(importableObject, externalSystem, json.externalid );
        externalObject.setId(json.id);
        return externalObject;
    }

    createObject( importableObjectRepository:any, object: any, externalid: string, externalSystem: ExternalSystem ): Observable<ExternalObject>
    {
        let json = {"importableobjectid":object.getId(), "externalid":externalid, "externalsystemid":externalSystem.getId()};
        let url = this.url + '/'+importableObjectRepository.getUrlpostfix();
        return this.http
            .post(url, json, new RequestOptions({ headers: super.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json(),importableObjectRepository))
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( urlpostfix:string, object: ExternalObject): Observable<void>
    {
        let url = this.url + '/'+urlpostfix + '/'+object.getId();

        return this.http
            .delete(url, new RequestOptions({ headers: super.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res:Response) => res)
            //...errors if any
            .catch(this.handleError);
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error( res );
        // throw an application level error
        return Observable.throw( res.statusText );
    }

    getExternalObjects(externalobjects: ExternalObject[], importableObject: any): ExternalObject[] {
        if ( externalobjects == undefined){
            return [];
        }
        return externalobjects.filter(
            extobjIt => extobjIt.getImportableObject() == importableObject
        );
    }

    getExternalObject(externalobjects: ExternalObject[], externalsystem: any, externalid: string, importableObject: any): ExternalObject {
        return externalobjects.filter(
            extobjIt => extobjIt.getExternalSystem() == externalsystem
            && ( externalid == undefined || extobjIt.getExternalid() == externalid )
                && (importableObject == undefined || extobjIt.getImportableObject() == importableObject )
        ).shift();
    }
}

