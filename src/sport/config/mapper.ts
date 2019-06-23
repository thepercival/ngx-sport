import { Injectable } from '@angular/core';

import { SportConfigSupplier } from './supplier';
import { SportConfig } from '../config';
import { TheCache } from '../../cache';
import { JsonSportConfigScore, SportConfigScoreMapper } from './score/mapper';

@Injectable()
export class SportConfigMapper {
    constructor(private scoreConfigMapper: SportConfigScoreMapper) { }

    toObject(json: JsonSportConfig, supplier: SportConfigSupplier, config?: SportConfig): SportConfig {
        if (config === undefined) {
            const sport = TheCache.sports[json.sportId];
            config = new SportConfig( sport, supplier);
        }
        config.setId(json.id);
        config.setQualifyRule(json.qualifyRule);
        config.setWinPoints(json.winPoints);
        config.setDrawPoints(json.drawPoints);
        config.setWinPointsExt(json.winPointsExt);
        config.setDrawPointsExt(json.drawPointsExt);
        config.setScore(this.scoreConfigMapper.toObject(json.score, config));
        config.setPointsCalculation(json.pointsCalculation);
        return config;
    }

    toJson(config: SportConfig): JsonSportConfig {
        return {
            id: config.getId(),
            sportId: config.getSport().getId(),
            qualifyRule: config.getQualifyRule(),
            winPoints: config.getWinPoints(),
            drawPoints: config.getDrawPoints(),
            winPointsExt: config.getWinPointsExt(),
            drawPointsExt: config.getDrawPointsExt(),
            score: this.scoreConfigMapper.toJson(config.getScore()),
            pointsCalculation: config.getPointsCalculation(),
        };
    }
}

export interface JsonSportConfig {
    id?: number;
    sportId: number;
    qualifyRule: number;
    winPoints: number;
    drawPoints: number;
    winPointsExt: number;
    drawPointsExt: number;
    score: JsonSportConfigScore;
    pointsCalculation: number;
}
