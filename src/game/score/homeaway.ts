export class GameScoreHomeAway {

    protected home: number;
    protected away: number;

    // constructor
    constructor(home: number, away: number) {
        this.setHome(home);
        this.setAway(away);
    }

    getHome(): number {
        return this.home;
    }

    setHome(home: number): void {
        this.home = home;
    }

    getAway(): number {
        return this.away;
    }

    setAway(away: number): void {
        this.away = away;
    }
}
