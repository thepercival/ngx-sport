import { Injectable } from '@angular/core';

import { HorizontalPouleService } from '../poule/horizontal/service';
import { JsonPoule, PouleMapper } from '../poule/mapper';
import { QualifyGroup } from '../qualify/group';
import { JsonQualifyGroup, QualifyGroupMapper } from '../qualify/group/mapper';
import { QualifyRuleService } from '../qualify/rule/service';
import { Round } from '../round';
import { RoundNumber } from './number';

@Injectable()
export class RoundMapper {
    // private qualifyGroupMapper: QualifyGroupMapper;

    constructor(private pouleMapper: PouleMapper) {

    }

    toObject(json: JsonRound, roundNumber: RoundNumber, parentQualifyGroup?: QualifyGroup, round?: Round): Round {
        round = new Round(roundNumber, parentQualifyGroup);
        round.setId(json.id);
        json.poules.map(jsonPoule => this.pouleMapper.toObject(jsonPoule, round));

        const qualifyGroupMapper = new QualifyGroupMapper(this);
        json.qualifyGroups.forEach((jsonQualifyGroup) => {
            qualifyGroupMapper.toObject(jsonQualifyGroup, round);
            // this.toObject(jsonQualifyGroup.childRound, roundNumber.getNext(), round, round.getChildRound(jsonChildRound.winnersOrLosers));
        });

        // lines between should be moved to StructureService
        const horizontalPouleService = new HorizontalPouleService(round);
        horizontalPouleService.recreate();

        const qualifyRuleService = new QualifyRuleService(round);
        qualifyRuleService.recreate();
        // lines between should be moved to StructureService

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

export interface JsonRound {
    id?: number;
    name?: string;
    poules: JsonPoule[];
    qualifyGroups: JsonQualifyGroup[];
}
