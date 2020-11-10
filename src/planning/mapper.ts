import { Injectable } from '@angular/core';

import { RoundNumber } from '../round/number';
import { GameMapper } from '../game/mapper';
import { JsonStructure } from '../structure/json';
import { JsonRound } from '../round/json';
import { JsonRoundNumber } from '../round/number/json';
import { Structure } from '../structure';
import { Place } from '../place';
import { Referee } from '../referee';
import { Field } from '../field';
import { Competition } from '../competition';
import { Poule } from '../poule';
import { Round } from '../qualify/group';

@Injectable({
    providedIn: 'root'
})
export class PlanningMapper {
    private roundNumbersReferenceMap: RoundNumbersReferenceMap = {};

    constructor(private gameMapper: GameMapper) { }

    toObject(json: JsonStructure, structure: Structure, startRoundNumber: number): RoundNumber | undefined {
        const firstRoundNumber = structure.getFirstRoundNumber();
        this.initCache(firstRoundNumber.getCompetition());
        this.toRoundNumber(json.firstRoundNumber, firstRoundNumber, startRoundNumber);
        this.toRounds(json.rootRound, structure.getRootRound(), firstRoundNumber, startRoundNumber);
        return structure.getRoundNumber(startRoundNumber);
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
            jsonRound.poules.forEach(jsonPoule => {
                const poule = round.getPoule(jsonPoule.number);
                if (poule && jsonPoule.games !== undefined) {
                    jsonPoule.games.forEach(jsonGame => {
                        this.gameMapper.toNewObject(jsonGame, poule, this.getReferences(roundNumber));
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

        roundNumberReferences = {
            places: places,
            referees: this.roundNumbersReferenceMap[0].referees,
            fields: this.roundNumbersReferenceMap[0].fields
        };

        this.roundNumbersReferenceMap[roundNumber.getNumber()] = roundNumberReferences;
        return roundNumberReferences;
    }

    initCache(competition: Competition) {
        this.roundNumbersReferenceMap = {};
        this.roundNumbersReferenceMap[0] = {
            places: {},
            referees: {},
            fields: {}
        };
        competition.getReferees().forEach(referee => this.roundNumbersReferenceMap[0].referees[referee.getPriority()] = referee);
        competition.getFields().forEach(field => this.roundNumbersReferenceMap[0].fields[field.getPriority()] = field);
    }
}

export interface RoundNumbersReferenceMap {
    [key: number]: PlanningReferences;
}

export interface PlanningReferences {
    places: PlaceMap,
    referees: RefereeMap,
    fields: FieldMap
}

interface PlaceMap {
    [key: string]: Place;
}

interface RefereeMap {
    [key: number]: Referee;
}

interface FieldMap {
    [key: number]: Field;
}

