import { Round } from '../../qualify/group';
import { Place } from '../../place';

import { ScoreConfigService } from '../../score/config/service';
import { CompetitionSport } from '../../competition/sport';
import { TogetherGame } from '../../game/together';
import { AgainstGame } from '../../game/against';
import { PlaceSportPerformance } from '../sportPerformance';

export abstract class PlaceSportPerformanceCalculator {
    protected scoreConfigService: ScoreConfigService;

    constructor(
        protected round: Round,
        protected competitionSport: CompetitionSport
    ) {
        this.scoreConfigService = new ScoreConfigService();
    }

    /*static getIndex(place: Place): string {
        return place.getPoule().getNumber() + '-' + place.getNumber();
    }*/

    protected getFilteredGames(games: (AgainstGame | TogetherGame)[]): (AgainstGame | TogetherGame)[] {
        return games.filter((game: AgainstGame | TogetherGame) => this.competitionSport === game.getCompetitionSport());
    }

    protected createPerformances(places: Place[]): PlaceSportPerformance[] {
        return places.map((place: Place): PlaceSportPerformance => {
            return new PlaceSportPerformance(place, this.competitionSport, place.getPenaltyPoints());
        });
    }

    protected getPerformanceMap(performances: PlaceSportPerformance[]): PlaceSportPerformanceMap {
        const map: PlaceSportPerformanceMap = {};
        performances.forEach((performance: PlaceSportPerformance) => map[performance.getPlaceLocation().getRoundLocationId()] = performance);
        return map;
    }
}

export interface PlaceSportPerformanceMap {
    [key: string]: PlaceSportPerformance;
}
