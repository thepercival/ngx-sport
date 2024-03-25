import { Injectable } from '@angular/core';

import { RoundNumber } from '../round/number';
import { GameMapper } from '../game/mapper';
import { Competition } from '../competition';
import { CompetitionSport } from '../competition/sport';
import { PlaceMap } from '../place/mapper';
import { CompetitionSportMap } from '../competition/sport/mapper';
import { JsonAgainstGame } from '../game/against/json';
import { JsonTogetherGame } from '../game/together/json';
import { JsonPoule } from '../poule/json';
import { Poule } from '../poule';

@Injectable({
    providedIn: 'root'
})
export class PlanningMapper {
    constructor(private gameMapper: GameMapper) { }

    setPlaceMap(placeMap: PlaceMap) {
        this.gameMapper.setPlaceMap(placeMap);
    }

    toObject(jsonPoules: JsonPoule[], roundNumber: RoundNumber, sportMap: CompetitionSportMap): boolean {
        const poules = roundNumber.getPoules(undefined);
        const complete = jsonPoules.every((jsonPoule: JsonPoule) => {
            const poule = poules.find((poule: Poule): boolean => {
                return poule.getId() === jsonPoule.id;
            });
            if (poule === undefined) {
                return false;
            }
            return this.toPouleGames(jsonPoule, poule, sportMap);
        });
        return jsonPoules.length > 0 && complete;
    }

    protected toPouleGames(jsonPoule: JsonPoule, poule: Poule, sportMap: CompetitionSportMap): boolean {
        if (jsonPoule.againstGames === undefined || jsonPoule.togetherGames === undefined) {
            return false;
        }

        jsonPoule.againstGames.forEach((jsonGame: JsonAgainstGame) => {
            const competitionSport = sportMap[jsonGame.competitionSportId];
            this.gameMapper.toNewAgainst(jsonGame, poule, competitionSport);
        });
        jsonPoule.togetherGames.forEach((jsonGame: JsonTogetherGame) => {
            const competitionSport = sportMap[jsonGame.competitionSportId];
            this.gameMapper.toNewTogether(jsonGame, poule, competitionSport);
        });
        return poule.getGames().length > 0;
    }
}

export interface RoundNumbersReferenceMap {
    [key: number]: PlanningReferences;
}

export interface PlanningReferences {
    places: PlaceMap,
    sports: CompetitionSportMap,
}
