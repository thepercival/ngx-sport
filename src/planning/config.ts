import { RoundNumber } from '../round/number';

export class PlanningConfig {
    static readonly Default_Extension = false;
    static readonly Default_EnableTime = true;
    static readonly Default_Teamup = false;
    static readonly Teamup_Min = 4;
    static readonly Teamup_Max = 6;
    static readonly Default_NrOfHeadtohead = 1;
    static readonly Default_MinutesAfter = 5;
    static readonly Default_MinutesPerGame = 20;
    static readonly Default_MinutesPerGameExt = 5;
    static readonly Default_MinutesBetweenGames = 5;
    static readonly SelfReferee_Disabled = 0;
    static readonly SelfReferee_Poule_Other = 1;
    static readonly SelfReferee_Poule_Same = 2;

    protected id: number = 0;
    protected extension: boolean = PlanningConfig.Default_Extension;
    protected enableTime: boolean = PlanningConfig.Default_EnableTime;
    protected minutesPerGame: number = PlanningConfig.Default_MinutesPerGame;
    protected minutesPerGameExt: number = 0;
    protected minutesBetweenGames: number = 0;
    protected minutesAfter: number = PlanningConfig.Default_MinutesAfter;
    protected teamup: boolean = PlanningConfig.Default_Teamup;
    protected selfReferee: number = PlanningConfig.SelfReferee_Disabled;
    protected nrOfHeadtohead: number = PlanningConfig.Default_NrOfHeadtohead;

    constructor(protected roundNumber: RoundNumber) {
        this.roundNumber.setPlanningConfig(this);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getExtension(): boolean {
        return this.extension;
    }

    setExtension(extension: boolean) {
        this.extension = extension;
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

    getMinutesPerGameExt(): number {
        return this.minutesPerGameExt;
    }

    setMinutesPerGameExt(minutesPerGameExt: number) {
        this.minutesPerGameExt = minutesPerGameExt;
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

    getSelfReferee(): number {
        return this.selfReferee;
    }

    setSelfReferee(selfReferee: number) {
        this.selfReferee = selfReferee;
    }

    selfRefereeEnabled(): boolean {
        return this.selfReferee !== PlanningConfig.SelfReferee_Disabled;
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

