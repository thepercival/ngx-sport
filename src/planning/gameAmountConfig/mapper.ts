import { Injectable } from '@angular/core';
import { CompetitionSportMapper } from '../../competition/sport/mapper';

import { RoundNumber } from '../../round/number';
import { GameAmountConfig } from '../gameAmountConfig';
import { JsonGameAmountConfig } from './json';
@Injectable({
    providedIn: 'root'
})
export class GameAmountConfigMapper {
    constructor(private competitionSportMapper: CompetitionSportMapper) { }

    toObject(json: JsonGameAmountConfig, roundNumber: RoundNumber, config?: GameAmountConfig): GameAmountConfig {
        if (config === undefined) {
            const competitionSport = this.competitionSportMapper.toObject(json.competitionSport, roundNumber.getCompetition());
            const newConfig = new GameAmountConfig(competitionSport, roundNumber, json.amount, json.nrOfGamesPerPlaceMixed);
            config = newConfig;
        }
        config.setId(json.id);
        config.setAmount(json.amount);
        config.setNrOfGamesPerPlaceMixed(json.nrOfGamesPerPlaceMixed);
        return config;
    }

    toJson(config: GameAmountConfig): JsonGameAmountConfig {
        return {
            id: config.getId(),
            competitionSport: this.competitionSportMapper.toJson(config.getCompetitionSport()),
            amount: config.getAmount(),
            nrOfGamesPerPlaceMixed: config.getNrOfGamesPerPlaceMixed()
        };
    }
}
