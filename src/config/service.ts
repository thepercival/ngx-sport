import { SportConfig } from '../sportconfig';
import { RankingService } from '../ranking/service';
import { RoundNumber } from '../round/number';
import { Config } from '../config';
import { ConfigScore } from './score';

export class ConfigService {

    createFromPrevious(roundNumber: RoundNumber): Config {
        const previousConfig = roundNumber.getPrevious().getConfig();
        const config = new Config(roundNumber);
        config.setQualifyRule(previousConfig.getQualifyRule());
        config.setNrOfHeadtoheadMatches(previousConfig.getNrOfHeadtoheadMatches());
        config.setWinPoints(previousConfig.getWinPoints());
        config.setDrawPoints(previousConfig.getDrawPoints());
        config.setHasExtension(previousConfig.getHasExtension());
        config.setWinPointsExt(previousConfig.getWinPointsExt());
        config.setDrawPointsExt(previousConfig.getDrawPointsExt());
        config.setMinutesPerGameExt(previousConfig.getMinutesPerGameExt());
        config.setEnableTime(previousConfig.getEnableTime());
        config.setMinutesPerGame(previousConfig.getMinutesPerGame());
        config.setMinutesBetweenGames(previousConfig.getMinutesBetweenGames());
        config.setMinutesAfter(previousConfig.getMinutesAfter());
        config.setScore(this.createScoreConfig(previousConfig));
        config.setTeamup(previousConfig.getTeamup());
        config.setPointsCalculation(previousConfig.getPointsCalculation());
        config.setSelfReferee(previousConfig.getSelfReferee());
        return config;
    }

    createDefault(roundNumber: RoundNumber): Config {
        const sport = roundNumber.getCompetition().getLeague().getSport();
        const config = new Config(roundNumber);
        config.setQualifyRule(RankingService.RULESSET_WC);
        config.setNrOfHeadtoheadMatches(Config.DEFAULTNROFHEADTOHEADMATCHES);
        config.setWinPoints(this.getDefaultWinPoints(sport));
        config.setDrawPoints(this.getDefaultDrawPoints(sport));
        config.setHasExtension(Config.DEFAULTHASEXTENSION);
        config.setWinPointsExt(config.getWinPoints() - 1);
        config.setDrawPointsExt(config.getDrawPoints());
        config.setMinutesPerGameExt(0);
        config.setEnableTime(Config.DEFAULTENABLETIME);
        config.setMinutesPerGame(0);
        config.setMinutesBetweenGames(0);
        config.setMinutesAfter(0);
        config.setEnableTime(true);
        config.setMinutesPerGame(this.getDefaultMinutesPerGame());
        config.setMinutesBetweenGames(this.getDefaultMinutesBetweenGames());
        config.setMinutesAfter(this.getDefaultMinutesAfter());
        config.setScore(this.createScoreConfig(config));
        config.setTeamup(false);
        config.setPointsCalculation(Config.POINTS_CALC_GAMEPOINTS);
        config.setSelfReferee(false);
        return config;
    }

    getDefaultWinPoints(sport: string): number {
        if (sport === SportConfig.Chess) {
            return 1;
        }
        return Config.DEFAULTWINPOINTS;
    }

    getDefaultDrawPoints(sport: string): number {
        if (sport === SportConfig.Chess) {
            return 0.5;
        }
        return Config.DEFAULTDRAWPOINTS;
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

    canSportBeDoneTeamup(sportName: string): boolean {
        return sportName === SportConfig.Badminton || sportName === SportConfig.Darts || sportName === SportConfig.ESports
            || sportName === SportConfig.Squash || sportName === SportConfig.TableTennis || sportName === SportConfig.Tennis
            || sportName === undefined;

        // return SportConfig.getSports().filter(sportName => {
        //     return sportName === SportConfig.Badminton || sportName === SportConfig.Darts || sportName === SportConfig.ESports
        //         || sportName === SportConfig.Squash || sportName === SportConfig.TableTennis || sportName === SportConfig.Tennis;
        // });
    }

    protected createScoreConfig(config: Config): ConfigScore {
        const roundNumber = config.getRoundNumber();
        const sport = roundNumber.getCompetition().getLeague().getSport();

        if (!roundNumber.isFirst()) {
            return this.copyScoreConfigFromPrevious(config, roundNumber.getPrevious().getConfig().getScore());
        }

        let unitName = 'punten', parentUnitName;
        if (sport === SportConfig.Darts) {
            unitName = 'legs';
            parentUnitName = 'sets';
        } else if (sport === SportConfig.Tennis) {
            unitName = 'games';
            parentUnitName = 'sets';
        } else if (sport === SportConfig.Squash || sport === SportConfig.TableTennis
            || sport === SportConfig.Volleyball || sport === SportConfig.Badminton) {
            parentUnitName = 'sets';
        } else if (sport === SportConfig.Football || sport === SportConfig.Hockey) {
            unitName = 'goals';
        }

        let parent;
        if (parentUnitName !== undefined) {
            parent = this.createScoreConfigFromRoundHelper(config, parentUnitName, ConfigScore.UPWARDS, 0, undefined);
        }
        return this.createScoreConfigFromRoundHelper(config, unitName, ConfigScore.UPWARDS, 0, parent);
    }

    protected createScoreConfigFromRoundHelper(
        config: Config,
        name: string,
        direction: number,
        maximum: number,
        parent: ConfigScore
    ): ConfigScore {
        const scoreConfig = new ConfigScore(config, parent);
        scoreConfig.setName(name);
        scoreConfig.setDirection(direction);
        scoreConfig.setMaximum(maximum);
        return scoreConfig;
    }

    protected copyScoreConfigFromPrevious(config: Config, scoreConfig: ConfigScore) {
        const parent = scoreConfig.getParent() ? this.copyScoreConfigFromPrevious(config, scoreConfig.getParent()) : undefined;
        return this.createScoreConfigFromRoundHelper(
            config, scoreConfig.getName(), scoreConfig.getDirection(), scoreConfig.getMaximum(), parent);
    }
}
