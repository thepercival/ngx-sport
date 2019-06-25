import { RoundNumber } from '../round/number';

export class PlanningConfig {

    static readonly DEFAULTNROFHEADTOHEADMATCHES = 1;
    static readonly DEFAULTHASEXTENSION = false;
    static readonly DEFAULTENABLETIME = false;
    static readonly TEAMUP_MIN = 4;
    static readonly TEAMUP_MAX = 6;

    protected id: number;
    protected nrOfHeadtoheadMatches: number;
    protected hasExtension: boolean;
    protected minutesPerGameExt: number;
    protected enableTime: boolean;
    protected minutesPerGame: number;
    protected minutesBetweenGames: number;
    protected minutesAfter: number;
    protected teamup: boolean;
    protected selfReferee: boolean;

    constructor(protected roundNumber: RoundNumber) {
        this.roundNumber.setPlanningConfig(this);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getNrOfHeadtoheadMatches(): number {
        return this.nrOfHeadtoheadMatches;
    }

    setNrOfHeadtoheadMatches(nrOfHeadtoheadMatches: number) {
        this.nrOfHeadtoheadMatches = nrOfHeadtoheadMatches;
    }

    getHasExtension(): boolean {
        return this.hasExtension;
    }

    setHasExtension(hasExtension: boolean) {
        this.hasExtension = hasExtension;
    }

    getMinutesPerGameExt(): number {
        return this.minutesPerGameExt;
    }

    setMinutesPerGameExt(minutesPerGameExt: number) {
        this.minutesPerGameExt = minutesPerGameExt;
    }

    getEnableTime(): boolean {
        return this.enableTime;
    }

    setEnableTime(enableTime: boolean) {
        this.enableTime = enableTime;
    }

    getMinutesPerGame(): number {
        return this.minutesPerGame;
    }

    setMinutesPerGame(minutesPerGame: number) {
        this.minutesPerGame = minutesPerGame;
    }

    getMinutesBetweenGames(): number {
        return this.minutesBetweenGames;
    }

    setMinutesBetweenGames(minutesBetweenGames: number) {
        this.minutesBetweenGames = minutesBetweenGames;
    }

    getMinutesAfter(): number {
        return this.minutesAfter;
    }

    setMinutesAfter(minutesAfter: number) {
        this.minutesAfter = minutesAfter;
    }

    getTeamup(): boolean {
        return this.teamup;
    }

    setTeamup(teamup: boolean) {
        this.teamup = teamup;
    }

    getSelfReferee(): boolean {
        return this.selfReferee;
    }

    setSelfReferee(selfReferee: boolean) {
        this.selfReferee = selfReferee;
    }

    getMaximalNrOfMinutesPerGame(): number {
        let nrOfMinutes = this.getMinutesPerGame();
        if (this.getHasExtension()) {
            nrOfMinutes += this.getMinutesPerGameExt();
        }
        return nrOfMinutes;
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }

    getNrOfCompetitorsPerGame(): number {
        return this.getTeamup() ? 4 : 2;
    }
}

