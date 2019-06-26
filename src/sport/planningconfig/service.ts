import { SportPlanningConfig } from '../planningconfig';
import { Sport } from '../../sport';
import { RoundNumber } from '../../round/number';

export class SportPlanningConfigService {

    constructor() {
    }

    createDefault(sport: Sport, roundNumber: RoundNumber) {
        const sportPlanningConfig = new SportPlanningConfig(sport, roundNumber);
        sportPlanningConfig.setNrOfHeadtoheadMatches(SportPlanningConfig.DEFAULTNROFHEADTOHEADMATCHES);
        return sportPlanningConfig;
    }

    copy(sport: Sport, roundNumber: RoundNumber, sourceConfig: SportPlanningConfig) {
        const newConfig = new SportPlanningConfig(sport, roundNumber);
        newConfig.setNrOfHeadtoheadMatches(sourceConfig.getNrOfHeadtoheadMatches());
    }

    isDefault( config: SportPlanningConfig ): boolean {
        return config.getNrOfHeadtoheadMatches() === SportPlanningConfig.DEFAULTNROFHEADTOHEADMATCHES;
    }

    areEqual( configA: SportPlanningConfig, configB: SportPlanningConfig ): boolean {
        return configA.getNrOfHeadtoheadMatches() === configB.getNrOfHeadtoheadMatches();
    }
}
