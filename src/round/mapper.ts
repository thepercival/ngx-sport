import { Injectable } from '@angular/core';
import { CompetitionSportMapper } from '../competition/sport/mapper';
import { QualifyAgainstConfigMapper } from '../qualify/againstConfig/mapper';
import { ScoreConfigMapper } from '../score/config/mapper';

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
    constructor(
        private pouleMapper: PouleMapper,
        private scoreConfigMapper: ScoreConfigMapper,
        private qualifyAgainstConfigMapper: QualifyAgainstConfigMapper,
    ) {

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
            qualifyGroups: round.getQualifyGroups().map(qualifyGroupIt => qualifyGroupMapper.toJson(qualifyGroupIt)),
            scoreConfigs: round.getScoreConfigs().map(scoreConfigIt => this.scoreConfigMapper.toJson(scoreConfigIt)),
            qualifyAgainstConfigs: round.getQualifyAgainstConfigs().map(qualifyGroupIt => this.qualifyAgainstConfigMapper.toJson(qualifyGroupIt))
        };
    }
}
