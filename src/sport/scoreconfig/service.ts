import { GameScoreHomeAway } from '../../game/score/homeaway';
import { SportScoreConfig } from '../scoreconfig';
import { Sport } from '../../sport';
import { Game } from '../../game';
import { RoundNumber } from '../../round/number';
import { SportCustomId } from '../customid';

export class SportScoreConfigService {

    constructor() {
    }

    createDefault(sport: Sport, roundNumber: RoundNumber) {
        const scoreConfig = new SportScoreConfig(sport, roundNumber, undefined);
        scoreConfig.setDirection(SportScoreConfig.UPWARDS);
        scoreConfig.setMaximum(0);

        if ( sport.getCustomId() === SportCustomId.Darts || sport.getCustomId() === SportCustomId.Tennis ) {
            const subScoreConfig = new SportScoreConfig(sport, roundNumber, scoreConfig);
            subScoreConfig.setDirection(SportScoreConfig.UPWARDS);
            subScoreConfig.setMaximum(0);
        }
        return scoreConfig;
    }

    copy(sport: Sport, roundNumber: RoundNumber, sourceScoreConfig: SportScoreConfig) {
        const newScoreConfig = new SportScoreConfig(sport, roundNumber, undefined);
        newScoreConfig.setDirection(sourceScoreConfig.getDirection());
        newScoreConfig.setMaximum(sourceScoreConfig.getMaximum());
        const previousSubScoreConfig = sourceScoreConfig.getChild();
        if ( previousSubScoreConfig ) {
            const newSubScoreConfig = new SportScoreConfig(sport, roundNumber, newScoreConfig);
            newSubScoreConfig.setDirection(previousSubScoreConfig.getDirection());
            newSubScoreConfig.setMaximum(previousSubScoreConfig.getMaximum());
        }
    }

    isDefault( sportScoreConfig: SportScoreConfig ): boolean {
        if ( sportScoreConfig.getDirection() !== SportScoreConfig.UPWARDS
            || sportScoreConfig.getMaximum() !== 0
        ) {
            return false;
        }
        if ( sportScoreConfig.getChild() === undefined ) {
            return true;
        }
        return this.isDefault( sportScoreConfig.getChild() );
    }

    areScoresEqual( sportScoreConfigA: SportScoreConfig, sportScoreConfigB: SportScoreConfig ): boolean {
        if ( sportScoreConfigA.getDirection() !== sportScoreConfigB.getDirection()
            || sportScoreConfigA.getMaximum() !== sportScoreConfigB.getMaximum()
        ) {
            return false;
        }
        if ( sportScoreConfigA.getChild() !== undefined && sportScoreConfigB.getChild() !== undefined ) {
            return this.areScoresEqual( sportScoreConfigA.getChild(), sportScoreConfigB.getChild() );
        }
        return sportScoreConfigA.getChild() === sportScoreConfigB.getChild();
    }

    getInputScore(rootSportScoreConfig: SportScoreConfig): SportScoreConfig {
        let childScoreConfig = rootSportScoreConfig.getChild();
        while (childScoreConfig !== undefined && (childScoreConfig.getMaximum() > 0 || rootSportScoreConfig.getMaximum() === 0)) {
            rootSportScoreConfig = childScoreConfig;
            childScoreConfig = childScoreConfig.getChild();
        }
        return rootSportScoreConfig;
    }

    getCalculateScore(rootSportScoreConfig: SportScoreConfig): SportScoreConfig {
        while (rootSportScoreConfig.getMaximum() === 0 && rootSportScoreConfig.getChild() !== undefined) {
            rootSportScoreConfig = rootSportScoreConfig.getChild();
        }
        return rootSportScoreConfig;
    }

    hasMultipleScores(rootSportScoreConfig: SportScoreConfig): boolean {
        return rootSportScoreConfig.getChild() !== undefined;
    }

    getFinalScore(game: Game, sub?: boolean): GameScoreHomeAway {
        if (game.getScores().length === 0) {
            return undefined;
        }
        if (sub === true) {
            return this.getSubScore(game);
        }
        let home = game.getScores()[0].getHome();
        let away = game.getScores()[0].getAway();
        const sportScoreConfig = game.getSportScoreConfig();
        if (this.getCalculateScore(sportScoreConfig) !== this.getInputScore(sportScoreConfig)) {
            home = 0;
            away = 0;
            game.getScores().forEach(score => {
                if (score.getHome() > score.getAway()) {
                    home++;
                } else if (score.getHome() < score.getAway()) {
                    away++;
                }
            });
        }
        return new GameScoreHomeAway(home, away);
    }

    private getSubScore(game: Game): GameScoreHomeAway {
        let home = 0;
        let away = 0;
        game.getScores().forEach(score => {
            home += score.getHome();
            away += score.getAway();
        });
        return new GameScoreHomeAway(home, away);
    }
}
