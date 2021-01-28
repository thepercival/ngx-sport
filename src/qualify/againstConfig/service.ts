import { Injectable } from '@angular/core';

import { CompetitionSport } from '../../competition/sport';
import { QualifyAgainstConfig } from '../againstConfig';
import { Sport } from '../../sport';
import { SportCustom } from '../../sport/custom';
import { Round } from '../group';
import { PointsCalculation } from '../../ranking/pointsCalculation';
import { GameMode } from '../../planning/gameMode';

@Injectable({
    providedIn: 'root'
})
export class QualifyAgainstConfigService {

    constructor(/*private competitionSportMapper: CompetitionSportMapper,
        private qualifyAgainstConfigMapper: QualifyAgainstConfigMapper*/) {
    }

    // createDefaultJson(competitionSport: CompetitionSport): JsonQualifyAgainstConfig {
    //     const sport = competitionSport.getSport();
    //     return {
    //         id: 0,
    //         competitionSport: this.competitionSportMapper.toJson(competitionSport),
    //         winPoints: this.getDefaultWinPoints(sport),
    //         drawPoints: this.getDefaultDrawPoints(sport),
    //         winPointsExt: this.getDefaultWinPointsExt(sport),
    //         drawPointsExt: this.getDefaultDrawPointsExt(sport),
    //         losePointsExt: this.getDefaultLosePointsExt(sport),
    //         pointsCalculation: PointsCalculationType.AgainstGamePoints
    //     };
    // }

    createDefault(competitionSport: CompetitionSport, round: Round): QualifyAgainstConfig {
        const config = new QualifyAgainstConfig(competitionSport, round, this.getDefaultPointCalculation(round));
        const sport = competitionSport.getSport();
        config.setWinPoints(this.getDefaultWinPoints(sport));
        config.setDrawPoints(this.getDefaultDrawPoints(sport));
        config.setWinPointsExt(this.getDefaultWinPointsExt(sport));
        config.setDrawPointsExt(this.getDefaultDrawPointsExt(sport));
        config.setLosePointsExt(this.getDefaultLosePointsExt(sport));
        return config;
    }

    copy(competitionSport: CompetitionSport, round: Round, sourceConfig: QualifyAgainstConfig): QualifyAgainstConfig {
        const config = new QualifyAgainstConfig(competitionSport, round, sourceConfig.getPointsCalculation());
        config.setWinPoints(sourceConfig.getWinPoints());
        config.setDrawPoints(sourceConfig.getDrawPoints());
        config.setWinPointsExt(sourceConfig.getWinPointsExt());
        config.setDrawPointsExt(sourceConfig.getDrawPointsExt());
        config.setLosePointsExt(sourceConfig.getLosePointsExt());
        return config;
    }

    getDefaultPointCalculation(round: Round): PointsCalculation {
        if (round.getNumber().getValidPlanningConfig().getGameMode() === GameMode.Against) {
            return PointsCalculation.AgainstGamePoints;
        }
        return PointsCalculation.Scores;
    }

    getDefaultWinPoints(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? QualifyAgainstConfig.Default_WinPoints : 1;
    }

    getDefaultDrawPoints(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? QualifyAgainstConfig.Default_DrawPoints : 0.5;
    }

    getDefaultWinPointsExt(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? QualifyAgainstConfig.Default_WinPointsExt : 1;
    }

    getDefaultDrawPointsExt(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? QualifyAgainstConfig.Default_DrawPointsExt : 0.5;
    }

    getDefaultLosePointsExt(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.IceHockey ? QualifyAgainstConfig.Default_LosePointsExt : 1;
    }
}
