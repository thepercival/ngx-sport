import { SportConfig } from '../config';
import { SportScoreConfig } from '../scoreconfig';
import { Sport } from '../../sport';
import { Competition } from '../../competition';
import { RoundNumber } from '../../round/number';
import { SportCustomId } from '../../sport/customid';

export class SportConfigService {

    constructor() {
    }

    createDefault( sport: Sport, competition: Competition ): SportConfig {
        const config = new SportConfig(sport, competition);
        config.setWinPoints(this.getDefaultWinPoints(sport));
        config.setDrawPoints(this.getDefaultDrawPoints(sport));
        config.setWinPointsExt(this.getDefaultWinPointsExt(sport));
        config.setDrawPointsExt(this.getDefaultDrawPointsExt(sport));
        config.setPointsCalculation(SportConfig.POINTS_CALC_GAMEPOINTS);
        config.setNrOfGameCompetitors(SportConfig.DEFAULT_NROFGAMECOMPETITORS);
        return config;
    }

    protected getDefaultWinPoints( sport: Sport): number {
        return sport.getCustomId() === SportCustomId.Chess ? 3 : 1;
    }

    protected getDefaultDrawPoints( sport: Sport): number {
        return sport.getCustomId() === SportCustomId.Chess ? 1 : 0.5;
    }

    protected getDefaultWinPointsExt( sport: Sport): number {
        return sport.getCustomId() === SportCustomId.Chess ? 2 : 1;
    }

    protected getDefaultDrawPointsExt( sport: Sport): number {
        return sport.getCustomId() === SportCustomId.Chess ? 1 : 0.5;
    }

    copy( sourceConfig: SportConfig, competition: Competition ): SportConfig {
        const newConfig = new SportConfig(sourceConfig.getSport(), competition);
        newConfig.setWinPoints(sourceConfig.getWinPoints());
        newConfig.setDrawPoints(sourceConfig.getDrawPoints());
        newConfig.setWinPointsExt(sourceConfig.getWinPointsExt());
        newConfig.setDrawPointsExt(sourceConfig.getDrawPointsExt());
        newConfig.setPointsCalculation(sourceConfig.getPointsCalculation());
        newConfig.setNrOfGameCompetitors(sourceConfig.getNrOfGameCompetitors());
        return newConfig;
    }

    isDefault( sportConfig: SportConfig ): boolean {
        const sport = sportConfig.getSport();
        return ( sportConfig.getWinPoints() !== this.getDefaultWinPoints(sport)
            || sportConfig.getDrawPoints() !== this.getDefaultDrawPoints(sport)
            || sportConfig.getWinPointsExt() !== this.getDefaultWinPointsExt(sport)
            || sportConfig.getDrawPointsExt() !== this.getDefaultDrawPointsExt(sport)
            || sportConfig.getPointsCalculation() !== SportConfig.POINTS_CALC_GAMEPOINTS
            || sportConfig.getNrOfGameCompetitors() !== SportConfig.DEFAULT_NROFGAMECOMPETITORS
        );
    }

    areEqual( sportConfigA: SportConfig, sportConfigB: SportConfig ): boolean {
        return ( sportConfigA.getSport() !== sportConfigB.getSport()
            || sportConfigA.getWinPoints() !== sportConfigB.getWinPoints()
            || sportConfigA.getDrawPoints() !== sportConfigB.getDrawPoints()
            || sportConfigA.getWinPointsExt() !== sportConfigB.getWinPointsExt()
            || sportConfigA.getDrawPointsExt() !== sportConfigB.getDrawPointsExt()
            || sportConfigA.getPointsCalculation() !== sportConfigB.getPointsCalculation()
            || sportConfigA.getNrOfGameCompetitors() !== sportConfigB.getNrOfGameCompetitors()
        );
    }
}

        //        $unitName = 'punten'; $parentUnitName = null;
//        if ($sport === SportConfig::Darts) {
//            $unitName = 'legs';
//            $parentUnitName = 'sets';
//        } else if ($sport === SportConfig::Tennis) {
//            $unitName = 'games';
//            $parentUnitName = 'sets';

//        } else if ($sport === SportConfig::Squash || $sport === SportConfig::TableTennis
//            || $sport === SportConfig::Volleyball || $sport === SportConfig::Badminton) {
//            $parentUnitName = 'sets';

//        } else if ($sport === SportConfig::Football || $sport === SportConfig::Hockey) {
//            $unitName = 'goals';
//        }

// Badminton = 1,
// Basketball = 2,
// Darts = 3,
// ESports = 4,
// Hockey = 5,
// Korfball = 6,
// Chess = 7,
// Squash = 8,
// TableTennis = 9,
// Tennis = 10,
// Football = 11,
// Voleyball = 12



// update sports set customId = 1, scoreUnitName = 'sets' where name = 'badminton';
// update sports set customId = 2, teamup = false where name = 'basketbal';
// update sports set customId = 3, scoreUnitName = 'sets', scoreSubUnitName = 'legs' where name = 'darten';
// update sports set customId = 4 where name = 'e-sporten';
// update sports set customId = 5, scoreUnitName = 'goals', teamup = false where name = 'hockey';
// update sports set customId = 6, teamup = false where name = 'korfbal';
// update sports set customId = 7 where name = 'schaken';
// update sports set customId = 8, scoreUnitName = 'sets' where name = 'squash';
// update sports set customId = 9, scoreUnitName = 'sets' where name = 'tafeltennis';
// update sports set customId = 10, scoreUnitName = 'sets', scoreSubUnitName = 'games' where name = 'tennis';
// update sports set customId = 11, scoreUnitName = 'goals', teamup = false where name = 'voetbal';
// update sports set customId = 12, scoreUnitName = 'sets', teamup = false where name = 'volleybal';

        // const newScoreConfig = new SportScoreConfig(config, undefined);
        // newScoreConfig.setDirection(previousScoreConfig.getDirection());
        // newScoreConfig.setMaximum(previousScoreConfig.getMaximum());

        // const previousSubScoreConfig = previousScoreConfig.getChild();
        // if ( previousSubScoreConfig ) {
        //     const newSubScoreConfig = new SportScoreConfig(config, newScoreConfig);
        //     newSubScoreConfig.setDirection(previousSubScoreConfig.getDirection());
        //     newSubScoreConfig.setMaximum(previousSubScoreConfig.getMaximum());
        // }
        // return newScoreConfig;
  //  }
    // move to nameservice?

    // static getDirectionDescription(direction: number) {
    //     return direction === SportScoreConfig.UPWARDS ? 'naar' : 'vanaf';
    // }

    // getName(): string {
    //     const sport = this.getSportConfig().getSport();
    //     return this.hasParent() ? sport.getScoreSubUnitName() : sport.getScoreUnitName();
    // }

    // getNameSingle(): string {
    //     if (this.getName().endsWith('en')) {
    //         return this.getName().substring(0, this.getName().length - 2);
    //     }
    //     return this.getName().substring(0, this.getName().length - 1);
    // }
