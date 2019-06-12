import { Game } from '../game';
import { GameScore } from '../game/score';
import { GameScoreHomeAway } from '../game/score/homeaway';
import { Place } from '../place';
import { Round } from '../round';
import { UnrankedRoundItem } from './item';

/* tslint:disable:no-bitwise */

export class RankingItemsGetter {
    constructor(
        private round: Round,
        private gameStates: number
    ) {
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
            const finalScore = game.getFinalScore();
            [Game.HOME, Game.AWAY].forEach(homeAway => {
                const points = this.getNrOfPoints(finalScore, game.getScoresMoment(), homeAway);
                const scored = this.getNrOfUnits(finalScore, homeAway, GameScore.SCORED, false);
                const received = this.getNrOfUnits(finalScore, homeAway, GameScore.RECEIVED, false);
                const subScored = this.getNrOfUnits(finalScore, homeAway, GameScore.SCORED, true);
                const subReceived = this.getNrOfUnits(finalScore, homeAway, GameScore.RECEIVED, true);
                game.getPlaces(homeAway).forEach(gamePlace => {
                    const item = items.find(itIt => itIt.getPlaceLocation().getPlaceNr() === gamePlace.getPlace().getLocation().getPlaceNr()
                        && itIt.getPlaceLocation().getPouleNr() === gamePlace.getPlace().getLocation().getPouleNr());
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

    private getNrOfPoints(finalScore: GameScoreHomeAway, scoresMoment: number, homeAway: boolean): number {
        let points = 0;
        if (finalScore === undefined) {
            return points;
        }
        const config = this.round.getNumber().getConfig();
        if (this.getGameScorePart(finalScore, homeAway) > this.getGameScorePart(finalScore, !homeAway)) {
            if (scoresMoment === Game.MOMENT_EXTRATIME) {
                points += config.getWinPointsExt();
            } else {
                points += config.getWinPoints();
            }
        } else if (this.getGameScorePart(finalScore, homeAway) === this.getGameScorePart(finalScore, !homeAway)) {
            if (scoresMoment === Game.MOMENT_EXTRATIME) {
                points += config.getDrawPointsExt();
            } else {
                points += config.getDrawPoints();
            }
        }
        return points;
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