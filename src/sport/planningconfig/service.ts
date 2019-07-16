import { SportPlanningConfig } from '../planningconfig';
import { Sport } from '../../sport';
import { RoundNumber } from '../../round/number';
import { Poule } from '../../poule';
import { GameGenerator } from '../../planning/gamegenerator';
import { SportIdToNumberMap } from '../counter';

export class SportPlanningConfigService {

    constructor() {
    }

    createDefault(sport: Sport, roundNumber: RoundNumber) {
        const config = new SportPlanningConfig(sport, roundNumber);
        config.setMinNrOfGames(SportPlanningConfig.DEFAULTNROFGAMES);
        return config;
    }

    copy(sport: Sport, roundNumber: RoundNumber, sourceConfig: SportPlanningConfig) {
        const newConfig = new SportPlanningConfig(sport, roundNumber);
        newConfig.setMinNrOfGames(sourceConfig.getMinNrOfGames());
    }

    /*isDefault( config: SportPlanningConfig ): boolean {
        return config.getNrOfGames() === SportPlanningConfig.DEFAULTNROFGAMES;
    }*/

    /*areEqual( configA: SportPlanningConfig, configB: SportPlanningConfig ): boolean {
        return configA.getNrOfGames() === configB.getNrOfGames();
    }*/

    getUsed(roundNumber: RoundNumber) {
        const usedSports = roundNumber.getCompetition().getFields().map(field => field.getSport());
        return roundNumber.getSportPlanningConfigs().filter(config => {
            return usedSports.some(sport => config.getSport() === sport);
        });
    }

    getMinNrOfGames(sportPlanningConfigs: SportPlanningConfig[], poule: Poule): SportIdToNumberMap {
        const minNrOfGames = {};
        if ( sportPlanningConfigs.length === 1 ) { // bereken voor 1 sport
            const gameGenerator = new GameGenerator();
            minNrOfGames[sportPlanningConfigs[0].getSport().getId()] =
                gameGenerator.getNrOfGamesPerPlace(poule.getPlaces().length, false) *
                poule.getRound().getNumber().getValidPlanningConfig().getNrOfHeadtohead();
        }
        sportPlanningConfigs.forEach( sportPlanningConfig => {
            minNrOfGames[sportPlanningConfig.getSport().getId()] = sportPlanningConfig.getMinNrOfGames();
        });
        return minNrOfGames;
    }
}
