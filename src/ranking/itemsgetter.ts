import { Round } from '../qualify/group';
import { Place } from '../place';

import { ScoreConfigService } from '../score/config/service';

export abstract class RankingItemsGetter {
    protected scoreConfigService: ScoreConfigService;

    constructor(
        protected round: Round,
        protected gameStates: number
    ) {
        this.scoreConfigService = new ScoreConfigService();
    }

    static getIndex(place: Place): string {
        return place.getPoule().getNumber() + '-' + place.getNumber();
    }
}
