import { Injectable } from '@angular/core';

import { JsonPoule, PouleMapper } from '../poule/mapper';
import { QualifyRuleService } from '../qualify/rule/service';
import { Round } from '../round';
import { RoundNumber } from './number';

@Injectable()
export class RoundMapper {
    constructor(private pouleMapper: PouleMapper) { }

    toObject(json: JsonRound, roundNumber: RoundNumber, parentRound?: Round, round?: Round): Round {
        round = new Round(roundNumber, parentRound, json.winnersOrLosers);
        round.setId(json.id);
        round.setQualifyOrder(json.qualifyOrder);
        json.poules.map(jsonPoule => this.pouleMapper.toObject(jsonPoule, round));
        if (parentRound !== undefined) {
            const qualifyService = new QualifyRuleService(round.getParent(), round);
            qualifyService.createRules();
        }
        json.childRounds.forEach((jsonChildRound) => {
            this.toObject(jsonChildRound, roundNumber.getNext(), round, round.getChildRound(jsonChildRound.winnersOrLosers));
        });
        return round;
    }

    toJson(round: Round): JsonRound {
        return {
            id: round.getId(),
            winnersOrLosers: round.getWinnersOrLosers(),
            qualifyOrder: round.getQualifyOrder(),
            name: round.getName(),
            poules: round.getPoules().map(poule => this.pouleMapper.toJson(poule)),
            childRounds: round.getChildRounds().map(roundIt => this.toJson(roundIt))
        };
    }
}

export interface JsonRound {
    id?: number;
    winnersOrLosers: number;
    qualifyOrder: number;
    name?: string;
    poules: JsonPoule[];
    childRounds: JsonRound[];
}
