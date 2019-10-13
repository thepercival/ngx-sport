import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError as observableThrowError } from 'rxjs';

import { APIConfig } from './config';

export class APIRepository {

    constructor(protected router: Router) {
    }

    getApiUrl(): string {
        return APIConfig.apiurl;
    }

    getHeaders(): HttpHeaders {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
        headers = headers.append('X-Api-Version', '17');
        const token = APIConfig.getToken();
        if (token !== undefined) {
            headers = headers.append('Authorization', 'Bearer ' + token);
        }
        return headers;
    }

    protected getRouter() {
        return this.router;
    }

    protected handleError(error: HttpErrorResponse): Observable<any> {
        console.log(error);
        let errortext = 'onbekende fout';
        if (!navigator.onLine) {
            errortext = 'er kan geen internet verbinding gemaakt worden';
        } else if (error.status === 0) {
            errortext = 'er kan geen verbinding met de data-service gemaakt worden, ververs de pagina';
        } else if (typeof error.error === 'string') {
            errortext = error.error;
        } else if (error.statusText !== undefined) {
            errortext = error.statusText;
        } else if (error.message !== undefined) {
            errortext = error.message;
        }
        if (error.status === 401) {
            errortext = 'autorisatie fout: ' + error.error.title;
            this.getRouter().navigate([''], { queryParams: { type: 'danger', message: errortext } });
        }

        return observableThrowError(errortext);
    }
}
