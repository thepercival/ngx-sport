import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { RoundNumber } from '../number';
import { JsonPlanningConfig, PlanningConfigMapper } from '../../planning/config/mapper';
import { JsonSportPlanningConfig, SportPlanningConfigMapper } from '../../sport/planningconfig/mapper';
import { JsonSportScoreConfig, SportScoreConfigMapper } from '../../sport/scoreconfig/mapper';
import { TheCache } from '../../cache';

@Injectable()
export class RoundNumberMapper {
    constructor(
        private planningConfigMapper: PlanningConfigMapper,
        private sportPlanningConfigMapper: SportPlanningConfigMapper,
        private sportScoreConfigMapper: SportScoreConfigMapper
        ) { }

    toObject(json: JsonRoundNumber, competition: Competition, previousRoundNumber?: RoundNumber): RoundNumber {
        const roundNumber = previousRoundNumber === undefined ? new RoundNumber(competition) : previousRoundNumber.createNext();
        roundNumber.setId(json.id);

        // roundNumber.getFields().forEach( field => {
        //     field.getSport();
        //  });
        if ( json.planningConfig !== undefined ) {
            this.planningConfigMapper.toObject(json.planningConfig, roundNumber);
        }
        if( json.sportScoreConfigs ) {
            json.sportScoreConfigs.forEach( jsonSportScoreConfig => {
                this.sportScoreConfigMapper.toObject(jsonSportScoreConfig, TheCache.sports[jsonSportScoreConfig.sportId], roundNumber);
            });
        }
        if( json.sportPlanningConfigs ) {
            json.sportPlanningConfigs.forEach( jsonSportPlanningConfig => {
                this.sportPlanningConfigMapper.toObject(jsonSportPlanningConfig, TheCache.sports[jsonSportPlanningConfig.sportId], roundNumber);
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
            planningConfig: this.planningConfigMapper.toJson(roundNumber.getPlanningConfig()),
            sportPlanningConfigs: roundNumber.getSportPlanningConfigs().map( config => this.sportPlanningConfigMapper.toJson(config)),
            sportScoreConfigs: roundNumber.getSportScoreConfigs().map( config => this.sportScoreConfigMapper.toJson(config)),
            next: roundNumber.hasNext() ? this.toJson(roundNumber.getNext()) : undefined
        };
    }
}

export interface JsonRoundNumber {
    id?: number;
    number: number;
    planningConfig?: JsonPlanningConfig;
    sportPlanningConfigs?: JsonSportPlanningConfig[];
    sportScoreConfigs?: JsonSportScoreConfig[];
    next?: JsonRoundNumber;
}
