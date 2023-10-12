import { QualifyDistribution } from '../distribution';
import { QualifyGroup, Round } from '../group';
import { QualifyTarget } from '../target';
import { HorizontalQualifyRuleCreator } from './creator/horizontal';
import { VerticalQualifyRuleCreator } from './creator/vertical';

export class QualifyRuleCreator {

    constructor() {
    }

    remove(...parentRounds: (Round | undefined)[]) {
        parentRounds.forEach((parentRound: Round | undefined) => {
            if (parentRound === undefined) {
                return;
            }
            parentRound.getQualifyGroups().forEach((qualifyGroup: QualifyGroup) => {
                qualifyGroup.detachRules();
            });
        });
    }

    create(...parentRounds: (Round | undefined)[]) {
        [QualifyTarget.Winners, QualifyTarget.Losers].forEach((target: QualifyTarget) => {
            parentRounds.forEach((parentRound: Round | undefined) => {
                if (parentRound === undefined) {
                    return;
                }
                const fromRoundHorPoules = parentRound.getHorizontalPoules(target).slice();
                parentRound.getQualifyGroups(target).forEach((qualifyGroup: QualifyGroup) => {
                    if( qualifyGroup.getDistribution() === QualifyDistribution.HorizontalSnake ) {
                        const childRound = qualifyGroup.getChildRound();
                        const horizontalCreator = new HorizontalQualifyRuleCreator(childRound);
                        horizontalCreator.createRules(fromRoundHorPoules, qualifyGroup);
                    } else {
                        const verticalCreator = new VerticalQualifyRuleCreator();
                        verticalCreator.createRules(fromRoundHorPoules, qualifyGroup);
                    }                    
                });
            })
        });
    }
}