import { Injectable } from '@angular/core';

import { JsonPoulePlace, PoulePlaceMapper } from '../pouleplace/mapper';
import { Round } from '../round';
import { QualifyRule } from './rule';

/**
 * Created by coen on 3-3-17.
 */
@Injectable()
export class QualifyRuleRepository {

    constructor(private poulePlaceMapper: PoulePlaceMapper) {
    }

    jsonArrayToObject(jsonArray: any, round: Round, fromRound?: Round): QualifyRule[] {
        const objects: QualifyRule[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObject(json, round, fromRound);
            objects.push(object);
        }
        return objects;
    }

    jsonToObject(json: any, round: Round, fromRound?: Round): QualifyRule {
        const qualifyRule = new QualifyRule(fromRound, round);

        json.fromPoulePlaces.forEach(function (jsonFromPoulePlace) {
            const fromPoulePlace = this.getPoulePlaceByIdAndRound(jsonFromPoulePlace.id, fromRound);
            qualifyRule.addFromPoulePlace(fromPoulePlace);
        }, this);

        json.toPoulePlaces.forEach(function (jsonToPoulePlace) {
            const toPoulePlace = this.getPoulePlaceByIdAndRound(jsonToPoulePlace.id, round);
            qualifyRule.addToPoulePlace(toPoulePlace);
        }, this);
        return qualifyRule;
    }

    private getPoulePlaceByIdAndRound(poulePlaceId: number, round: Round) {
        return round.getPoulePlaces().find(function (placeIt) {
            return (placeIt.getId() === poulePlaceId);
        });
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJson(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJson(qualifyRule: QualifyRule): any {
        return {
            fromPoulePlaces: qualifyRule.getFromPoulePlaces().map( poulePlace => this.poulePlaceMapper.toJson(poulePlace)),
            toPoulePlaces: qualifyRule.getToPoulePlaces().map( poulePlace => this.poulePlaceMapper.toJson(poulePlace))
        };
    }
}

export interface JsonQualifyRule {
    fromPoulePlaces: JsonPoulePlace[];
    toPoulePlaces: JsonPoulePlace[];
}
