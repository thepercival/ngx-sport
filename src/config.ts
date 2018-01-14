/**
 * Created by coen on 10-10-17.
 */
// import { environment } from '../../src/environments/environment';

export class SportConfig {
    static apiurl = 'http://localhost:2999/'; // environment.apiurl;

    static getToken(): string {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (auth !== undefined && auth.token !== undefined) {
            return auth.token;
        }
        return undefined;
    }
}
