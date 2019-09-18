import { RoundNumber } from '../round/number';

export class PlanningConfig {
    static readonly DEFAULTENABLETIME = false;
    static readonly TEAMUP_MIN = 4;
    static readonly TEAMUP_MAX = 6;
    static readonly DEFAULTNROFHEADTOHEAD = 1;

    protected id: number;
    protected minutesPerGameExt: number;
    protected enableTime: boolean;
    protected minutesPerGame: number;
    protected minutesBetweenGames: number;
    protected minutesAfter: number;
    protected teamup: boolean;
    protected selfReferee: boolean;
    protected nrOfHeadtohead: number;

    constructor(protected roundNumber: RoundNumber) {
        this.roundNumber.setPlanningConfig(this);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    hasExtension(): boolean {
        return this.getMinutesPerGameExt() > 0;
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

    getNrOfHeadtohead(): number {
        return this.nrOfHeadtohead;
    }

    setNrOfHeadtohead(nrOfHeadtohead: number) {
        this.nrOfHeadtohead = nrOfHeadtohead;
    }

    getMaximalNrOfMinutesPerGame(): number {
        return this.getMinutesPerGame() + this.getMinutesPerGameExt();
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }
}

