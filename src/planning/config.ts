
import { Identifiable } from '../identifiable';
import { SelfReferee } from '../referee/self';
import { RoundNumber } from '../round/number';
import { PlanningEditMode } from './editMode';
import { GamePlaceStrategy } from './strategy';

export class PlanningConfig extends Identifiable {
    constructor(
        protected roundNumber: RoundNumber,
        protected editMode: PlanningEditMode,
        protected gamePlaceStrategy: GamePlaceStrategy,
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

    getEditMode(): PlanningEditMode {
        return this.editMode;
    }

    getGamePlaceStrategy(): GamePlaceStrategy {
        return this.gamePlaceStrategy;
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

    getMaxNrOfMinutesPerGame(): number {
        return this.getMinutesPerGame() + this.getMinutesPerGameExt();
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }
}

