import { Injectable } from '@angular/core';

import { Game } from '../../game';
import { GameScoreHomeAway } from '../../game/score/homeaway';
import { RoundNumber } from '../../round/number';
import { Sport } from '../../sport';
import { SportCustom } from '../custom';
import { SportScoreConfig } from '../scoreconfig';

@Injectable()
export class SportScoreConfigService {

    constructor() {
    }

    createDefault(sport: Sport, roundNumber: RoundNumber) {
        const scoreConfig = new SportScoreConfig(sport, roundNumber, undefined);
        scoreConfig.setDirection(SportScoreConfig.UPWARDS);
        scoreConfig.setMaximum(0);

        if (sport.getCustomId() === SportCustom.Darts || sport.getCustomId() === SportCustom.Tennis) {
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
        if (previousSubScoreConfig) {
            const newSubScoreConfig = new SportScoreConfig(sport, roundNumber, newScoreConfig);
            newSubScoreConfig.setDirection(previousSubScoreConfig.getDirection());
            newSubScoreConfig.setMaximum(previousSubScoreConfig.getMaximum());
        }
    }

    isDefault(sportScoreConfig: SportScoreConfig): boolean {
        if (sportScoreConfig.getDirection() !== SportScoreConfig.UPWARDS
            || sportScoreConfig.getMaximum() !== 0
        ) {
            return false;
        }
        if (sportScoreConfig.getChild() === undefined) {
            return true;
        }
        return this.isDefault(sportScoreConfig.getChild());
    }

    areEqual(sportScoreConfigA: SportScoreConfig, sportScoreConfigB: SportScoreConfig): boolean {
        if (sportScoreConfigA.getDirection() !== sportScoreConfigB.getDirection()
            || sportScoreConfigA.getMaximum() !== sportScoreConfigB.getMaximum()
        ) {
            return false;
        }
        if (sportScoreConfigA.getChild() !== undefined && sportScoreConfigB.getChild() !== undefined) {
            return this.areEqual(sportScoreConfigA.getChild(), sportScoreConfigB.getChild());
        }
        return sportScoreConfigA.getChild() === sportScoreConfigB.getChild();
    }

    getInput(rootSportScoreConfig: SportScoreConfig): SportScoreConfig {
        let childScoreConfig = rootSportScoreConfig.getChild();
        while (childScoreConfig !== undefined && (childScoreConfig.getMaximum() > 0 || rootSportScoreConfig.getMaximum() === 0)) {
            rootSportScoreConfig = childScoreConfig;
            childScoreConfig = childScoreConfig.getChild();
        }
        return rootSportScoreConfig;
    }

    getCalculate(rootSportScoreConfig: SportScoreConfig): SportScoreConfig {
        while (rootSportScoreConfig.getMaximum() === 0 && rootSportScoreConfig.getChild() !== undefined) {
            rootSportScoreConfig = rootSportScoreConfig.getChild();
        }
        return rootSportScoreConfig;
    }

    hasMultipleScores(rootSportScoreConfig: SportScoreConfig): boolean {
        return rootSportScoreConfig.getChild() !== undefined;
    }

    getFinal(game: Game, sub?: boolean): GameScoreHomeAway {
        if (game.getScores().length === 0) {
            return undefined;
        }
        if (sub === true) {
            return this.getSubScore(game);
        }
        let home = game.getScores()[0].getHome();
        let away = game.getScores()[0].getAway();
        const sportScoreConfig = game.getSportScoreConfig();
        if (this.getCalculate(sportScoreConfig) !== this.getInput(sportScoreConfig)) {
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
