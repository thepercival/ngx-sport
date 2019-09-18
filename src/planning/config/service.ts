import { PlanningConfig } from '../config';
import { RoundNumber } from '../../round/number';

export class PlanningConfigService {

    createDefault(roundNumber: RoundNumber): PlanningConfig {
        const config = new PlanningConfig(roundNumber);
        config.setMinutesPerGameExt(0);
        config.setEnableTime(PlanningConfig.DEFAULTENABLETIME);
        config.setMinutesPerGame(0);
        config.setMinutesBetweenGames(0);
        config.setMinutesAfter(0);
        config.setEnableTime(true);
        config.setMinutesPerGame(this.getDefaultMinutesPerGame());
        config.setMinutesBetweenGames(this.getDefaultMinutesBetweenGames());
        config.setMinutesAfter(this.getDefaultMinutesAfter());
        config.setTeamup(false);
        config.setSelfReferee(false);
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
}
