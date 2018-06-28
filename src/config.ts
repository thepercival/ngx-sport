/**
 * Created by coen on 10-10-17.
 */
// import { environment } from '../../src/environments/environment';

export class SportConfig {
    static readonly TableTennis = 'tafeltennis';
    static readonly Football = 'voetbal';
    static readonly Darts = 'darten';
    static readonly Tennis = 'tennis';
    static readonly Volleyball = 'volleybal';
    static readonly Badminton = 'badminton';
    static readonly Squash = 'squash';
    static readonly Hockey = 'hockey';
    static readonly Korfball = 'korfbal';

    static useExternal = false; // environment.useExternal;
    static apiurl = 'http://localhost:2999/'; // environment.apiurl;

    static getToken(): string {
        const localStorageAuth = localStorage.getItem('auth');
        const auth = localStorageAuth !== null ? JSON.parse(localStorageAuth) : undefined;
        if (auth !== undefined && auth.token !== undefined) {
            return auth.token;
        }
        return undefined;
    }

    static getSports(): string[] {
        return [
            SportConfig.TableTennis,
            SportConfig.Football,
            SportConfig.Darts,
            SportConfig.Tennis,
            SportConfig.Volleyball,
            SportConfig.Badminton,
            SportConfig.Squash,
            SportConfig.Hockey,
            SportConfig.Korfball
        ];
    }
}
