import { Injectable } from '@angular/core';
import { CompetitionSport } from '../../competition/sport';
import { AgainstGame } from '../../game/against';
import { TogetherGamePlace } from '../../game/place/together';
import { Round } from '../../qualify/group';
import { AgainstScoreHelper } from '../againstHelper';
import { ScoreConfig } from '../config';
import { ScoreDirection } from '../direction';

@Injectable({
    providedIn: 'root'
})
export class ScoreConfigService {

    constructor() {
    }

    removeFromRound(competitionSport: CompetitionSport, round: Round) {
        const scoreConfig = round.getScoreConfig(competitionSport);
        if (scoreConfig) {
            round.getScoreConfigs().splice(round.getScoreConfigs().indexOf(scoreConfig), 1);
        }
        round.getChildren().forEach((child: Round) => this.removeFromRound(competitionSport, child));
    }



    copy(competitionSport: CompetitionSport, round: Round, sourceScoreConfig: ScoreConfig) {
        const newScoreConfig = new ScoreConfig(competitionSport, round, undefined);
        newScoreConfig.setDirection(sourceScoreConfig.getDirection());
        newScoreConfig.setMaximum(sourceScoreConfig.getMaximum());
        newScoreConfig.setEnabled(sourceScoreConfig.getEnabled());
        const previousSubScoreConfig = sourceScoreConfig.getNext();
        if (previousSubScoreConfig) {
            const newSubScoreConfig = new ScoreConfig(competitionSport, round, newScoreConfig);
            newSubScoreConfig.setDirection(previousSubScoreConfig.getDirection());
            newSubScoreConfig.setMaximum(previousSubScoreConfig.getMaximum());
            newSubScoreConfig.setEnabled(previousSubScoreConfig.getEnabled());
        }
    }

    createDefault(competitionSport: CompetitionSport, round: Round): ScoreConfig {
        const scoreConfig = new ScoreConfig(competitionSport, round, undefined);
        if (competitionSport.hasNextDefaultScoreConfig()) {
            const subScoreConfig = new ScoreConfig(competitionSport, round, scoreConfig);
            subScoreConfig.setDirection(ScoreDirection.Upwards);
            subScoreConfig.setMaximum(0);
            subScoreConfig.setEnabled(false);
        }
        return scoreConfig;
    }

    isDefault(scoreConfig: ScoreConfig): boolean {
        if (scoreConfig.getDirection() !== ScoreDirection.Upwards
            || scoreConfig.getMaximum() !== 0
        ) {
            return false;
        }
        const nextScoreConfig = scoreConfig.getNext();
        if (nextScoreConfig === undefined) {
            return true;
        }
        return this.isDefault(nextScoreConfig);
    }

    areEqual(scoreConfigA: ScoreConfig, scoreConfigB: ScoreConfig): boolean {
        if (scoreConfigA.getDirection() !== scoreConfigB.getDirection()
            || scoreConfigA.getMaximum() !== scoreConfigB.getMaximum()
        ) {
            return false;
        }
        const nextScoreConfigA = scoreConfigA.getNext();
        const nextScoreConfigB = scoreConfigB.getNext();
        if (nextScoreConfigA !== undefined && nextScoreConfigB !== undefined) {
            return this.areEqual(nextScoreConfigA, nextScoreConfigB);
        }
        return scoreConfigA.getNext() === scoreConfigB.getNext();
    }

    getFinalAgainstScore(game: AgainstGame, useSubScore?: boolean): AgainstScoreHelper | undefined {
        if (game.getScores().length === 0) {
            return undefined;
        }
        if (useSubScore === undefined) {
            useSubScore = game.getScoreConfig()?.useSubScore();
        }
        if (useSubScore) {
            let home = 0;
            let away = 0;
            game.getScores().forEach(score => {
                if (score.getHome() > score.getAway()) {
                    home++;
                } else if (score.getHome() < score.getAway()) {
                    away++;
                }
            });
            return new AgainstScoreHelper(home, away);
        }
        return new AgainstScoreHelper(game.getScores()[0].getHome(), game.getScores()[0].getAway());
    }

    getFinalAgainstSubScore(game: AgainstGame): AgainstScoreHelper {
        let home = 0;
        let away = 0;
        game.getScores().forEach(score => {
            home += score.getHome();
            away += score.getAway();
        });
        return new AgainstScoreHelper(home, away);
    }

    getFinalTogetherScore(gamePlace: TogetherGamePlace, useSubScore?: boolean): number {
        let score = 0;
        if (gamePlace.getScores().length === 0) {
            return score;
        }
        if (useSubScore === undefined) {
            useSubScore = gamePlace.getGame().getScoreConfig()?.useSubScore();
        }
        if (useSubScore) {
            gamePlace.getScores().forEach(scoreIt => {
                score += scoreIt.getScore();
            });
            return score;
        }
        return gamePlace.getScores()[0].getScore();
    }

    getFinalTogetherSubScore(gamePlace: TogetherGamePlace): number {
        let score = 0;
        gamePlace.getScores().forEach(scoreIt => {
            score += scoreIt.getScore();
        });
        return score;
    }
}
