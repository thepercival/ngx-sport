import { SportConfig } from '../../config';
import { QualifyRule } from '../../qualifyrule';
import { Round } from '../../round';
import { RoundConfig } from '../config';
import { RoundScoreConfig } from '../scoreconfig';

/**
 * Created by coen on 3-3-17.
 */
export class RoundConfigService {

    createConfigFromRound(round: Round): RoundConfig {
        const roundConfig = new RoundConfig(round);
        if (round.getParentRound() !== undefined) {
            const parentConfig = round.getParentRound().getConfig();
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
            roundConfig.setMinutesInBetween(parentConfig.getMinutesInBetween());
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
        roundConfig.setMinutesInBetween(0);
        const sport = round.getCompetition().getLeague().getSport();
        if (sport === SportConfig.Football || sport === SportConfig.Hockey || sport === SportConfig.Korfball) {
            roundConfig.setHasExtension(!round.needsRanking());
            roundConfig.setMinutesPerGameExt(5);
            roundConfig.setEnableTime(true);
            roundConfig.setMinutesPerGame(20);
            roundConfig.setMinutesInBetween(5);
        }
        return roundConfig;
    }

    createScoreConfigFromRound(round: Round): RoundScoreConfig {
        const sport = round.getCompetition().getLeague().getSport();

        if (round.getParentRound() !== undefined) {
            return this.copyScoreConfigFromParent(round, round.getParentRound().getScoreConfig());
        } else if (sport === SportConfig.Darts) {
            return this.createScoreConfigFromRoundHelper(
                round,
                'punten',
                RoundScoreConfig.DOWNWARDS,
                7,
                this.createScoreConfigFromRoundHelper(
                    round,
                    'legs',
                    RoundScoreConfig.UPWARDS,
                    3,
                    this.createScoreConfigFromRoundHelper(
                        round,
                        'sets',
                        RoundScoreConfig.UPWARDS,
                        0,
                        undefined
                    )
                )
            );
        } else if (sport === SportConfig.Tennis) {
            return this.createScoreConfigFromRoundHelper(
                round,
                'games',
                RoundScoreConfig.UPWARDS,
                7,
                this.createScoreConfigFromRoundHelper(
                    round,
                    'sets',
                    RoundScoreConfig.UPWARDS,
                    0,
                    undefined
                )
            );
        } else if (sport === SportConfig.TableTennis || sport === SportConfig.Volleyball || sport === SportConfig.Badminton) {
            return this.createScoreConfigFromRoundHelper(
                round,
                'punten',
                RoundScoreConfig.UPWARDS,
                sport === SportConfig.TableTennis ? 21 : (SportConfig.Volleyball ? 25 : 15),
                this.createScoreConfigFromRoundHelper(
                    round,
                    'sets',
                    RoundScoreConfig.UPWARDS,
                    0,
                    undefined
                )
            );
        }
        const config = this.createScoreConfigFromRoundHelper(
            round,
            'punten',
            RoundScoreConfig.UPWARDS,
            0,
            undefined
        );
        if (sport === SportConfig.Football || sport === SportConfig.Hockey) {
            config.setName('goals');
        }
        return config;
    }

    protected createScoreConfigFromRoundHelper(
        round: Round,
        name: string,
        direction: number,
        maximum: number,
        parent: RoundScoreConfig
    ): RoundScoreConfig {
        const roundScoreConfig = new RoundScoreConfig(round, parent);
        roundScoreConfig.setName(name);
        roundScoreConfig.setDirection(direction);
        roundScoreConfig.setMaximum(maximum);
        return roundScoreConfig;
    }

    protected copyScoreConfigFromParent(round: Round, scoreConfig: RoundScoreConfig) {
        let parent = null;
        if (scoreConfig.getParent()) {
            parent = this.copyScoreConfigFromParent(round, scoreConfig.getParent());
        }
        return this.createScoreConfigFromRoundHelper(
            round, scoreConfig.getName(), scoreConfig.getDirection(), scoreConfig.getMaximum(), parent);
    }
}
