
export class APIConfig {
    /*static readonly Badminton = 'badminton';
    static readonly Basketball = 'basketbal';
    static readonly Chess = 'schaken';
    static readonly Darts = 'darten';
    static readonly ESports = 'e-sporten';
    static readonly Football = 'voetbal';
    static readonly Hockey = 'hockey';
    static readonly Korfball = 'korfbal';
    static readonly Squash = 'squash';
    static readonly TableTennis = 'tafeltennis';
    static readonly Tennis = 'tennis';
    static readonly Volleyball = 'volleybal';
    // mayb eother types of tournaments, like ladders

    let unitName = 'punten', parentUnitName;
        if (sport === SportConfig.Darts) {
            unitName = 'legs';
            parentUnitName = 'sets';
        } else if (sport === SportConfig.Tennis) {
            unitName = 'games';
            parentUnitName = 'sets';
        } else if (sport === SportConfig.Squash || sport === SportConfig.TableTennis
            || sport === SportConfig.Volleyball || sport === SportConfig.Badminton) {
            parentUnitName = 'sets';
        } else if (sport === SportConfig.Football || sport === SportConfig.Hockey) {
            unitName = 'goals';
        }*/

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

    /*static getSports(): string[] {
        return [
            SportConfig.Basketball,
            SportConfig.Badminton,
            SportConfig.Chess,
            SportConfig.Darts,
            SportConfig.ESports,
            SportConfig.Football,
            SportConfig.Hockey,
            SportConfig.Korfball,
            SportConfig.Squash,
            SportConfig.TableTennis,
            SportConfig.Tennis,
            SportConfig.Volleyball,
        ];
    }*/
}
