import { Round } from '../qualify/group';
import { Place } from '../place';

import { ScoreConfigService } from '../score/config/service';
import { CompetitionSport } from '../competition/sport';
import { TogetherGame } from '../game/together';
import { AgainstGame } from '../game/against';
import { UnrankedSportRoundItem } from './item/round/sportunranked';

export abstract class RankingItemsGetter {
    protected scoreConfigService: ScoreConfigService;

    constructor(
        protected round: Round,
        protected competitionSport: CompetitionSport
    ) {
        this.scoreConfigService = new ScoreConfigService();
    }

    static getIndex(place: Place): string {
        return place.getPoule().getNumber() + '-' + place.getNumber();
    }

    protected getFilteredGames(games: (AgainstGame | TogetherGame)[]): (AgainstGame | TogetherGame)[] {
        return games.filter((game: AgainstGame | TogetherGame) => this.competitionSport === game.getCompetitionSport());
    }

    protected getUnrankedMap(unrankedItems: UnrankedSportRoundItem[]): UnrankedSportRoundItemMap {
        const map: UnrankedSportRoundItemMap = {};
        unrankedItems.forEach((unrankedItem: UnrankedSportRoundItem) => map[unrankedItem.getPlaceLocation().getNewLocationId()] = unrankedItem);
        return map;
    }
}

interface UnrankedSportRoundItemMap {
    [key: string]: UnrankedSportRoundItem;
}
