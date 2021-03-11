import { PlaceLocation } from '../../../place/location';
import { Place } from '../../../place';
import { UnrankedSportRoundItem } from './sportunranked';
import { CompetitionSport } from '../../../competition/sport';
import { Round } from '../../../qualify/group';

export class RankedSportRoundItem {
    constructor(private unranked: UnrankedSportRoundItem, private uniqueRank: number, private rank: number
    ) {
    }

    getUniqueRank(): number {
        return this.uniqueRank;
    }

    getRank(): number {
        return this.rank;
    }

    getCompetitionSport(): CompetitionSport {
        return this.unranked.getCompetitionSport();
    }

    getPlaceLocation(): PlaceLocation {
        return this.unranked.getPlaceLocation();
    }

    getUnranked(): UnrankedSportRoundItem {
        return this.unranked;
    }


}

