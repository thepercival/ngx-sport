

import { RankingItemsGetter } from '../itemsgetter';
import { TogetherGame } from '../../game/together';
import { Round } from '../../qualify/group';
import { Place } from '../../place';
import { TogetherGamePlace } from '../../game/place/together';
import { CompetitionSport } from '../../competition/sport';
import { UnrankedSportRoundItem } from '../item/round/sportunranked';

export class RankingItemsGetterTogether extends RankingItemsGetter {

    constructor(round: Round, competitionSport: CompetitionSport) {
        super(round, competitionSport);
    }

    getUnrankedItems(places: Place[], games: TogetherGame[]): UnrankedSportRoundItem[] {
        const unrankedItems = places.map((place: Place): UnrankedSportRoundItem => {
            return new UnrankedSportRoundItem(this.competitionSport, place, place.getPenaltyPoints());
        });
        const unrankedMap = this.getUnrankedMap(unrankedItems);
        const useSubScore = this.round.getValidScoreConfig(this.competitionSport).useSubScore();
        (<TogetherGame[]>this.getFilteredGames(games)).forEach((game: TogetherGame) => {
            game.getTogetherPlaces().forEach((gamePlace: TogetherGamePlace) => {
                const finalScore = this.scoreConfigService.getFinalTogetherScore(gamePlace, useSubScore);
                if (!finalScore) {
                    return;
                }
                const unrankedItem = unrankedMap[gamePlace.getPlace().getNewLocationId()];
                if (unrankedItem === undefined) {
                    return;
                }
                unrankedItem.addGame();
                unrankedItem.addPoints(finalScore);
                unrankedItem.addScored(finalScore);
                if (useSubScore) {
                    unrankedItem.addSubScored(this.scoreConfigService.getFinalTogetherSubScore(gamePlace));
                }
            });

        });
        return unrankedItems;
    }
}
