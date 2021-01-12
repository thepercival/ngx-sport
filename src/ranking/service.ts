import { PlaceLocation } from '../place/location';
import { Poule } from '../poule';
import { HorizontalPoule } from '../poule/horizontal';
import { Place } from '../place';
import { RankedRoundItem } from './item';
import { AgainstRankingServiceHelper } from './service/against';
import { TogetherRankingServiceHelper } from './service/together';
import { GameMode } from '../planning/gameMode';

/* eslint:disable:no-bitwise */

export class RankingService {

    private helper: AgainstRankingServiceHelper | TogetherRankingServiceHelper;

    constructor(
        gameMode: GameMode,
        rulesSet: number,
        gameStates?: number
    ) {
        if (gameMode === GameMode.Against) {
            this.helper = new AgainstRankingServiceHelper(rulesSet, gameStates);
        }
        this.helper = new TogetherRankingServiceHelper(gameStates);
    }

    getRuleDescriptions() {
        return this.helper.getRuleDescriptions();
    }

    getItemsForPoule(poule: Poule): RankedRoundItem[] {
        return this.helper.getItemsForPoule(poule);
    }

    getPlaceLocationsForHorizontalPoule(horizontalPoule: HorizontalPoule): PlaceLocation[] {
        return this.helper.getPlaceLocationsForHorizontalPoule(horizontalPoule);
    }

    getPlacesForHorizontalPoule(horizontalPoule: HorizontalPoule): Place[] {
        return this.helper.getPlacesForHorizontalPoule(horizontalPoule);
    }

    getItemsForHorizontalPoule(horizontalPoule: HorizontalPoule, checkOnSingleQualifyRule?: boolean): RankedRoundItem[] {
        return this.helper.getItemsForHorizontalPoule(horizontalPoule, checkOnSingleQualifyRule);
    }

    getItemByRank(rankingItems: RankedRoundItem[], rank: number): RankedRoundItem | undefined {
        return this.helper.getItemByRank(rankingItems, rank);
    }
}

interface RankedRoundItemMap {
    [key: number]: RankedRoundItem[];
}
