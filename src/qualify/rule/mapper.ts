import { Injectable } from '@angular/core';

import { JsonPoulePlace, PoulePlaceMapper } from '../../pouleplace/mapper';
import { Round } from '../../round';
import { QualifyRule } from '../rule';

@Injectable()
export class QualifyRuleMapper {

    constructor(private poulePlaceMapper: PoulePlaceMapper) {
    }

    toObject(json: any, round: Round, fromRound?: Round): QualifyRule {
        // const qualifyRule = new QualifyRule(fromRound, round);

        // json.fromPoulePlaces.forEach(function (jsonFromPoulePlace) {
        //     const fromPoulePlace = this.getPoulePlaceByIdAndRound(jsonFromPoulePlace.id, fromRound);
        //     qualifyRule.addFromPoulePlace(fromPoulePlace);
        // }, this);

        // json.toPoulePlaces.forEach(function (jsonToPoulePlace) {
        //     const toPoulePlace = this.getPoulePlaceByIdAndRound(jsonToPoulePlace.id, round);
        //     qualifyRule.addToPoulePlace(toPoulePlace);
        // }, this);
        // return qualifyRule;
        return undefined;
    }

    // private getPoulePlaceByIdAndRound(poulePlaceId: number, round: Round) {
    //     return round.getPoulePlaces().find(function (placeIt) {
    //         return (placeIt.getId() === poulePlaceId);
    //     });
    // }

    // toJson(qualifyRule: QualifyRule): any {
    //     return {
    //         fromPoulePlaces: qualifyRule.getFromPoulePlaces().map(poulePlace => this.poulePlaceMapper.toJson(poulePlace)),
    //         toPoulePlaces: qualifyRule.getToPoulePlaces().map(poulePlace => this.poulePlaceMapper.toJson(poulePlace))
    //     };
    // }
}

export interface JsonQualifyRule {
    fromPoulePlaces: JsonPoulePlace[];
    toPoulePlaces: JsonPoulePlace[];
}
