import { Injectable } from '@angular/core';

import { RoundNumber } from '../round/number';
import { GameMapper } from '../game/mapper';
import { JsonStructure } from '../structure/json';
import { JsonRound } from '../round/json';
import { JsonRoundNumber } from '../round/number/json';
import { Structure } from '../structure';
import { Place } from '../place';
import { Competition } from '../competition';
import { Poule } from '../poule';
import { Round } from '../qualify/group';
import { CompetitionSport } from '../competition/sport';
import { PlaceMap } from '../place/mapper';
import { CompetitionSportMap } from '../competition/sport/mapper';
import { GameMode } from './gameMode';
import { JsonAgainstGame } from '../game/against/json';
import { JsonTogetherGame } from '../game/together/json';
import { JsonQualifyGroup } from '../qualify/group/json';

@Injectable({
    providedIn: 'root'
})
export class PlanningMapper {
    constructor(private gameMapper: GameMapper) { }

    toObject(json: JsonStructure, structure: Structure, startRoundNumber: number): RoundNumber {
        const firstRoundNumber = structure.getFirstRoundNumber();
        const map: CompetitionSportMap = this.getCompetitionSportMap(firstRoundNumber.getCompetition());
        this.toRoundNumber(json.firstRoundNumber, firstRoundNumber, startRoundNumber);
        this.toRounds(json.rootRound, structure.getRootRound(), firstRoundNumber, startRoundNumber, map);
        const retVal = structure.getRoundNumber(startRoundNumber);
        return retVal ?? firstRoundNumber;
    }

    protected toRoundNumber(jsonRoundNumber: JsonRoundNumber, roundNumber: RoundNumber, startRoundNumber: number) {
        if (roundNumber.getNumber() >= startRoundNumber) {
            roundNumber.setHasPlanning(jsonRoundNumber.hasPlanning);
        }
        const nextRoundNumber = roundNumber.getNext();
        if (nextRoundNumber && jsonRoundNumber.next) {
            this.toRoundNumber(jsonRoundNumber.next, nextRoundNumber, startRoundNumber);
        }
    }
    protected toRounds(
        jsonRound: JsonRound,
        round: Round,
        roundNumber: RoundNumber,
        startRoundNumber: number,
        map: CompetitionSportMap) {
        if (roundNumber.getNumber() >= startRoundNumber && roundNumber.getHasPlanning()) {
            jsonRound.poules.forEach(jsonPoule => {
                const poule = round.getPoule(jsonPoule.number);
                if (!poule) {
                    return;
                }
                jsonPoule.againstGames.forEach((jsonGame: JsonAgainstGame) => {
                    const competitionSport = map[jsonGame.competitionSport.id];
                    this.gameMapper.toNewAgainst(jsonGame, poule, competitionSport);
                });
                jsonPoule.togetherGames.forEach((jsonGame: JsonTogetherGame) => {
                    const competitionSport = map[jsonGame.competitionSport.id];
                    this.gameMapper.toNewTogether(jsonGame, poule, competitionSport);
                });

            });
        }
        jsonRound.qualifyGroups.forEach((jsonQualifyGroup: JsonQualifyGroup) => {
            const qualifyGroup = round.getQualifyGroup(jsonQualifyGroup.target, jsonQualifyGroup.number);
            const nextRoundNumber = roundNumber.getNext();
            if (nextRoundNumber && qualifyGroup) {
                this.toRounds(jsonQualifyGroup.childRound, qualifyGroup.getChildRound(), nextRoundNumber, startRoundNumber, map);
            }
        });
    }

    getCompetitionSportMap(competition: Competition): CompetitionSportMap {
        const map: CompetitionSportMap = {};
        competition.getSports().forEach((competitionSport: CompetitionSport) => {
            map[competitionSport.getId()] = competitionSport;
        });
        return map;
    }
}

export interface RoundNumbersReferenceMap {
    [key: number]: PlanningReferences;
}

export interface PlanningReferences {
    places: PlaceMap,
    sports: CompetitionSportMap,
}
