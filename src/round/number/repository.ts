import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { RoundNumber } from '../number';
import { IRoundNumberConfig, RoundNumberConfigRepository } from './config/repository';

/**
 * Created by coen on 3-3-17.
 */
@Injectable()
export class RoundNumberRepository {

    constructor(private configRepos: RoundNumberConfigRepository) {
    }

    jsonToObject(json: IRoundNumber, competition: Competition, previousRoundNumber?: RoundNumber): RoundNumber {
        const roundNumber = previousRoundNumber === undefined ? new RoundNumber(competition) : previousRoundNumber.createNext();
        roundNumber.setId(json.id);
        this.configRepos.jsonToObject(json.config, roundNumber);
        if (json.next !== undefined) {
            this.jsonToObject(json.next, competition, roundNumber);
        }
        return roundNumber;
    }

    objectToJson(object: RoundNumber): IRoundNumber {
        const json: IRoundNumber = {
            id: object.getId(),
            number: object.getNumber(),
            config: this.configRepos.objectToJson(object.getConfig()),
            next: object.hasNext() ? this.objectToJson(object.getNext()) : undefined
        };
        return json;
    }
}

export interface IRoundNumber {
    id?: number;
    number: number;
    config: IRoundNumberConfig;
    next: IRoundNumber;
}
