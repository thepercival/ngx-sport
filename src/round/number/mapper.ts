import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { PlanningConfigMapper } from '../../planning/config/mapper';
import { SportScoreConfigMapper } from '../../sport/scoreconfig/mapper';
import { RoundNumber } from '../number';
import { SportMapper } from '../../sport/mapper';
import { JsonRoundNumber } from './json';

@Injectable()
export class RoundNumberMapper {
    constructor(
        private planningConfigMapper: PlanningConfigMapper,
        private sportScoreConfigMapper: SportScoreConfigMapper,
        private sportMapper: SportMapper
    ) { }

    toObject(json: JsonRoundNumber, competition: Competition, previousRoundNumber?: RoundNumber): RoundNumber {
        const roundNumber = previousRoundNumber === undefined ? new RoundNumber(competition) : previousRoundNumber.createNext();
        roundNumber.setId(json.id);
        roundNumber.setHasPlanning(json.hasPlanning);

        // roundNumber.getFields().forEach( field => {
        //     field.getSport();
        //  });
        if (json.planningConfig !== undefined) {
            this.planningConfigMapper.toObject(json.planningConfig, roundNumber);
        }
        if (json.sportScoreConfigs) {
            json.sportScoreConfigs.forEach(jsonSportScoreConfig => {
                const sport = this.sportMapper.toObject(jsonSportScoreConfig.sport);
                this.sportScoreConfigMapper.toObject(jsonSportScoreConfig, sport, roundNumber);
            });
        }
        if (json.next !== undefined) {
            this.toObject(json.next, competition, roundNumber);
        }
        return roundNumber;
    }

    toJson(roundNumber: RoundNumber): JsonRoundNumber {
        return {
            id: roundNumber.getId(),
            number: roundNumber.getNumber(),
            planningConfig: roundNumber.getPlanningConfig() ? this.planningConfigMapper.toJson(roundNumber.getPlanningConfig()) : undefined,
            sportScoreConfigs: roundNumber.getSportScoreConfigs().map(config => this.sportScoreConfigMapper.toJson(config)),
            next: roundNumber.hasNext() ? this.toJson(roundNumber.getNext()) : undefined
        };
    }
}
