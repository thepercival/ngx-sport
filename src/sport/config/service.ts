import { Competition } from '../../competition';
import { Sport } from '../../sport';
import { SportConfig } from '../config';
import { SportCustom } from '../custom';

export class SportConfigService {

    constructor() {
    }

    createDefault(sport: Sport, competition: Competition): SportConfig {
        const config = new SportConfig(sport, competition);
        config.setWinPoints(this.getDefaultWinPoints(sport));
        config.setDrawPoints(this.getDefaultDrawPoints(sport));
        config.setWinPointsExt(this.getDefaultWinPointsExt(sport));
        config.setDrawPointsExt(this.getDefaultDrawPointsExt(sport));
        config.setPointsCalculation(SportConfig.POINTS_CALC_GAMEPOINTS);
        config.setNrOfGameCompetitors(SportConfig.DEFAULT_NROFGAMECOMPETITORS);
        return config;
    }

    protected getDefaultWinPoints(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? 3 : 1;
    }

    protected getDefaultDrawPoints(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? 1 : 0.5;
    }

    protected getDefaultWinPointsExt(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? 2 : 1;
    }

    protected getDefaultDrawPointsExt(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? 1 : 0.5;
    }

    copy(sourceConfig: SportConfig, competition: Competition): SportConfig {
        const newConfig = new SportConfig(sourceConfig.getSport(), competition);
        newConfig.setWinPoints(sourceConfig.getWinPoints());
        newConfig.setDrawPoints(sourceConfig.getDrawPoints());
        newConfig.setWinPointsExt(sourceConfig.getWinPointsExt());
        newConfig.setDrawPointsExt(sourceConfig.getDrawPointsExt());
        newConfig.setPointsCalculation(sourceConfig.getPointsCalculation());
        newConfig.setNrOfGameCompetitors(sourceConfig.getNrOfGameCompetitors());
        return newConfig;
    }

    remove(config: SportConfig) {
        const competition = config.getCompetition();
        const sportConfigs = competition.getSportConfigs();
        const index = sportConfigs.indexOf(config);
        if (index > -1) {
            sportConfigs.splice(index, 1);
        }
        const fields = competition.getFields();
        fields.filter(field => field.getSport() === config.getSport()).forEach(field => {
            competition.removeField(field);
        });
        // sportplanningconfig and sportscoreconfig will be removed by backend
    }

    isDefault(sportConfig: SportConfig): boolean {
        const sport = sportConfig.getSport();
        return (sportConfig.getWinPoints() !== this.getDefaultWinPoints(sport)
            || sportConfig.getDrawPoints() !== this.getDefaultDrawPoints(sport)
            || sportConfig.getWinPointsExt() !== this.getDefaultWinPointsExt(sport)
            || sportConfig.getDrawPointsExt() !== this.getDefaultDrawPointsExt(sport)
            || sportConfig.getPointsCalculation() !== SportConfig.POINTS_CALC_GAMEPOINTS
            || sportConfig.getNrOfGameCompetitors() !== SportConfig.DEFAULT_NROFGAMECOMPETITORS
        );
    }

    areEqual(sportConfigA: SportConfig, sportConfigB: SportConfig): boolean {
        return (sportConfigA.getSport() !== sportConfigB.getSport()
            || sportConfigA.getWinPoints() !== sportConfigB.getWinPoints()
            || sportConfigA.getDrawPoints() !== sportConfigB.getDrawPoints()
            || sportConfigA.getWinPointsExt() !== sportConfigB.getWinPointsExt()
            || sportConfigA.getDrawPointsExt() !== sportConfigB.getDrawPointsExt()
            || sportConfigA.getPointsCalculation() !== sportConfigB.getPointsCalculation()
            || sportConfigA.getNrOfGameCompetitors() !== sportConfigB.getNrOfGameCompetitors()
        );
    }
}
