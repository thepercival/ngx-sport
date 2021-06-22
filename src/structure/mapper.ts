import { Injectable } from '@angular/core';

import { Competition } from '../competition';
import { RoundMapper } from '../round/mapper';
import { RoundNumberMapper } from '../round/number/mapper';
import { Structure } from '../structure';
import { PlanningMapper } from '../planning/mapper';
import { JsonStructure } from './json';
import { QualifyGroup, Round } from '../qualify/group';
import { PlaceRange } from './editor';
import { Place } from '../place';
import { PlaceMap } from '../place/mapper';

@Injectable({
    providedIn: 'root'
})
export class StructureMapper {
    constructor(private roundNumberMapper: RoundNumberMapper, private roundMapper: RoundMapper, private planningMapper: PlanningMapper) { }

    toObject(json: JsonStructure, competition: Competition): Structure {
        const firstRoundNumber = this.roundNumberMapper.toObject(json.firstRoundNumber, competition);
        const rootRound = this.roundMapper.toObject(json.rootRound, new Round(firstRoundNumber, undefined));
        const structure = new Structure(firstRoundNumber, rootRound);
        this.planningMapper.setPlaceMap(this.getPlaceMap([rootRound]));
        this.planningMapper.toObject(json, structure, 1);
        return structure;
    }

    toJson(structure: Structure): JsonStructure {
        return {
            firstRoundNumber: this.roundNumberMapper.toJson(structure.getFirstRoundNumber()),
            rootRound: this.roundMapper.toJson(structure.getRootRound())
        };
    }

    getPlaceMap(rounds: Round[]): PlaceMap {
        const map: PlaceMap = {};
        this.fillPlaceMap(rounds, map);
        return map;
    }

    fillPlaceMap(rounds: Round[], map: PlaceMap) {
        rounds.forEach((round: Round) => {
            round.getPlaces().forEach((place: Place) => {
                map[place.getStructureLocation()] = place;
            });
            round.getQualifyGroups().forEach((qualifyGroup: QualifyGroup) => {
                this.fillPlaceMap([qualifyGroup.getChildRound()], map);
            })
        });
        return map;
    }
}
