import { PlanningConfig } from '../config';
import { RoundNumber } from '../../round/number';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PlanningConfigService {

    createDefault(roundNumber: RoundNumber): PlanningConfig {
        const config = new PlanningConfig(roundNumber);
        config.setExtension(PlanningConfig.DEFAULTEXTENSION);
        config.setEnableTime(PlanningConfig.DEFAULTENABLETIME);
        config.setMinutesPerGame(0);
        config.setMinutesPerGameExt(0);
        config.setMinutesBetweenGames(0);
        config.setMinutesAfter(0);
        config.setMinutesPerGame(this.getDefaultMinutesPerGame());
        config.setMinutesBetweenGames(this.getDefaultMinutesBetweenGames());
        config.setMinutesAfter(this.getDefaultMinutesAfter());
        config.setTeamup(false);
        config.setSelfReferee(PlanningConfig.SELFREFEREE_DISABLED);
        config.setNrOfHeadtohead(PlanningConfig.DEFAULTNROFHEADTOHEAD);
        return config;
    }

    getDefaultMinutesPerGame(): number {
        return 20;
    }

    getDefaultMinutesPerGameExt(): number {
        return 5;
    }

    getDefaultMinutesBetweenGames(): number {
        return 5;
    }

    getDefaultMinutesAfter(): number {
        return 5;
    }

    public selfRefereeAvailable(nrOfPoules: number, nrOfPlaces: number, nrOfGamePlaces: number): boolean {
        return this.selfRefereeSamePouleAvailable(nrOfPoules, nrOfPlaces, nrOfGamePlaces)
            || this.selfRefereeOtherPoulesAvailable(nrOfPoules);
    }

    public selfRefereeOtherPoulesAvailable(nrOfPoules: number): boolean {
        return nrOfPoules > 1;
    }

    public selfRefereeSamePouleAvailable(nrOfPoules: number, nrOfPlaces: number, nrOfGamePlaces: number): boolean {
        return Math.floor(nrOfPlaces / nrOfPoules) >= (nrOfGamePlaces + 1);
    }
}
