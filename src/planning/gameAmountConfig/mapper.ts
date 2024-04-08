import { Injectable } from '@angular/core';

import { RoundNumber } from '../../round/number';
import { GameAmountConfig } from '../gameAmountConfig';
import { JsonGameAmountConfig } from './json';
@Injectable({
    providedIn: 'root'
})
export class GameAmountConfigMapper {
    constructor() { }

    toObject(json: JsonGameAmountConfig, roundNumber: RoundNumber, config?: GameAmountConfig): GameAmountConfig {
        if (config === undefined) {
            const competitionSport = roundNumber.getCompetition().getSportById(json.competitionSportId);
            if (competitionSport === undefined) {
                throw new Error('competitionSport could not be found');
            }
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
            competitionSportId: config.getCompetitionSport().getId(),
            amount: config.getAmount()
        };
    }
}
