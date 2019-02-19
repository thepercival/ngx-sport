import { Injectable } from '@angular/core';

import { Competition } from '../competition';
import { JsonRound, RoundMapper } from '../round/mapper';
import { RoundNumber } from '../round/number';
import { JsonRoundNumber, RoundNumberMapper } from '../round/number/mapper';
import { Structure } from '../structure';

@Injectable()
export class StructureMapper {
    constructor(private roundNumberMapper: RoundNumberMapper, private roundMapper: RoundMapper) { }

    toObject(json: JsonStructure, competition: Competition): Structure {
        const firstRoundNumber = this.roundNumberMapper.toObject(json.firstRoundNumber, competition);
        const rootRound = this.roundMapper.toObject(json.rootRound, firstRoundNumber);
        this.setRefereePoulePlaces(json.rootRound, firstRoundNumber);
        return new Structure(firstRoundNumber, rootRound);
    }

    protected setRefereePoulePlaces(jsonRound: JsonRound, roundNumber: RoundNumber) {
        if (roundNumber.getConfig().getSelfReferee()) {
            const places = roundNumber.getPlaces();
            const games = roundNumber.getGames();
            jsonRound.poules.forEach(jsonPoule => jsonPoule.games.forEach(jsonGame => {
                if (jsonGame.refereePoulePlaceId === undefined) {
                    return;
                }
                const refereePoulePlace = places.find(place => place.getId() === jsonGame.refereePoulePlaceId);
                const game = games.find(game => game.getId() === jsonGame.id);
                game.setRefereePoulePlace(refereePoulePlace);
            }));
        }
        jsonRound.childRounds.forEach((jsonChildRound) => {
            this.setRefereePoulePlaces(jsonChildRound, roundNumber.getNext());
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
