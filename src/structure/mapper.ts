import { Injectable } from '@angular/core';

import { Competition } from '../competition';
import { JsonRound, RoundMapper } from '../round/mapper';
import { RoundNumber } from '../round/number';
import { JsonRoundNumber, RoundNumberMapper } from '../round/number/mapper';
import { Structure } from '../structure';
import { Game } from '../game';

@Injectable()
export class StructureMapper {
    constructor(private roundNumberMapper: RoundNumberMapper, private roundMapper: RoundMapper) { }

    toObject(json: JsonStructure, competition: Competition): Structure {
        const firstRoundNumber = this.roundNumberMapper.toObject(json.firstRoundNumber, competition);
        const rootRound = this.roundMapper.toObject(json.rootRound, firstRoundNumber);
        this.setRefereePlaces(json.rootRound, firstRoundNumber);
        const structure = new Structure(firstRoundNumber, rootRound);
        structure.setStructureNumbers();
        return structure;
    }

    protected setRefereePlaces(jsonRound: JsonRound, roundNumber: RoundNumber) {
        if (roundNumber.getValidPlanningConfig().getSelfReferee()) {
            const places = roundNumber.getPlaces();
            const games = roundNumber.getGames(Game.ORDER_BY_POULE);
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

export interface JsonStructure {
    firstRoundNumber: JsonRoundNumber;
    rootRound: JsonRound;
}
