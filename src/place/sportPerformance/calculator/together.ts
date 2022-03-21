
import { TogetherGame } from '../../../game/together';
import { Round } from '../../../qualify/group';
import { Place } from '../../../place';
import { TogetherGamePlace } from '../../../game/place/together';
import { CompetitionSport } from '../../../competition/sport';
import { PlaceSportPerformance } from '../../sportPerformance';
import { PlaceSportPerformanceCalculator } from '../calculator';

export class PlaceTogetherSportPerformanceCalculator extends PlaceSportPerformanceCalculator {

    constructor(round: Round, competitionSport: CompetitionSport) {
        super(round, competitionSport);
    }

    getPerformances(places: Place[], games: TogetherGame[]): PlaceSportPerformance[] {
        const performances = this.createPerformances(places);
        const performanceMap = this.getPerformanceMap(performances);
        const useSubScore = this.round.getValidScoreConfig(this.competitionSport).useSubScore();
        (<TogetherGame[]>this.getFilteredGames(games)).forEach((game: TogetherGame) => {
            game.getTogetherPlaces().forEach((gamePlace: TogetherGamePlace) => {
                const finalScore = this.scoreConfigService.getFinalTogetherScore(gamePlace, useSubScore);
                if (!finalScore) {
                    return;
                }
                const performance = performanceMap[gamePlace.getPlace().getRoundLocationId()];
                if (performance === undefined) {
                    return;
                }
                performance.addGames(1);
                performance.addPoints(finalScore);
                performance.addScored(finalScore);
                if (useSubScore) {
                    performance.addSubScored(this.scoreConfigService.getFinalTogetherSubScore(gamePlace));
                }
            });

        });
        return performances;
    }
}
