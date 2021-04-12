
import { AgainstScoreHelper } from '../../../score/againstHelper';
import { AgainstScore } from '../../../score/against';
import { PlaceSportPerformanceCalculator } from '../calculator';
import { AgainstGame } from '../../../game/against';
import { Round } from '../../../qualify/group';
import { Place } from '../../../place';
import { Game } from '../../../game';
import { AgainstSide } from '../../../against/side';
import { AgainstGamePlace } from '../../../game/place/against';
import { AgainstResult } from '../../../against/result';
import { CompetitionSport } from '../../../competition/sport';
import { PlaceSportPerformance } from '../../sportPerformance';

export class PlaceAgainstSportPerformanceCalculator extends PlaceSportPerformanceCalculator {

    constructor(round: Round, competitionSport: CompetitionSport) {
        super(round, competitionSport);
    }

    getPerformances(places: Place[], games: AgainstGame[]): PlaceSportPerformance[] {
        const performances = this.createPerformances(places);
        const performanceMap = this.getPerformanceMap(performances);
        const useSubScore = this.round.getValidScoreConfig(this.competitionSport).useSubScore();
        (<AgainstGame[]>this.getFilteredGames(games)).forEach((game: AgainstGame) => {
            const finalScore = this.scoreConfigService.getFinalAgainstScore(game, useSubScore);
            if (!finalScore) {
                return;
            }
            let finalSubScore: AgainstScoreHelper | undefined;
            if (useSubScore) {
                finalSubScore = this.scoreConfigService.getFinalAgainstSubScore(game);
            }
            [AgainstSide.Home, AgainstSide.Away].forEach((side: AgainstSide) => {
                const points = this.getNrOfPoints(finalScore, side, game);
                const scored = this.getNrOfUnits(finalScore, side, AgainstScore.SCORED);
                const received = this.getNrOfUnits(finalScore, side, AgainstScore.RECEIVED);
                let subScored = 0;
                let subReceived = 0;
                if (finalSubScore) {
                    subScored = this.getNrOfUnits(finalSubScore, side, AgainstScore.SCORED);
                    subReceived = this.getNrOfUnits(finalSubScore, side, AgainstScore.RECEIVED);
                }
                game.getSidePlaces(side).forEach((gamePlace: AgainstGamePlace) => {
                    const performance = performanceMap[gamePlace.getPlace().getRoundLocationId()];
                    if (performance === undefined) {
                        return;
                    }
                    performance.addGame();
                    performance.addPoints(points);
                    performance.addScored(scored);
                    performance.addReceived(received);
                    performance.addSubScored(subScored);
                    performance.addSubReceived(subReceived);
                });
            });
        });
        return performances;
    }

    private getNrOfPoints(finalScore: AgainstScoreHelper, side: AgainstSide, game: AgainstGame): number {
        if (finalScore === undefined) {
            return 0;
        }
        const qualifyAgainstConfig = game.getQualifyAgainstConfig();
        if (qualifyAgainstConfig === undefined) {
            return 0;
        }
        if (finalScore.getResult(side) === AgainstResult.Win) {
            if (game.getFinalPhase() === Game.Phase_RegularTime) {
                return qualifyAgainstConfig.getWinPoints();
            } else if (game.getFinalPhase() === Game.Phase_ExtraTime) {
                return qualifyAgainstConfig.getWinPointsExt();
            }
        } else if (finalScore.getResult(side) === AgainstResult.Draw) {
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

    private getNrOfUnits(finalScore: AgainstScoreHelper, side: AgainstSide, scoredReceived: number): number {
        if (finalScore === undefined) {
            return 0;
        }
        const opposite = side === AgainstSide.Home ? AgainstSide.Away : AgainstSide.Home;
        return this.getGameScorePart(finalScore, scoredReceived === AgainstScore.SCORED ? side : opposite);
    }

    private getGameScorePart(againstScore: AgainstScoreHelper, side: AgainstSide): number {
        return side === AgainstSide.Home ? againstScore.getHome() : againstScore.getAway();
    }
}