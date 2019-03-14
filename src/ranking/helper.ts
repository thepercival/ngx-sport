import { Game } from '../game';
import { GameScoreHomeAway } from '../game/score/homeaway';
import { PoulePlace } from '../pouleplace';
import { RoundNumberConfig } from '../round/number/config';
import { RankingItem } from './item';
import { RankingService } from './service';

/* tslint:disable:no-bitwise */

export class RankingItemsGetter {
    constructor(
        private config: RoundNumberConfig,
        private gameStates: number
    ) {
    }

    static getIndex(poulePlace: PoulePlace) {
        return poulePlace.getPoule().getNumber() + '-' + poulePlace.getNumber();
    }

    getFormattedItems(poulePlaces: PoulePlace[], games: Game[]): RankingItem[] {
        const items = poulePlaces.map(poulePlace => {
            return new RankingItem(poulePlace.getPoule().getNumber(), poulePlace.getNumber(), poulePlace.getPenaltyPoints());
        });
        games.forEach(game => {
            if ((game.getState() & this.gameStates) === 0) {
                return;
            }
            const finalScore = game.getFinalScore();
            [Game.HOME, Game.AWAY].forEach(homeAway => {
                const points = this.getNrOfPoints(finalScore, game.getScoresMoment(), homeAway);
                const scored = this.getNrOfUnits(finalScore, homeAway, RankingService.SCORED, false);
                const received = this.getNrOfUnits(finalScore, homeAway, RankingService.RECEIVED, false);
                const subScored = this.getNrOfUnits(finalScore, homeAway, RankingService.SCORED, true);
                const subReceived = this.getNrOfUnits(finalScore, homeAway, RankingService.RECEIVED, true);
                const gamePoulePlaces = game.getPoulePlaces(homeAway);
                const homeAwayItems = gamePoulePlaces.map(gamePoulePlace => items[RankingItemsGetter.getIndex(gamePoulePlace.getPoulePlace())]);
                homeAwayItems.forEach(item => {
                    item.addPlayed(1)
                    item.addPoints(points);
                    item.addScored(scored);
                    item.addReceived(received);
                    item.addSubScored(subScored);
                    item.addSubReceived(subReceived);
                });
            });
        });
        return items;
    }

    private getNrOfPoints(finalScore: GameScoreHomeAway, scoresMoment: number, homeAway: boolean): number {
        let points = 0;
        if (finalScore === undefined) {
            return points;
        }
        if (this.getGameScorePart(finalScore, homeAway) > this.getGameScorePart(finalScore, !homeAway)) {
            if (scoresMoment === Game.MOMENT_EXTRATIME) {
                points += this.config.getWinPointsExt();
            } else {
                points += this.config.getWinPoints();
            }
        } else if (this.getGameScorePart(finalScore, homeAway) === this.getGameScorePart(finalScore, !homeAway)) {
            if (scoresMoment === Game.MOMENT_EXTRATIME) {
                points += this.config.getDrawPointsExt();
            } else {
                points += this.config.getDrawPoints();
            }
        }
    }

    private getNrOfUnits(finalScore: GameScoreHomeAway, homeAway: boolean, scoredReceived: number, sub: boolean): number {
        if (finalScore === undefined) {
            return 0;
        }
        return this.getGameScorePart(finalScore, scoredReceived === RankingService.SCORED ? homeAway : !homeAway);
    }

    private getGameScorePart(gameScoreHomeAway: GameScoreHomeAway, homeAway: boolean): number {
        return homeAway === Game.HOME ? gameScoreHomeAway.getHome() : gameScoreHomeAway.getAway();
    }
}