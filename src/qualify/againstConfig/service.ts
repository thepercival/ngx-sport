import { Injectable } from '@angular/core';

import { RoundNumber } from '../../round/number';
import { CompetitionSport } from 'src/competition/sport';
import { QualifyAgainstConfig } from '../againstConfig';
import { JsonQualifyAgainstConfig } from './json';
import { Sport } from 'src/sport';
import { SportCustom } from 'src/sport/custom';
import { CompetitionSportMapper } from 'src/competition/sport/mapper';
import { Round } from '../group';
import { QualifyAgainstConfigMapper } from './mapper';

@Injectable({
    providedIn: 'root'
})
export class QualifyAgainstConfigService {

    constructor(private competitionSportMapper: CompetitionSportMapper,
        private qualifyAgainstConfigMapper: QualifyAgainstConfigMapper) {
    }

    createDefaultJson(competitionSport: CompetitionSport): JsonQualifyAgainstConfig {
        const sport = competitionSport.getSport();
        return {
            id: 0,
            competitionSport: this.competitionSportMapper.toJson(competitionSport),
            winPoints: this.getDefaultWinPoints(sport),
            drawPoints: this.getDefaultDrawPoints(sport),
            winPointsExt: this.getDefaultWinPointsExt(sport),
            drawPointsExt: this.getDefaultDrawPointsExt(sport),
            losePointsExt: this.getDefaultLosePointsExt(sport),
            pointsCalculation: QualifyAgainstConfig.Points_Calc_GamePoints
        };
    }

    createDefault(competitionSport: CompetitionSport, round: Round): QualifyAgainstConfig {
        return this.qualifyAgainstConfigMapper.toObject(this.createDefaultJson(competitionSport), round);
    }

    copy(competitionSport: CompetitionSport, round: Round, sourceConfig: QualifyAgainstConfig): QualifyAgainstConfig {
        const config = new QualifyAgainstConfig(competitionSport, round);
        config.setWinPoints(sourceConfig.getWinPoints());
        config.setDrawPoints(sourceConfig.getDrawPoints());
        config.setWinPointsExt(sourceConfig.getWinPointsExt());
        config.setDrawPointsExt(sourceConfig.getDrawPointsExt());
        config.setLosePointsExt(sourceConfig.getLosePointsExt());
        config.setPointsCalculation(sourceConfig.getPointsCalculation());
        return config;
    }

    protected getDefaultWinPoints(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? QualifyAgainstConfig.Default_WinPoints : 1;
    }

    protected getDefaultDrawPoints(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? QualifyAgainstConfig.Default_DrawPoints : 0.5;
    }

    protected getDefaultWinPointsExt(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? QualifyAgainstConfig.Default_WinPointsExt : 1;
    }

    protected getDefaultDrawPointsExt(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? QualifyAgainstConfig.Default_DrawPointsExt : 0.5;
    }

    protected getDefaultLosePointsExt(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.IceHockey ? QualifyAgainstConfig.Default_LosePointsExt : 1;
    }
}
