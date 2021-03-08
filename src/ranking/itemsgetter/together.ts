

import { RankingItemsGetter } from '../itemsgetter';
import { TogetherGame } from '../../game/together';
import { Round } from '../../qualify/group';
import { Place } from '../../place';
import { TogetherGamePlace } from '../../game/place/together';
import { UnrankedRoundItem } from '../item/round/unranked';

export class RankingItemsGetterTogether extends RankingItemsGetter {

    constructor(round: Round) {
        super(round);
    }

    getUnrankedItems(places: Place[], games: TogetherGame[]): UnrankedRoundItem[] {
        const items = places.map(place => {
            return new UnrankedRoundItem(this.round, place, place.getPenaltyPoints());
        });
        games.forEach((game: TogetherGame) => {
            const useSubScore = game.getScoreConfig().useSubScore();
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
