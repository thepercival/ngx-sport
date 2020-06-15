import { Injectable } from '@angular/core';

import { Competition } from '../competition';
import { RoundMapper } from '../round/mapper';
import { RoundNumber } from '../round/number';
import { RoundNumberMapper } from '../round/number/mapper';
import { Structure } from '../structure';
import { PlanningMapper } from '../planning/mapper';
import { JsonStructure } from './json';
import { JsonRound } from '../round/json';

@Injectable({
    providedIn: 'root'
})
export class StructureMapper {
    constructor(private roundNumberMapper: RoundNumberMapper, private roundMapper: RoundMapper, private planningMapper: PlanningMapper) { }

    toObject(json: JsonStructure, competition: Competition): Structure {
        const firstRoundNumber = this.roundNumberMapper.toObject(json.firstRoundNumber, competition);
        const rootRound = this.roundMapper.toObject(json.rootRound, firstRoundNumber);
        const structure = new Structure(firstRoundNumber, rootRound);
        structure.setStructureNumbers();
        this.planningMapper.toObject(json, structure, 1);
        return structure;
    }

    toJson(structure: Structure): JsonStructure {
        return {
            firstRoundNumber: this.roundNumberMapper.toJson(structure.getFirstRoundNumber()),
            rootRound: this.roundMapper.toJson(structure.getRootRound())
        };
    }
}
