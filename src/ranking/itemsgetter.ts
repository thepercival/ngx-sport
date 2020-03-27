import { Game } from '../game';
import { GameScore } from '../game/score';
import { GameScoreHomeAway } from '../game/score/homeaway';
import { Place } from '../place';
import { Round } from '../round';
import { SportScoreConfigService } from '../sport/scoreconfig/service';
import { UnrankedRoundItem } from './item';

/* tslint:disable:no-bitwise */

export class RankingItemsGetter {
    private sportScoreConfigService: SportScoreConfigService;

    constructor(
        private round: Round,
        private gameStates: number
    ) {
        this.sportScoreConfigService = new SportScoreConfigService();
    }

    static getIndex(place: Place): string {
        return place.getPoule().getNumber() + '-' + place.getNumber();
    }

    getUnrankedItems(places: Place[], games: Game[]): UnrankedRoundItem[] {
        const items = places.map(place => {
            return new UnrankedRoundItem(this.round, place.getLocation(), place.getPenaltyPoints());
        });
        games.forEach(game => {
            if ((game.getState() & this.gameStates) === 0) {
                return;
            }
            const finalScore = this.sportScoreConfigService.getFinal(game);
            [Game.HOME, Game.AWAY].forEach(homeAway => {
                const points = this.getNrOfPoints(finalScore, homeAway, game);
                const scored = this.getNrOfUnits(finalScore, homeAway, GameScore.SCORED, false);
                const received = this.getNrOfUnits(finalScore, homeAway, GameScore.RECEIVED, false);
                const subScored = this.getNrOfUnits(finalScore, homeAway, GameScore.SCORED, true);
                const subReceived = this.getNrOfUnits(finalScore, homeAway, GameScore.RECEIVED, true);
                game.getPlaces(homeAway).forEach(gamePlace => {
                    const item = items.find(itIt => itIt.getPlaceLocation().getPlaceNr() === gamePlace.getPlace().getLocation().getPlaceNr()
                        && itIt.getPlaceLocation().getPouleNr() === gamePlace.getPlace().getLocation().getPouleNr());
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

    private getNrOfPoints(finalScore: GameScoreHomeAway, homeAway: boolean, game: Game): number {
        if (finalScore === undefined) {
            return 0;
        }
        if (this.isWin(finalScore, homeAway)) {
            if (game.getFinalPhase() === Game.PHASE_REGULARTIME) {
                return game.getSportConfig().getWinPoints();
            } else if (game.getFinalPhase() === Game.PHASE_EXTRATIME) {
                return game.getSportConfig().getWinPointsExt();
            }
        } else if (this.isDraw(finalScore)) {
            if (game.getFinalPhase() === Game.PHASE_REGULARTIME) {
                return game.getSportConfig().getDrawPoints();
            } else if (game.getFinalPhase() === Game.PHASE_EXTRATIME) {
                return game.getSportConfig().getDrawPointsExt();
            }
        } else if (game.getFinalPhase() === Game.PHASE_EXTRATIME) {
            return game.getSportConfig().getLosePointsExt();
        }
        return 0;
    }

    private isWin(finalScore: GameScoreHomeAway, homeAway: boolean): boolean {
        return (finalScore.getResult() === Game.RESULT_HOME && homeAway === Game.HOME)
            || (finalScore.getResult() === Game.RESULT_AWAY && homeAway === Game.AWAY);
    }

    private isDraw(finalScore: GameScoreHomeAway): boolean {
        return finalScore.getResult() === Game.RESULT_DRAW;
    }

    private getNrOfUnits(finalScore: GameScoreHomeAway, homeAway: boolean, scoredReceived: number, sub: boolean): number {
        if (finalScore === undefined) {
            return 0;
        }
        return this.getGameScorePart(finalScore, scoredReceived === GameScore.SCORED ? homeAway : !homeAway);
    }

    private getGameScorePart(gameScoreHomeAway: GameScoreHomeAway, homeAway: boolean): number {
        return homeAway === Game.HOME ? gameScoreHomeAway.getHome() : gameScoreHomeAway.getAway();
    }
}
