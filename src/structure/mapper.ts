import { Injectable } from '@angular/core';

import { Competition } from '../competition';
import { RoundMapper } from '../round/mapper';
import { RoundNumber } from '../round/number';
import { RoundNumberMapper } from '../round/number/mapper';
import { Structure } from '../structure';
import { Game } from '../game';
import { PlanningMapper } from '../planning/mapper';
import { JsonStructure } from './json';
import { JsonRound } from '../round/json';

@Injectable()
export class StructureMapper {
    constructor(private roundNumberMapper: RoundNumberMapper, private roundMapper: RoundMapper, private planningMapper: PlanningMapper) { }

    toObject(json: JsonStructure, competition: Competition): Structure {
        const firstRoundNumber = this.roundNumberMapper.toObject(json.firstRoundNumber, competition);
        const rootRound = this.roundMapper.toObject(json.rootRound, firstRoundNumber);
        this.planningMapper.setRefereePlaces(json.rootRound, firstRoundNumber);
        const structure = new Structure(firstRoundNumber, rootRound);
        structure.setStructureNumbers();
        return structure;
    }

    protected setRefereePlaces(jsonRound: JsonRound, roundNumber: RoundNumber) {
        if (roundNumber.getValidPlanningConfig().getSelfReferee()) {
            const places = roundNumber.getPlaces();
            const games = roundNumber.getGames();
            jsonRound.poules.forEach(jsonPoule => jsonPoule.games.forEach(jsonGame => {
                if (jsonGame.refereePlaceId === undefined) {
                    return;
                }
                const refereePlace = places.find(place => place.getId() === jsonGame.refereePlaceId);
                const game = games.find(gameIt => gameIt.getId() === jsonGame.id);
                game.setRefereePlace(refereePlace);
            }));
        }
        jsonRound.qualifyGroups.forEach(qualifyGroup => {
            this.setRefereePlaces(qualifyGroup.childRound, roundNumber.getNext());
        });
    }

    toJson(structure: Structure): JsonStructure {
        return {
            firstRoundNumber: this.roundNumberMapper.toJson(structure.getFirstRoundNumber()),
            rootRound: this.roundMapper.toJson(structure.getRootRound())
        };
    }
}
