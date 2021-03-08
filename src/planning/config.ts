import { CreationStrategy } from '../game/roundAssigner';
import { Identifiable } from '../identifiable';
import { SelfReferee } from '../referee/self';
import { RoundNumber } from '../round/number';

export class PlanningConfig extends Identifiable {
    static readonly Teamup_Min = 4;
    static readonly Teamup_Max = 6;

    constructor(
        protected roundNumber: RoundNumber,
        protected creationStrategy: CreationStrategy,
        protected extension: boolean,
        protected enableTime: boolean,
        protected minutesPerGame: number,
        protected minutesPerGameExt: number,
        protected minutesBetweenGames: number,
        protected minutesAfter: number,
        protected selfReferee: number) {
        super();
        this.roundNumber.setPlanningConfig(this);
    }

    getCreationStrategy(): CreationStrategy {
        return this.creationStrategy;
    }

    getExtension(): boolean {
        return this.extension;
    }

    getEnableTime(): boolean {
        return this.enableTime;
    }

    getMinutesPerGame(): number {
        return this.minutesPerGame;
    }

    getMinutesPerGameExt(): number {
        return this.minutesPerGameExt;
    }

    getMinutesBetweenGames(): number {
        return this.minutesBetweenGames;
    }

    getMinutesAfter(): number {
        return this.minutesAfter;
    }

    getSelfReferee(): number {
        return this.selfReferee;
    }

    selfRefereeEnabled(): boolean {
        return this.selfReferee !== SelfReferee.Disabled;
    }

    getMaximalNrOfMinutesPerGame(): number {
        return this.getMinutesPerGame() + this.getMinutesPerGameExt();
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }
}

