
export class APIConfig {
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
}
