import { Injectable } from '@angular/core';

import { RoundNumber } from '../round/number';
import { Round } from '../round';
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

@Injectable({
    providedIn: 'root'
})
export class PlanningMapper {
    private roundNumbersReferences: {};

    constructor(private gameMapper: GameMapper) { }

    toObject(json: JsonStructure, structure: Structure, startRoundNumber: number): RoundNumber {
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
        if (roundNumber.hasNext()) {
            this.toRoundNumber(jsonRoundNumber.next, roundNumber.getNext(), startRoundNumber);
        }
    }
    protected toRounds(jsonRound: JsonRound, round: Round, roundNumber: RoundNumber, startRoundNumber: number) {
        if (roundNumber.getNumber() >= startRoundNumber && roundNumber.getHasPlanning()) {
            jsonRound.poules.forEach(jsonPoule => {
                const poule = round.getPoule(jsonPoule.number);
                if (jsonPoule.games !== undefined) {
                    jsonPoule.games.forEach(jsonGame => {
                        this.gameMapper.toNewObject(jsonGame, poule, this.getReferences(roundNumber));
                    });
                }
            });
        }
        jsonRound.qualifyGroups.forEach((jsonQualifyGroup) => {
            const qualifyGroup = round.getQualifyGroup(jsonQualifyGroup.winnersOrLosers, jsonQualifyGroup.number);
            this.toRounds(jsonQualifyGroup.childRound, qualifyGroup.getChildRound(), roundNumber.getNext(), startRoundNumber);
        });
    }

    protected getReferences(roundNumber: RoundNumber): PlanningReferences {
        let roundNumberReferences = this.roundNumbersReferences[roundNumber.getNumber()];
        if (roundNumberReferences) {
            return roundNumberReferences;
        }
        const places = {};
        roundNumber.getPoules().forEach((poule: Poule) => {
            poule.getPlaces().forEach((place: Place) => places[place.getLocationId()] = place);
        });

        roundNumberReferences = {
            places: places,
            referees: this.roundNumbersReferences[0].referees,
            fields: this.roundNumbersReferences[0].fields
        };

        this.roundNumbersReferences[roundNumber.getNumber()] = roundNumberReferences;
        return roundNumberReferences;
    }

    initCache(competition: Competition) {
        this.roundNumbersReferences = {};
        this.roundNumbersReferences[0] = {
            places: {},
            referees: {},
            fields: {}
        };
        competition.getReferees().forEach(referee => this.roundNumbersReferences[0].referees[referee.getPriority()] = referee);
        competition.getFields().forEach(field => this.roundNumbersReferences[0].fields[field.getPriority()] = field);
    }
}

export interface PlanningReferences {
    places: {},
    referees: {},
    fields: {}
}
