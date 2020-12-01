import { Round } from '../qualify/group';
import { Game } from '../game';
import { GameScore } from '../game/score';
import { GameScoreHomeAway } from '../game/score/homeaway';
import { Place } from '../place';

import { SportScoreConfigService } from '../sport/scoreconfig/service';
import { UnrankedRoundItem } from './item';

/* eslint:disable:no-bitwise */

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
            return new UnrankedRoundItem(this.round, place, place.getPenaltyPoints());
        });
        games.forEach(game => {
            if ((game.getState() & this.gameStates) === 0) {
                return;
            }
            const useSubScore = game.getSportScoreConfig()?.useSubScore();
            const finalScore = this.sportScoreConfigService.getFinalScore(game, useSubScore);
            if (!finalScore) {
                return;
            }
            let finalSubScore: GameScoreHomeAway | undefined;
            if (useSubScore) {
                finalSubScore = this.sportScoreConfigService.getFinalSubScore(game);
            }
            [Game.Home, Game.Away].forEach(homeAway => {
                const points = this.getNrOfPoints(finalScore, homeAway, game);
                const scored = this.getNrOfUnits(finalScore, homeAway, GameScore.SCORED);
                const received = this.getNrOfUnits(finalScore, homeAway, GameScore.RECEIVED);
                let subScored = 0;
                let subReceived = 0;
                if (finalSubScore) {
                    subScored = this.getNrOfUnits(finalSubScore, homeAway, GameScore.SCORED);
                    subReceived = this.getNrOfUnits(finalSubScore, homeAway, GameScore.RECEIVED);
                }
                game.getPlaces(homeAway).forEach(gamePlace => {
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

    private getNrOfPoints(finalScore: GameScoreHomeAway, homeAway: boolean, game: Game): number {
        if (finalScore === undefined) {
            return 0;
        }
        if (finalScore.getResult(homeAway) === Game.Result_Win) {
            if (game.getFinalPhase() === Game.Phase_RegularTime) {
                return game.getSportConfig().getWinPoints();
            } else if (game.getFinalPhase() === Game.Phase_ExtraTime) {
                return game.getSportConfig().getWinPointsExt();
            }
        } else if (finalScore.getResult(homeAway) === Game.Result_Draw) {
            if (game.getFinalPhase() === Game.Phase_RegularTime) {
                return game.getSportConfig().getDrawPoints();
            } else if (game.getFinalPhase() === Game.Phase_ExtraTime) {
                return game.getSportConfig().getDrawPointsExt();
            }
        } else if (game.getFinalPhase() === Game.Phase_ExtraTime) {
            return game.getSportConfig().getLosePointsExt();
        }
        return 0;
    }

    private getNrOfUnits(finalScore: GameScoreHomeAway, homeAway: boolean, scoredReceived: number): number {
        if (finalScore === undefined) {
            return 0;
        }
        return this.getGameScorePart(finalScore, scoredReceived === GameScore.SCORED ? homeAway : !homeAway);
    }

    private getGameScorePart(gameScoreHomeAway: GameScoreHomeAway, homeAway: boolean): number {
        return homeAway === Game.Home ? gameScoreHomeAway.getHome() : gameScoreHomeAway.getAway();
    }
}
