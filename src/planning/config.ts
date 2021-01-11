import { Identifiable } from 'src/identifiable';
import { Sport } from 'src/sport';
import { RoundNumber } from '../round/number';

export class PlanningConfig extends Identifiable {
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

    protected extension: boolean = PlanningConfig.Default_Extension;
    protected gameMode: number = Sport.GAMEMODE_AGAINST;
    protected enableTime: boolean = PlanningConfig.Default_EnableTime;
    protected minutesPerGame: number = PlanningConfig.Default_MinutesPerGame;
    protected minutesPerGameExt: number = 0;
    protected minutesBetweenGames: number = 0;
    protected minutesAfter: number = PlanningConfig.Default_MinutesAfter;
    protected teamup: boolean = PlanningConfig.Default_Teamup;
    protected selfReferee: number = PlanningConfig.SelfReferee_Disabled;
    protected nrOfHeadtohead: number = PlanningConfig.Default_NrOfHeadtohead;

    constructor(protected roundNumber: RoundNumber) {
        super();
        this.roundNumber.setPlanningConfig(this);
    }

    getGameMode(): number {
        return this.gameMode;
    }

    setGameMode(gameMode: number) {
        this.gameMode = gameMode;
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

    getSelfReferee(): number {
        return this.selfReferee;
    }

    setSelfReferee(selfReferee: number) {
        this.selfReferee = selfReferee;
    }

    selfRefereeEnabled(): boolean {
        return this.selfReferee !== PlanningConfig.SelfReferee_Disabled;
    }

    getMaximalNrOfMinutesPerGame(): number {
        return this.getMinutesPerGame() + this.getMinutesPerGameExt();
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }
}

