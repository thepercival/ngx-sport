import { Injectable } from '@angular/core';

import { JsonPoule, PouleMapper } from '../poule/mapper';
import { QualifyPoule } from '../qualify/poule';
import { QualifyPouleMapper } from '../qualify/poule/mapper';
import { Round } from '../round';
import { RoundNumber } from './number';
import { JsonQualifyPoule } from '../qualify/poule/mapper';

@Injectable()
export class RoundMapper {
    // private qualifyPouleMapper: QualifyPouleMapper;

    constructor(private pouleMapper: PouleMapper) { 
        
    }

    toObject(json: JsonRound, roundNumber: RoundNumber, parentQualifyPoule?: QualifyPoule, round?: Round): Round {
        round = new Round(roundNumber, parentQualifyPoule);
        round.setId(json.id);        
        json.poules.map(jsonPoule => this.pouleMapper.toObject(jsonPoule, round));
        // if (parentRound !== undefined) {
        //     const qualifyService = new QualifyRuleService(round.getParent(), round);
        //     qualifyService.createRules();
        // }
        
        const qualifyPouleMapper = new QualifyPouleMapper(this);
        json.qualifyPoules.forEach((jsonQualifyPoule) => {
            qualifyPouleMapper.toObject(jsonQualifyPoule,round);
            // this.toObject(jsonQualifyPoule.childRound, roundNumber.getNext(), round, round.getChildRound(jsonChildRound.winnersOrLosers));
        });

        return round;
    }

    toJson(round: Round): JsonRound {
        const qualifyPouleMapper = new QualifyPouleMapper(this);
        return {
            id: round.getId(),
            name: round.getName(),
            poules: round.getPoules().map(poule => this.pouleMapper.toJson(poule)),
            qualifyPoules: round.getQualifyPoules().map(qualifyPouleIt => qualifyPouleMapper.toJson(qualifyPouleIt))

            
        };
    }
}

export interface JsonRound {
    id?: number;
    name?: string;
    poules: JsonPoule[];
    qualifyPoules: JsonQualifyPoule[];
}
