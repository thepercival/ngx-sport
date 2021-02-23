
import { AgainstScoreHelper } from '../../score/againstHelper';
import { AgainstScore } from '../../score/against';
import { RankingItemsGetter } from '../itemsgetter';
import { AgainstGame, HomeOrAway } from '../../game/against';
import { Round } from '../../qualify/group';
import { Place } from '../../place';
import { UnrankedRoundItem } from '../item';
import { Game } from '../../game';

/* eslint:disable:no-bitwise */

export class RankingItemsGetterAgainst extends RankingItemsGetter {

    constructor(round: Round, gameStates: number) {
        super(round, gameStates);
    }

    getUnrankedItems(places: Place[], games: AgainstGame[]): UnrankedRoundItem[] {
        const items = places.map(place => {
            return new UnrankedRoundItem(this.round, place, place.getPenaltyPoints());
        });
        games.forEach((game: AgainstGame) => {
            if ((game.getState() & this.gameStates) === 0) {
                return;
            }
            const useSubScore = game.getScoreConfig()?.useSubScore();
            const finalScore = this.scoreConfigService.getFinalAgainstScore(game, useSubScore);
            if (!finalScore) {
                return;
            }
            let finalSubScore: AgainstScoreHelper | undefined;
            if (useSubScore) {
                finalSubScore = this.scoreConfigService.getFinalAgainstSubScore(game);
            }
            [AgainstGame.Home, AgainstGame.Away].forEach(homeAway => {
                const points = this.getNrOfPoints(finalScore, homeAway, game);
                const scored = this.getNrOfUnits(finalScore, homeAway, AgainstScore.SCORED);
                const received = this.getNrOfUnits(finalScore, homeAway, AgainstScore.RECEIVED);
                let subScored = 0;
                let subReceived = 0;
                if (finalSubScore) {
                    subScored = this.getNrOfUnits(finalSubScore, homeAway, AgainstScore.SCORED);
                    subReceived = this.getNrOfUnits(finalSubScore, homeAway, AgainstScore.RECEIVED);
                }
                game.getHomeAwayPlaces(homeAway).forEach(gamePlace => {
                    const item = items.find(itIt => itIt.getPlaceLocation().getPlaceNr() === gamePlace.getPlace().getPlaceNr()
                        && itIt.getPlaceLocation().getPouleNr() === gamePlace.getPlace().getPouleNr());
                    if (item === undefined) {
                        return;
                    }
                    item.addGame();
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

    private getNrOfPoints(finalScore: AgainstScoreHelper, homeAway: HomeOrAway, game: AgainstGame): number {
        if (finalScore === undefined) {
            return 0;
        }
        const qualifyAgainstConfig = game.getQualifyAgainstConfig();
        if (qualifyAgainstConfig === undefined) {
            return 0;
        }
        if (finalScore.getResult(homeAway) === AgainstGame.Result_Win) {
            if (game.getFinalPhase() === Game.Phase_RegularTime) {
                return qualifyAgainstConfig.getWinPoints();
            } else if (game.getFinalPhase() === Game.Phase_ExtraTime) {
                return qualifyAgainstConfig.getWinPointsExt();
            }
        } else if (finalScore.getResult(homeAway) === AgainstGame.Result_Draw) {
            if (game.getFinalPhase() === Game.Phase_RegularTime) {
                return qualifyAgainstConfig.getDrawPoints();
            } else if (game.getFinalPhase() === Game.Phase_ExtraTime) {
                return qualifyAgainstConfig.getDrawPointsExt();
            }
        } else if (game.getFinalPhase() === Game.Phase_ExtraTime) {
            return qualifyAgainstConfig.getLosePointsExt();
        }
        return 0;
    }

    private getNrOfUnits(finalScore: AgainstScoreHelper, homeAway: HomeOrAway, scoredReceived: number): number {
        if (finalScore === undefined) {
            return 0;
        }
        const opposite = homeAway === AgainstGame.Home ? AgainstGame.Away : AgainstGame.Home;
        return this.getGameScorePart(finalScore, scoredReceived === AgainstScore.SCORED ? homeAway : opposite);
    }

    private getGameScorePart(againstScore: AgainstScoreHelper, homeAway: HomeOrAway): number {
        return homeAway === AgainstGame.Home ? againstScore.getHome() : againstScore.getAway();
    }
}
