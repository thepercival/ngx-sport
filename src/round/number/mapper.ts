import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { RoundNumber } from '../number';
import { JsonPlanningConfig, PlanningConfigMapper } from '../../planning/config/mapper';
import { JsonSportScoreConfig, SportScoreConfigMapper } from '../../sport/scoreconfig/mapper';
import { TheCache } from '../../cache';

@Injectable()
export class RoundNumberMapper {
    constructor(private sportScoreConfigMapper: SportScoreConfigMapper, private planningConfigMapper: PlanningConfigMapper) { }

    toObject(json: JsonRoundNumber, competition: Competition, previousRoundNumber?: RoundNumber): RoundNumber {
        const roundNumber = previousRoundNumber === undefined ? new RoundNumber(competition) : previousRoundNumber.createNext();
        roundNumber.setId(json.id);

        // roundNumber.getFields().forEach( field => {
        //     field.getSport();
        //  });
        json.sportScoreConfigs.forEach( jsonSportScoreConfig => {
            this.sportScoreConfigMapper.toObject(jsonSportScoreConfig, TheCache.sports[jsonSportScoreConfig.sportId], roundNumber);
        });
        if ( json.planningConfig !== undefined ) {
            this.planningConfigMapper.toObject(json.planningConfig, roundNumber);
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
            sportScoreConfigs: roundNumber.getSportScoreConfigs().map( config => this.sportScoreConfigMapper.toJson(config)),
            planningConfig: this.planningConfigMapper.toJson(roundNumber.getPlanningConfig()),
            next: roundNumber.hasNext() ? this.toJson(roundNumber.getNext()) : undefined
        };
    }
}

export interface JsonRoundNumber {
    id?: number;
    number: number;
    sportScoreConfigs: JsonSportScoreConfig[];
    planningConfig?: JsonPlanningConfig;
    next?: JsonRoundNumber;
}
