import { PlanningConfig } from '../config';
import { RoundNumber } from '../../round/number';
import { Injectable } from '@angular/core';
import { PouleStructure } from '../../poule/structure';

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

    public selfRefereeAvailable(pouleStructure: PouleStructure, nrOfGamePlaces: number): boolean {
        return this.selfRefereeSamePouleAvailable(pouleStructure, nrOfGamePlaces)
            || this.selfRefereeOtherPoulesAvailable(pouleStructure);
    }

    public selfRefereeOtherPoulesAvailable(pouleStructure: PouleStructure): boolean {
        return pouleStructure.getNrOfPoules() > 1;
    }

    public selfRefereeSamePouleAvailable(pouleStructure: PouleStructure, nrOfGamePlaces: number): boolean {
        return pouleStructure.getSmallestPoule() > nrOfGamePlaces;
    }
}
