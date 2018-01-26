import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { SportConfig } from './config';

/**
 * Created by coen on 10-10-17.
 */
export class SportRepository {

    constructor() {
    }

    getApiUrl(): string {
        return SportConfig.apiurl;
    }

    getHeaders(): HttpHeaders {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
        const token = SportConfig.getToken();
        if (token !== undefined) {
            headers = headers.append('Authorization', 'Bearer ' + token);
        }
        return headers;
    }

    handleError(error: HttpErrorResponse): Observable<any> {
        let errortext = 'onbekende fout';
        console.log(error);
        if (typeof error.error === 'string') {
            errortext = error.error;
        }
        else if (error.statusText !== undefined) {
            errortext = error.statusText;
        }
        if (error.status === 401) {
            errortext = 'je bent niet ingelogd';
        }
        return Observable.throw(errortext);
    }
}
