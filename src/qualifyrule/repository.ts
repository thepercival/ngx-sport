import { Injectable } from '@angular/core';

import { IPoulePlace, PoulePlaceRepository } from '../pouleplace/repository';
import { QualifyRule } from '../qualifyrule';
import { Round } from '../round';

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
            const object = this.jsonToObjectHelper(json, round, fromRound);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: any, round: Round, fromRound?: Round): QualifyRule {
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
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: QualifyRule): any {
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
