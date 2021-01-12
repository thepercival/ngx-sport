import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { PlanningConfigMapper } from '../../planning/config/mapper';
import { RoundNumber } from '../number';
import { JsonRoundNumber } from './json';
import { GameAmountConfigMapper } from '../../planning/gameAmountConfig/mapper';

@Injectable({
    providedIn: 'root'
})
export class RoundNumberMapper {
    constructor(
        private planningConfigMapper: PlanningConfigMapper,
        private gameAmountConfigMapper: GameAmountConfigMapper
    ) { }

    toObject(json: JsonRoundNumber, competition: Competition, previousRoundNumber?: RoundNumber): RoundNumber {
        const roundNumber = previousRoundNumber === undefined ? new RoundNumber(competition) : previousRoundNumber.createNext();
        roundNumber.setId(json.id);
        roundNumber.setHasPlanning(json.hasPlanning);

        if (json.planningConfig !== undefined) {
            this.planningConfigMapper.toObject(json.planningConfig, roundNumber);
        }
        if (json.gameAmountConfigs) {
            json.gameAmountConfigs.forEach(jsonGameAmountConfig => {
                this.gameAmountConfigMapper.toObject(jsonGameAmountConfig, roundNumber);
            });
        }
        if (json.next !== undefined) {
            this.toObject(json.next, competition, roundNumber);
        }
        return roundNumber;
    }

    toJson(roundNumber: RoundNumber): JsonRoundNumber {
        const nextRoundNumber = roundNumber.getNext();
        const planningConfig = roundNumber.getPlanningConfig();
        return {
            id: roundNumber.getId(),
            number: roundNumber.getNumber(),
            planningConfig: planningConfig ? this.planningConfigMapper.toJson(planningConfig) : undefined,
            gameAmountConfigs: roundNumber.getGameAmountConfigs().map(config => this.gameAmountConfigMapper.toJson(config)),
            next: nextRoundNumber ? this.toJson(nextRoundNumber) : undefined,
            hasPlanning: false
        };
    }
}
