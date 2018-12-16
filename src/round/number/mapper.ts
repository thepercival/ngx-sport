import { Competition } from '../../competition';
import { RoundNumber } from '../number';
import { RoundNumberConfigMapper, JsonRoundNumberConfig } from './config/mapper';
import { Injectable } from '@angular/core';

@Injectable()
export class RoundNumberMapper {
    constructor( private configMapper: RoundNumberConfigMapper ) {}

    toObject(json: JsonRoundNumber, competition: Competition, previousRoundNumber?: RoundNumber): RoundNumber {
        const roundNumber = previousRoundNumber === undefined ? new RoundNumber(competition) : previousRoundNumber.createNext();
        roundNumber.setId(json.id);
        this.configMapper.toObject(json.config, roundNumber);
        if (json.next !== undefined) {
            this.toObject(json.next, competition, roundNumber);
        }
        return roundNumber;
    }

    toJson(roundNumber: RoundNumber): JsonRoundNumber {
        return {
            id: roundNumber.getId(),
            number: roundNumber.getNumber(),
            config: this.configMapper.toJson(roundNumber.getConfig()),
            next: roundNumber.hasNext() ? this.toJson(roundNumber.getNext()) : undefined
        };
    }
}

export interface JsonRoundNumber {
    id?: number;
    number: number;
    config: JsonRoundNumberConfig;
    next?: JsonRoundNumber;
}
