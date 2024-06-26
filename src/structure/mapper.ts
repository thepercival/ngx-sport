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
import { CategoryMapper } from '../category/mapper';
import { Category } from '../category';
import { JsonCategory } from '../category/json';

@Injectable({
    providedIn: 'root'
})
export class StructureMapper {
    protected poulesMap: JsonPoulesMap = {};
    protected placeMap: PlaceMap = {};

    constructor(
        private competitionSportMapper: CompetitionSportMapper,
        private roundNumberMapper: RoundNumberMapper,
        private categoryMapper: CategoryMapper,
        private planningMapper: PlanningMapper) { }

    toObject(json: JsonStructure, competition: Competition): Structure {
        const firstRoundNumber = this.roundNumberMapper.toObject(json.firstRoundNumber, competition);
        const categories = json.categories.map((jsonCategory: JsonCategory): Category => {
            return this.categoryMapper.toObject(jsonCategory, firstRoundNumber);
        });
        const structure = new Structure(categories, firstRoundNumber);

        this.planningToObject(json, structure, this.competitionSportMapper.getMap(competition))
        return structure;
    }

    planningToObject(json: JsonStructure, structure: Structure, competitionSportMap: CompetitionSportMap): void {
        this.initMaps(json.categories, structure.getRootRounds());
        this.planningMapper.setPlaceMap(this.placeMap);
        this.planningToRoundNumber(structure.getFirstRoundNumber(), competitionSportMap);
    }

    protected planningToRoundNumber(roundNumber: RoundNumber, competitionSportMap: CompetitionSportMap): void {
        const jsonPoules = this.poulesMap[roundNumber.getNumber()];
        this.planningMapper.toObject(jsonPoules, roundNumber, competitionSportMap);
        const nextRoundNumber = roundNumber.getNext();
        if (nextRoundNumber) {
            this.planningToRoundNumber(nextRoundNumber, competitionSportMap);
        }
    }

    toJson(structure: Structure): JsonStructure {
        return {
            categories: structure.getCategories().map((category: Category): JsonCategory => {
                return this.categoryMapper.toJson(category);
            }),
            firstRoundNumber: this.roundNumberMapper.toJson(structure.getFirstRoundNumber())
        };
    }

    protected initMaps(jsonCategories: JsonCategory[], rootRounds: Round[]): void {
        this.poulesMap = {};
        this.placeMap = {};
        const jsonRootRounds = jsonCategories.map((jsonCategory: JsonCategory): JsonRound => jsonCategory.rootRound);
        this.initJsonPoulesMap(jsonRootRounds, 1);
        this.initPlaceMap(rootRounds);
    }

    protected initJsonPoulesMap(jsonRounds: JsonRound[], roundNumberAsValue: number): void {
        if (this.poulesMap[roundNumberAsValue] === undefined) {
            this.poulesMap[roundNumberAsValue] = [];
        }
        jsonRounds.forEach((jsonRound: JsonRound) => {
            jsonRound.poules.forEach((jsonPoule: JsonPoule) => {
                this.poulesMap[roundNumberAsValue].push(jsonPoule);

            });
            const jsonChildRounds = jsonRound.qualifyGroups.map((jsonQualifyGroup: JsonQualifyGroup): JsonRound => {
                return jsonQualifyGroup.childRound;
            });
            this.initJsonPoulesMap(jsonChildRounds, roundNumberAsValue + 1);
        });
    }

    protected initPlaceMap(rounds: Round[]): void {
        rounds.forEach((round: Round) => {
            round.getPoules().forEach((poule: Poule) => {
                poule.getPlaces().forEach((place: Place) => {
                    this.placeMap[place.getStructureLocation().toString()] = place;
                });
            });
            this.initPlaceMap(round.getChildren());
        });
    }
}

interface JsonPoulesMap {
    [key: number]: JsonPoule[];
}