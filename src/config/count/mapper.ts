import { Injectable } from '@angular/core';

import { CountConfigSupplier } from '../supplier';
import { TheCache } from '../../cache';
import { CountConfig } from '../count';
import { JsonConfigScore, ConfigScoreMapper } from './score/mapper';

@Injectable()
export class CountConfigMapper {
    constructor(private scoreConfigMapper: ConfigScoreMapper) { }

    toObject(json: JsonCountConfig, supplier: CountConfigSupplier, config?: CountConfig): CountConfig {
        if (config === undefined) {
            const sport = TheCache.sports[json.sportName];
            config = new CountConfig( sport, supplier);
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

    toJson(config: CountConfig): JsonCountConfig {
        return {
            id: config.getId(),
            sportName: config.getSport().getName(),
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

export interface JsonCountConfig {
    id?: number;
    sportName: string;
    qualifyRule: number;
    winPoints: number;
    drawPoints: number;
    winPointsExt: number;
    drawPointsExt: number;
    score: JsonConfigScore;
    pointsCalculation: number;
}
