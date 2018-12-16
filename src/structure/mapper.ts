import { Competition } from '../competition';
import { RoundNumberMapper, JsonRoundNumber } from '../round/number/mapper';
import { RoundMapper, JsonRound } from '../round/mapper';
import { Structure } from '../structure';
import { Injectable } from '@angular/core';

@Injectable()
export class StructureMapper {
    constructor( private roundNumberMapper: RoundNumberMapper, private roundMapper: RoundMapper ) {}

    toObject(json: JsonStructure, competition: Competition): Structure {
        const firstRoundNumber = this.roundNumberMapper.toObject(json.firstRoundNumber, competition);
        return new Structure(firstRoundNumber, this.roundMapper.toObject(json.rootRound, firstRoundNumber));
    }

    toJson(structure: Structure): JsonStructure {
        return {
            firstRoundNumber: this.roundNumberMapper.toJson(structure.getFirstRoundNumber()),
            rootRound: this.roundMapper.toJson(structure.getRootRound())
        };
    }
}

export interface JsonStructure {
    firstRoundNumber: JsonRoundNumber;
    rootRound: JsonRound;
}
