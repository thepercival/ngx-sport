import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError as observableThrowError } from 'rxjs';

import { SportConfig } from './config';



/**
 * Created by coen on 10-10-17.
 */
export class SportRepository {

    protected cacheTimeOutForGetObjects = 3; // minutes
    protected cache = {};
    protected router: Router;
    constructor(router: Router) {
        this.router = router;
    }

    getApiUrl(): string {
        return SportConfig.apiurl;
    }

    getHeaders(): HttpHeaders {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
        headers = headers.append('X-Api-Version', '2');
        const token = SportConfig.getToken();
        if (token !== undefined) {
            headers = headers.append('Authorization', 'Bearer ' + token);
        }
        return headers;
    }

    protected getRouter() {
        return this.router;
    }

    protected handleError(error: HttpErrorResponse): Observable<any> {
        let errortext = 'onbekende fout';
        if (!navigator.onLine) {
            errortext = 'er kan geen internet verbinding gemaakt worden';
        } else if (error.status === 0) {
            errortext = 'er kan verbinding met de data-service gemaakt worden';
        } else if (typeof error.error === 'string') {
            errortext = error.error;
        } else if (error.statusText !== undefined) {
            errortext = error.statusText;
        } else if (error.message !== undefined) {
            errortext = error.message;
        }
        if (error.status === 401) {
            this.getRouter().navigate(['/user/login'], { queryParams: { message: 'log opnieuw in' } });
        }

        return observableThrowError(errortext);
    }
}
