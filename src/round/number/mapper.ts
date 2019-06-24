import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { RoundNumber } from '../number';
import { JsonPlanningConfig, PlanningConfigMapper } from '../../planning/config/mapper';
import { JsonSport, SportMapper } from '../../sport/mapper';
import { JsonSportConfig, SportConfigMapper } from '../../sport/config/mapper';
import { SportConfig } from '../../sport/config';

@Injectable()
export class RoundNumberMapper {
    constructor(private sportConfigMapper: SportConfigMapper, private planningConfigMapper: PlanningConfigMapper) { }

    toObject(json: JsonRoundNumber, competition: Competition, previousRoundNumber?: RoundNumber): RoundNumber {
        const roundNumber = previousRoundNumber === undefined ? new RoundNumber(competition) : previousRoundNumber.createNext();
        roundNumber.setId(json.id);

        // roundNumber.getFields().forEach( field => {
        //     field.getSport();
        //  });
        json.sportConfigs.forEach( jsonSportConfig => {
            this.sportConfigMapper.toObject(jsonSportConfig, roundNumber);
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
            sportConfigs: roundNumber.getSportConfigs().map( config => this.sportConfigMapper.toJson(config)),
            planningConfig: this.planningConfigMapper.toJson(roundNumber.getPlanningConfig()),
            next: roundNumber.hasNext() ? this.toJson(roundNumber.getNext()) : undefined
        };
    }
}

export interface JsonRoundNumber {
    id?: number;
    number: number;
    sportConfigs: JsonSportConfig[];
    planningConfig?: JsonPlanningConfig;
    next?: JsonRoundNumber;
}
