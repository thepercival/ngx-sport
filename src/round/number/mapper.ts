import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { RoundNumber } from '../number';
import { JsonPlanningConfig, PlanningConfigMapper } from '../../planning/config/mapper';
import { JsonSport, SportMapper } from '../../sport/mapper';
import { JsonCountConfig, CountConfigMapper } from '../../countconfig/mapper';
import { CountConfig } from '../../countconfig';

@Injectable()
export class RoundNumberMapper {
    constructor(private countConfigMapper: CountConfigMapper, private planningConfigMapper: PlanningConfigMapper) { }

    toObject(json: JsonRoundNumber, competition: Competition, previousRoundNumber?: RoundNumber): RoundNumber {
        const roundNumber = previousRoundNumber === undefined ? new RoundNumber(competition) : previousRoundNumber.createNext();
        roundNumber.setId(json.id);
        json.countConfigs.forEach( jsonCountConfig => {
            this.countConfigMapper.toObject(jsonCountConfig, roundNumber);
        });

        this.planningConfigMapper.toObject(json.planningConfig, roundNumber);
        if (json.next !== undefined) {
            this.toObject(json.next, competition, roundNumber);
        }
        return roundNumber;
    }

    toJson(roundNumber: RoundNumber): JsonRoundNumber {
        return {
            id: roundNumber.getId(),
            number: roundNumber.getNumber(),
            countConfigs: roundNumber.getCountConfigs().map( config => this.countConfigMapper.toJson(config)),
            planningConfig: this.planningConfigMapper.toJson(roundNumber.getPlanningConfig()),
            next: roundNumber.hasNext() ? this.toJson(roundNumber.getNext()) : undefined
        };
    }
}

export interface JsonRoundNumber {
    id?: number;
    number: number;
    countConfigs: JsonCountConfig[];
    planningConfig: JsonPlanningConfig;
    next?: JsonRoundNumber;
}
