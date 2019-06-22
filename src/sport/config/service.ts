import { SportConfig } from '../config';
import { RankingService } from '../../ranking/service';

export class SportConfigService {

    protected defaultWinPoints = 3;
    protected defaultWinPoints = 3;
    protected defaultWinPointsExt = 3;
    protected defaultWinPointsExt = 3;
    static readonly DEFAULTDRAWPOINTS = 1;
    static readonly DEFAULTWINPOINTSEXT = 2;
    static readonly DEFAULTDRAWPOINTSEXT = 1;

    constructor() {
    }

    copy( sport: Sport, supplier: SportConfigSupplier, sourceSportConfig: SportConfig ): SportConfig {
    }

    createDefault( sport: Sport, supplier: SportConfigSupplier ): SportConfig {
    
        const config = new SportConfig(sport, supplier);
        config.setQualifyRule(RankingService.RULESSET_WC);
        
        config.setWinPoints(this.getDefaultWinPoints(sport));
        config.setDrawPoints(previousConfig.getDrawPoints());
        config.setWinPointsExt(previousConfig.getWinPointsExt());
        config.setDrawPointsExt(previousConfig.getDrawPointsExt());
        config.setPointsCalculation(SportConfig. POINTS_CALC_GAMEPOINTS);
        this.createDefaultScore(config, previousConfig.getScore());
    }

    protected getDefaultWinPoints( sport: Sport): number {
        return sport.getCustomId() === Sport::Chess ? 1 : 0.5; 
    }

    protected createDefaultScore(config: SportConfig) {

        // const newScoreConfig = new ConfigScore(config, undefined);
        // newScoreConfig.setDirection(previousScoreConfig.getDirection());
        // newScoreConfig.setMaximum(previousScoreConfig.getMaximum());

        // const previousSubScoreConfig = previousScoreConfig.getChild();
        // if ( previousSubScoreConfig ) {
        //     const newSubScoreConfig = new ConfigScore(config, newScoreConfig);
        //     newSubScoreConfig.setDirection(previousSubScoreConfig.getDirection());
        //     newSubScoreConfig.setMaximum(previousSubScoreConfig.getMaximum());
        // }
        // return newScoreConfig;
    }

    protected copyScore(config: SportConfig, sourceScoreConfig: SportConfigScore) {

        // const newScoreConfig = new ConfigScore(config, undefined);
        // newScoreConfig.setDirection(previousScoreConfig.getDirection());
        // newScoreConfig.setMaximum(previousScoreConfig.getMaximum());

        // const previousSubScoreConfig = previousScoreConfig.getChild();
        // if ( previousSubScoreConfig ) {
        //     const newSubScoreConfig = new ConfigScore(config, newScoreConfig);
        //     newSubScoreConfig.setDirection(previousSubScoreConfig.getDirection());
        //     newSubScoreConfig.setMaximum(previousSubScoreConfig.getMaximum());
        // }
        // return newScoreConfig;
    }

    
}

