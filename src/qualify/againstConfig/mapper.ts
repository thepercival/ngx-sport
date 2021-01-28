import { Injectable } from '@angular/core';

import { JsonQualifyAgainstConfig } from './json';
import { Round } from '../group';
import { CompetitionSportMapper } from '../../competition/sport/mapper';
import { QualifyAgainstConfig } from '../againstConfig';

@Injectable({
    providedIn: 'root'
})
export class QualifyAgainstConfigMapper {
    constructor(private competitionSportMapper: CompetitionSportMapper) { }

    toObject(json: JsonQualifyAgainstConfig, round: Round, qualifyAgainstConfig?: QualifyAgainstConfig): QualifyAgainstConfig {
        if (qualifyAgainstConfig === undefined) {
            const competitionSport = this.competitionSportMapper.toObject(json.competitionSport, round.getCompetition());
            qualifyAgainstConfig = new QualifyAgainstConfig(competitionSport, round, json.pointsCalculation);
        }
        qualifyAgainstConfig.setId(json.id);
        qualifyAgainstConfig.setWinPoints(json.winPoints);
        qualifyAgainstConfig.setDrawPoints(json.drawPoints);
        qualifyAgainstConfig.setWinPointsExt(json.winPointsExt);
        qualifyAgainstConfig.setDrawPointsExt(json.drawPointsExt);
        qualifyAgainstConfig.setLosePointsExt(json.losePointsExt);
        return qualifyAgainstConfig;
    }

    toJson(config: QualifyAgainstConfig): JsonQualifyAgainstConfig {
        return {
            id: config.getId(),
            competitionSport: this.competitionSportMapper.toJson(config.getCompetitionSport()),
            winPoints: config.getWinPoints(),
            drawPoints: config.getDrawPoints(),
            winPointsExt: config.getWinPointsExt(),
            drawPointsExt: config.getDrawPointsExt(),
            losePointsExt: config.getLosePointsExt(),
            pointsCalculation: config.getPointsCalculation()
        };
    }
}
