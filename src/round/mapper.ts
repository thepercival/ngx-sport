import { Injectable } from '@angular/core';

import { HorizontalPouleService } from '../poule/horizontal/service';
import { PouleMapper } from '../poule/mapper';
import { QualifyGroup, Round } from '../qualify/group';
import { QualifyGroupMapper } from '../qualify/group/mapper';
import { QualifyRuleService } from '../qualify/rule/service';
import { JsonRound } from './json';

@Injectable({
    providedIn: 'root'
})
export class RoundMapper {
    // private qualifyGroupMapper: QualifyGroupMapper;

    constructor(private pouleMapper: PouleMapper) {

    }

    toObject(json: JsonRound, round: Round): Round {
        round.setId(json.id);
        json.poules.map(jsonPoule => this.pouleMapper.toObject(jsonPoule, round, undefined));

        const horizontalPouleService = new HorizontalPouleService(round);
        horizontalPouleService.recreate();

        const nextRoundNumber = round.getNumber().getNext();
        if (nextRoundNumber) {
            const qualifyGroupMapper = new QualifyGroupMapper(this);
            json.qualifyGroups.forEach((jsonQualifyGroup) => {
                qualifyGroupMapper.toObject(jsonQualifyGroup, round, nextRoundNumber);
            });
        }

        [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
            horizontalPouleService.updateQualifyGroups(
                round.getHorizontalPoules(winnersOrLosers).slice(),
                round.getQualifyGroups(winnersOrLosers).map(qualifyGroup => {
                    const childRound = qualifyGroup.getChildRound();
                    return { qualifyGroup: qualifyGroup, nrOfQualifiers: childRound ? childRound.getNrOfPlaces() : 0 };
                })
            );
        });

        const qualifyRuleService = new QualifyRuleService(round);
        qualifyRuleService.recreateTo();

        return round;
    }

    toJson(round: Round): JsonRound {
        const qualifyGroupMapper = new QualifyGroupMapper(this);
        return {
            id: round.getId(),
            name: round.getName(),
            poules: round.getPoules().map(poule => this.pouleMapper.toJson(poule)),
            qualifyGroups: round.getQualifyGroups().map(qualifyGroupIt => qualifyGroupMapper.toJson(qualifyGroupIt))
        };
    }
}
