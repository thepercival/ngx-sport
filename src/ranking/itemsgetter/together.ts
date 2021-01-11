
import { AgainstScoreHelper } from 'src/score/againstHelper';
import { AgainstScore } from 'src/score/against';
import { RankingItemsGetter } from '../itemsgetter';
import { TogetherGame } from 'src/game/together';
import { AgainstGame } from 'src/game/against';
import { Round } from 'src/qualify/group';
import { Place } from 'src/place';
import { UnrankedRoundItem } from '../item';
import { Game } from 'src/game';
import { TogetherGamePlace } from 'src/game/place/together';

/* eslint:disable:no-bitwise */

export class RankingItemsGetterTogether extends RankingItemsGetter {

    constructor(round: Round, gameStates: number) {
        super(round, gameStates);
    }

    getUnrankedItems(places: Place[], games: TogetherGame[]): UnrankedRoundItem[] {
        const items = places.map(place => {
            return new UnrankedRoundItem(this.round, place, place.getPenaltyPoints());
        });
        games.forEach((game: TogetherGame) => {
            if ((game.getState() & this.gameStates) === 0) {
                return;
            }
            const useSubScore = game.getScoreConfig()?.useSubScore();
            game.getTogetherPlaces().forEach((gamePlace: TogetherGamePlace) => {
                const finalScore = this.scoreConfigService.getFinalTogetherScore(gamePlace, useSubScore);
                if (!finalScore) {
                    return;
                }
                const item = items.find(itIt => itIt.getPlaceLocation().getPlaceNr() === gamePlace.getPlace().getPlaceNr()
                    && itIt.getPlaceLocation().getPouleNr() === gamePlace.getPlace().getPouleNr());
                if (item === undefined) {
                    return;
                }
                item.addGame();
                item.addPoints(finalScore);
                item.addScored(finalScore);
                if (useSubScore) {
                    item.addSubScored(this.scoreConfigService.getFinalTogetherSubScore(gamePlace));
                }

            });

        });
        return items;
    }
}
