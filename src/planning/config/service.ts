import { PlanningConfig } from '../config';
import { PlanningConfigSupplier } from './supplier';

export class PlanningConfigService {

    createDefault(supplier: PlanningConfigSupplier): PlanningConfig {
        const config = new PlanningConfig(supplier);
        config.setNrOfHeadtoheadMatches(PlanningConfig.DEFAULTNROFHEADTOHEADMATCHES);
        config.setHasExtension(PlanningConfig.DEFAULTHASEXTENSION);
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
