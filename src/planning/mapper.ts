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

@Injectable({
    providedIn: 'root'
})
export class PlanningMapper {
    private roundNumbersReferenceMap: RoundNumbersReferenceMap = {};

    constructor(private gameMapper: GameMapper) { }

    toObject(json: JsonStructure, structure: Structure, startRoundNumber: number): RoundNumber {
        const firstRoundNumber = structure.getFirstRoundNumber();
        this.initCache(firstRoundNumber.getCompetition());
        this.toRoundNumber(json.firstRoundNumber, firstRoundNumber, startRoundNumber);
        this.toRounds(json.rootRound, structure.getRootRound(), firstRoundNumber, startRoundNumber);
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
    protected toRounds(jsonRound: JsonRound, round: Round, roundNumber: RoundNumber, startRoundNumber: number) {
        if (roundNumber.getNumber() >= startRoundNumber && roundNumber.getHasPlanning()) {
            const gameMode = roundNumber.getValidPlanningConfig().getGameMode();
            jsonRound.poules.forEach(jsonPoule => {
                const poule = round.getPoule(jsonPoule.number);
                if (!poule) {
                    return;
                }
                if (gameMode === GameMode.Against && jsonPoule.againstGames !== undefined) {
                    jsonPoule.againstGames.forEach(jsonGame => {
                        this.gameMapper.toNewAgainst(jsonGame, poule, this.getReferences(roundNumber));
                    });
                } else if (gameMode === GameMode.Together && jsonPoule.togetherGames !== undefined) {
                    jsonPoule.togetherGames.forEach(jsonGame => {
                        this.gameMapper.toNewTogether(jsonGame, poule, this.getReferences(roundNumber));
                    });
                }
            });
        }
        jsonRound.qualifyGroups.forEach((jsonQualifyGroup) => {
            const qualifyGroup = round.getQualifyGroup(jsonQualifyGroup.winnersOrLosers, jsonQualifyGroup.number);
            const nextRoundNumber = roundNumber.getNext();
            if (nextRoundNumber && qualifyGroup) {
                this.toRounds(jsonQualifyGroup.childRound, qualifyGroup.getChildRound(), nextRoundNumber, startRoundNumber);
            }
        });
    }

    getReferences(roundNumber: RoundNumber): PlanningReferences {
        let roundNumberReferences = this.roundNumbersReferenceMap[roundNumber.getNumber()];
        if (roundNumberReferences) {
            return roundNumberReferences;
        }
        const places: PlaceMap = {};
        roundNumber.getPoules().forEach((poule: Poule) => {
            poule.getPlaces().forEach((place: Place) => places[place.getLocationId()] = place);
        });

        this.roundNumbersReferenceMap[roundNumber.getNumber()] = {
            places: places,
            sports: this.roundNumbersReferenceMap[0].sports,
        };
        return this.roundNumbersReferenceMap[roundNumber.getNumber()];
    }

    initCache(competition: Competition) {
        this.roundNumbersReferenceMap = {};
        this.roundNumbersReferenceMap[0] = {
            places: {},
            sports: {}
        };
        competition.getSports().forEach((competitionSport: CompetitionSport) => {
            this.roundNumbersReferenceMap[0].sports[competitionSport.getId()] = competitionSport;
        });
    }
}

export interface RoundNumbersReferenceMap {
    [key: number]: PlanningReferences;
}

export interface PlanningReferences {
    places: PlaceMap,
    sports: CompetitionSportMap,
}
