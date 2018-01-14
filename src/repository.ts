import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

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

    handleError(res: HttpErrorResponse): Observable<any> {
        let errortext = 'onbekende fout';
        if (typeof res.error === 'string') {
            errortext = res.error;
        }
        if (res.status === 401) {
            errortext = 'je bent niet ingelogd';
        }
        console.error(res);
        return Observable.throw(errortext);
    }
}
