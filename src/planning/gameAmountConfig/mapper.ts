import { Injectable } from '@angular/core';
import { CompetitionSportMapper } from 'src/competition/sport/mapper';

import { RoundNumber } from '../../round/number';
import { GameAmountConfig } from '../gameAmountConfig';
import { JsonGameAmountConfig } from './json';
@Injectable({
    providedIn: 'root'
})
export class PlanningConfigMapper {
    constructor(private competitionSportMapper: CompetitionSportMapper) { }

    toObject(json: JsonGameAmountConfig, roundNumber: RoundNumber, config?: GameAmountConfig): GameAmountConfig {
        if (config === undefined) {
            const competitionSport = this.competitionSportMapper.toObject(json.competitionSport, roundNumber.getCompetition());
            const newConfig = new GameAmountConfig(competitionSport, roundNumber, json.amount);
            config = newConfig;
        }
        config.setId(json.id);
        config.setAmount(json.amount);
        return config;
    }

    toJson(config: GameAmountConfig): JsonGameAmountConfig {
        return {
            id: config.getId(),
            competitionSport: this.competitionSportMapper.toJson(config.getCompetitionSport()),
            amount: config.getAmount()
        };
    }
}
