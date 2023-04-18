import { Injectable } from '@angular/core';
import { AgainstQualifyConfigMapper } from '../qualify/againstConfig/mapper';
import { ScoreConfigMapper } from '../score/config/mapper';
import { PouleMapper } from '../poule/mapper';
import { QualifyGroupMapper } from '../qualify/group/mapper';
import { JsonRound } from './json';
import { Round } from '../qualify/group';
import { QualifyRuleCreator } from '../qualify/rule/creator';
import { HorizontalPouleCreator } from '../poule/horizontal/creator';
import { StructureCell } from '../structure/cell';

@Injectable({
    providedIn: 'root'
})
export class RoundMapper {

    constructor(
        private pouleMapper: PouleMapper,
        private scoreConfigMapper: ScoreConfigMapper,
        private againstQualifyConfigMapper: AgainstQualifyConfigMapper,
    ) {
        
    }

    toObject(json: JsonRound, round: Round): Round {
        round.setId(json.id);
        json.poules.map(jsonPoule => this.pouleMapper.toObject(jsonPoule, round, undefined));

        if (json.qualifyGroups.length > 0) {
            const nextStructureCell = round.getStructureCell().getNext();
            if (nextStructureCell === undefined) {
                throw new Error('structurecell does not exists');
            }
            const qualifyGroupMapper = new QualifyGroupMapper(this);
            json.qualifyGroups.forEach((jsonQualifyGroup) => {
                qualifyGroupMapper.toObject(jsonQualifyGroup, round, nextStructureCell);
            });
        }

        if (json.scoreConfigs) {
            json.scoreConfigs.forEach(jsonScoreConfig => {
                this.scoreConfigMapper.toObject(jsonScoreConfig, round);
            });
        }
        if (json.againstQualifyConfigs) {
            json.againstQualifyConfigs.forEach(jsonAgainstQualifyConfigs => {
                this.againstQualifyConfigMapper.toObject(jsonAgainstQualifyConfigs, round);
            });
        }
        

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
            againstQualifyConfigs: round.getAgainstQualifyConfigs().map(qualifyGroupIt => this.againstQualifyConfigMapper.toJson(qualifyGroupIt))
        };
    }
}
