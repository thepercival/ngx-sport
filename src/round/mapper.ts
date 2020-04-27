import { Injectable } from '@angular/core';

import { HorizontalPouleService } from '../poule/horizontal/service';
import { PouleMapper } from '../poule/mapper';
import { QualifyGroup } from '../qualify/group';
import { QualifyGroupMapper } from '../qualify/group/mapper';
import { QualifyRuleService } from '../qualify/rule/service';
import { Round } from '../round';
import { RoundNumber } from './number';
import { JsonRound } from './json';

@Injectable()
export class RoundMapper {
    // private qualifyGroupMapper: QualifyGroupMapper;

    constructor(private pouleMapper: PouleMapper) {

    }

    toObject(json: JsonRound, roundNumber: RoundNumber, parentQualifyGroup?: QualifyGroup, round?: Round): Round {
        round = new Round(roundNumber, parentQualifyGroup);
        round.setId(json.id);
        json.poules.map(jsonPoule => this.pouleMapper.toObject(jsonPoule, round));

        const horizontalPouleService = new HorizontalPouleService(round);
        horizontalPouleService.recreate();

        const qualifyGroupMapper = new QualifyGroupMapper(this);
        json.qualifyGroups.forEach((jsonQualifyGroup) => {
            qualifyGroupMapper.toObject(jsonQualifyGroup, round);
        });

        [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
            horizontalPouleService.updateQualifyGroups(
                round.getHorizontalPoules(winnersOrLosers).slice(),
                round.getQualifyGroups(winnersOrLosers).map(qualifyGroup => {
                    return { qualifyGroup: qualifyGroup, nrOfQualifiers: qualifyGroup.getChildRound().getNrOfPlaces() };
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
