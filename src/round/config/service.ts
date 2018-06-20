import { SportConfig } from '../../config';
import { QualifyRule } from '../../qualify/rule';
import { Round } from '../../round';
import { RoundConfig } from '../config';
import { RoundConfigScore } from './score';

/**
 * Created by coen on 3-3-17.
 */
export class RoundConfigService {

    createConfigFromRound(round: Round): RoundConfig {
        const roundConfig = new RoundConfig(round);
        if (round.getParent() !== undefined) {
            const parentConfig = round.getParent().getConfig();
            roundConfig.setQualifyRule(parentConfig.getQualifyRule());
            roundConfig.setNrOfHeadtoheadMatches(parentConfig.getNrOfHeadtoheadMatches());
            roundConfig.setWinPoints(parentConfig.getWinPoints());
            roundConfig.setDrawPoints(parentConfig.getDrawPoints());
            roundConfig.setHasExtension(parentConfig.getHasExtension());
            roundConfig.setWinPointsExt(parentConfig.getWinPointsExt());
            roundConfig.setDrawPointsExt(parentConfig.getDrawPointsExt());
            roundConfig.setMinutesPerGameExt(parentConfig.getMinutesPerGameExt());
            roundConfig.setEnableTime(parentConfig.getEnableTime());
            roundConfig.setMinutesPerGame(parentConfig.getMinutesPerGame());
            roundConfig.setMinutesBetweenGames(parentConfig.getMinutesBetweenGames());
            roundConfig.setMinutesInBetween(parentConfig.getMinutesInBetween());
            roundConfig.setScore(this.createScoreConfigFromRound(parentConfig));
            return roundConfig;
        }

        roundConfig.setQualifyRule(QualifyRule.SOCCERWORLDCUP);
        roundConfig.setNrOfHeadtoheadMatches(RoundConfig.DEFAULTNROFHEADTOHEADMATCHES);
        roundConfig.setWinPoints(RoundConfig.DEFAULTWINPOINTS);
        roundConfig.setDrawPoints(RoundConfig.DEFAULTDRAWPOINTS);
        roundConfig.setHasExtension(RoundConfig.DEFAULTHASEXTENSION);
        roundConfig.setWinPointsExt(roundConfig.getWinPoints() - 1);
        roundConfig.setDrawPointsExt(roundConfig.getDrawPoints());
        roundConfig.setMinutesPerGameExt(0);
        roundConfig.setEnableTime(RoundConfig.DEFAULTENABLETIME);
        roundConfig.setMinutesPerGame(0);
        roundConfig.setMinutesBetweenGames(0);
        roundConfig.setMinutesInBetween(0);
        const sport = round.getCompetition().getLeague().getSport();
        if (sport === SportConfig.Football || sport === SportConfig.Hockey || sport === SportConfig.Korfball) {
            roundConfig.setHasExtension(!round.needsRanking());
            roundConfig.setMinutesPerGameExt(this.getDefaultMinutesPerGameExt());
            roundConfig.setEnableTime(true);
            roundConfig.setMinutesPerGame(this.getDefaultMinutesPerGame());
            roundConfig.setMinutesBetweenGames(this.getDefaultMinutesBetweenGames());
            roundConfig.setMinutesInBetween(this.getDefaultMinutesInBetween());
        }
        roundConfig.setScore(this.createScoreConfigFromRound(roundConfig));
        return roundConfig;
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

    getDefaultMinutesInBetween(): number {
        return 5;
    }

    protected createScoreConfigFromRound(config: RoundConfig): RoundConfigScore {
        const round = config.getRound();
        const sport = round.getCompetition().getLeague().getSport();

        if (round.getParent() !== undefined) {
            return this.copyScoreConfigFromParent(config, round.getParent().getConfig().getScore());
        } else if (sport === SportConfig.Darts) {
            return this.createScoreConfigFromRoundHelper(
                config, 'punten', RoundConfigScore.DOWNWARDS, 501, this.createScoreConfigFromRoundHelper(
                    config, 'legs', RoundConfigScore.UPWARDS, 3, this.createScoreConfigFromRoundHelper(
                        config, 'sets', RoundConfigScore.UPWARDS, 0, undefined
                    )
                )
            );
        } else if (sport === SportConfig.Tennis) {
            return this.createScoreConfigFromRoundHelper(
                config, 'games', RoundConfigScore.UPWARDS, 7, this.createScoreConfigFromRoundHelper(
                    config, 'sets', RoundConfigScore.UPWARDS, 0, undefined
                )
            );
        } else if (sport === SportConfig.TableTennis || sport === SportConfig.Volleyball || sport === SportConfig.Badminton) {
            return this.createScoreConfigFromRoundHelper(
                config, 'punten', RoundConfigScore.UPWARDS,
                sport === SportConfig.TableTennis ? 21 : (SportConfig.Volleyball ? 25 : 15),
                this.createScoreConfigFromRoundHelper(
                    config, 'sets', RoundConfigScore.UPWARDS, 0, undefined
                )
            );
        }
        const configScore = this.createScoreConfigFromRoundHelper(
            config, 'punten', RoundConfigScore.UPWARDS, 0, undefined
        );
        if (sport === SportConfig.Football || sport === SportConfig.Hockey) {
            configScore.setName('goals');
        }
        return configScore;
    }

    protected createScoreConfigFromRoundHelper(
        config: RoundConfig,
        name: string,
        direction: number,
        maximum: number,
        parent: RoundConfigScore
    ): RoundConfigScore {
        const roundScoreConfig = new RoundConfigScore(config, parent);
        roundScoreConfig.setName(name);
        roundScoreConfig.setDirection(direction);
        roundScoreConfig.setMaximum(maximum);
        return roundScoreConfig;
    }

    protected copyScoreConfigFromParent(config: RoundConfig, scoreConfig: RoundConfigScore) {
        const round = config.getRound();
        const parent = scoreConfig.getParent() ? this.copyScoreConfigFromParent(config, scoreConfig.getParent()) : undefined;
        return this.createScoreConfigFromRoundHelper(
            config, scoreConfig.getName(), scoreConfig.getDirection(), scoreConfig.getMaximum(), parent);
    }
}
