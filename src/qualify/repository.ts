import { Injectable } from '@angular/core';

import { IPoulePlace, PoulePlaceRepository } from '../pouleplace/repository';
import { Round } from '../round';
import { QualifyRule } from './rule';

/**
 * Created by coen on 3-3-17.
 */
@Injectable()
export class QualifyRuleRepository {

    constructor(private poulePlaceRepos: PoulePlaceRepository) {
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

    objectToJson(object: QualifyRule): any {
        return {
            fromPoulePlaces: this.poulePlaceRepos.objectsToJsonArray(object.getFromPoulePlaces()),
            toPoulePlaces: this.poulePlaceRepos.objectsToJsonArray(object.getToPoulePlaces())
        };
    }
}

export interface IQualifyRule {
    fromPoulePlaces: IPoulePlace[];
    toPoulePlaces: IPoulePlace[];
}
