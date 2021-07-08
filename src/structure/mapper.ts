import { Injectable } from '@angular/core';

import { Competition } from '../competition';
import { RoundMapper } from '../round/mapper';
import { RoundNumberMapper } from '../round/number/mapper';
import { Structure } from '../structure';
import { PlanningMapper } from '../planning/mapper';
import { JsonStructure } from './json';
import { Place } from '../place';
import { PlaceMap } from '../place/mapper';
import { CompetitionSportMap, CompetitionSportMapper } from '../competition/sport/mapper';
import { JsonPoule } from '../poule/json';
import { RoundNumber } from '../round/number';
import { Poule } from '../poule';
import { JsonRound } from '../round/json';
import { JsonQualifyGroup } from '../qualify/group/json';
import { Round } from '../qualify/group';

@Injectable({
    providedIn: 'root'
})
export class StructureMapper {
    protected poulesMap: JsonPoulesMap = {};
    protected placeMap: PlaceMap = {};

    constructor(
        private competitionSportMapper: CompetitionSportMapper,
        private roundNumberMapper: RoundNumberMapper,
        private roundMapper: RoundMapper,
        private planningMapper: PlanningMapper) { }

    toObject(json: JsonStructure, competition: Competition): Structure {
        const firstRoundNumber = this.roundNumberMapper.toObject(json.firstRoundNumber, competition);
        const rootRound = this.roundMapper.toObject(json.rootRound, new Round(firstRoundNumber, undefined));
        const structure = new Structure(firstRoundNumber, rootRound);

        this.planningToObject(json, firstRoundNumber, this.competitionSportMapper.getMap(competition))
        return structure;
    }

    planningToObject(json: JsonStructure, startRoundNumber: RoundNumber, sportMap: CompetitionSportMap): void {
        this.initMaps(json.rootRound, startRoundNumber, startRoundNumber.getCompetition());
        this.planningMapper.setPlaceMap(this.placeMap);
        this.planningToRoundNumber(startRoundNumber, sportMap);
    }

    protected planningToRoundNumber(roundNumber: RoundNumber, sportMap: CompetitionSportMap): void {
        const jsonPoules = this.poulesMap[roundNumber.getNumber()];
        this.planningMapper.toObject(jsonPoules, roundNumber, sportMap);
        const nextRoundNumber = roundNumber.getNext();
        if (nextRoundNumber) {
            this.planningToRoundNumber(nextRoundNumber, sportMap);
        }
    }

    toJson(structure: Structure): JsonStructure {
        return {
            firstRoundNumber: this.roundNumberMapper.toJson(structure.getFirstRoundNumber()),
            rootRound: this.roundMapper.toJson(structure.getRootRound())
        };
    }

    protected initMaps(jsonRootRound: JsonRound, firstRoundNumber: RoundNumber, competition: Competition): void {
        this.poulesMap = {};
        this.placeMap = {};
        this.initJsonPoulesMap([jsonRootRound], firstRoundNumber);
        this.initPlaceMap(firstRoundNumber);
    }

    protected initJsonPoulesMap(jsonRounds: JsonRound[], roundNumber: RoundNumber): void {
        const nextRoundNumber = roundNumber.getNext();
        this.poulesMap[roundNumber.getNumber()] = [];
        jsonRounds.forEach((jsonRound: JsonRound) => {
            jsonRound.poules.forEach((jsonPoule: JsonPoule) => {
                this.poulesMap[roundNumber.getNumber()].push(jsonPoule);

            });
            if (nextRoundNumber) {
                const jsonChildRounds = jsonRound.qualifyGroups.map((jsonQualifyGroup: JsonQualifyGroup): JsonRound => {
                    return jsonQualifyGroup.childRound;
                });
                this.initJsonPoulesMap(jsonChildRounds, nextRoundNumber);
            }
        });
    }

    protected initPlaceMap(roundNumber: RoundNumber): void {
        roundNumber.getRounds().forEach((round: Round) => {
            round.getPoules().forEach((poule: Poule) => {
                poule.getPlaces().forEach((place: Place) => {
                    this.placeMap[place.getStructureLocation()] = place;
                });
            });
        });
        const nextRoundNumber = roundNumber.getNext();
        if (nextRoundNumber) {
            this.initPlaceMap(nextRoundNumber);
        }
    }
}

interface JsonPoulesMap {
    [key: number]: JsonPoule[];
}