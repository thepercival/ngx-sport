import { Injectable } from '@angular/core';
import { QualifyAgainstConfigMapper } from '../qualify/againstConfig/mapper';
import { ScoreConfigMapper } from '../score/config/mapper';

import { HorizontalPouleService } from '../poule/horizontal/service';
import { PouleMapper } from '../poule/mapper';
import { QualifyGroupMapper } from '../qualify/group/mapper';
import { QualifyRuleService } from '../qualify/rule/service';
import { JsonRound } from './json';
import { Round } from '../qualify/group';

@Injectable({
    providedIn: 'root'
})
export class RoundMapper {
    private qualifyRuleService: QualifyRuleService;
    private horizontalPouleService: HorizontalPouleService;

    constructor(
        private pouleMapper: PouleMapper,
        private scoreConfigMapper: ScoreConfigMapper,
        private qualifyAgainstConfigMapper: QualifyAgainstConfigMapper,
    ) {
        this.qualifyRuleService = new QualifyRuleService();
        this.horizontalPouleService = new HorizontalPouleService();
    }

    toObject(json: JsonRound, round: Round): Round {
        round.setId(json.id);
        json.poules.map(jsonPoule => this.pouleMapper.toObject(jsonPoule, round, undefined));

        const nextRoundNumber = round.getNumber().getNext();
        if (nextRoundNumber) {
            const qualifyGroupMapper = new QualifyGroupMapper(this);
            json.qualifyGroups.forEach((jsonQualifyGroup) => {
                qualifyGroupMapper.toObject(jsonQualifyGroup, round, nextRoundNumber);
            });
        }

        if (json.scoreConfigs) {
            json.scoreConfigs.forEach(jsonScoreConfig => {
                this.scoreConfigMapper.toObject(jsonScoreConfig, round);
            });
        }
        if (json.qualifyAgainstConfigs) {
            json.qualifyAgainstConfigs.forEach(jsonQualifyAgainstConfigs => {
                this.qualifyAgainstConfigMapper.toObject(jsonQualifyAgainstConfigs, round);
            });
        }


        this.qualifyRuleService.removeTo(round);
        this.horizontalPouleService.remove(round);
        this.horizontalPouleService.create(round);
        this.qualifyRuleService.createTo(round);

        return round;
    }

    toJson(round: Round): JsonRound {
        const qualifyGroupMapper = new QualifyGroupMapper(this);
        return {
            id: round.getId(),
            name: round.getName(),
            poules: round.getPoules().map(poule => this.pouleMapper.toJson(poule)),
            qualifyGroups: round.getQualifyGroups().map(qualifyGroupIt => qualifyGroupMapper.toJson(qualifyGroupIt)),
            scoreConfigs: round.getScoreConfigs().map(scoreConfigIt => this.scoreConfigMapper.toJson(scoreConfigIt)),
            qualifyAgainstConfigs: round.getQualifyAgainstConfigs().map(qualifyGroupIt => this.qualifyAgainstConfigMapper.toJson(qualifyGroupIt))
        };
    }
}
