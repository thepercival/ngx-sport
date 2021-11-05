import { HorizontalPoule } from '../../poule/horizontal';
import { QualifyGroup, Round } from '../group';
import { QualifyTarget } from '../target';
import { DefaultQualifyRuleCreator } from './defaultCreator';

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
                    const childRound = qualifyGroup.getChildRound();
                    const defaultCreator = new DefaultQualifyRuleCreator(childRound);
                    let nrOfChildRoundPlaces = childRound.getNrOfPlaces();
                    const fromHorPoules: HorizontalPoule[] = [];
                    while (nrOfChildRoundPlaces > 0) {
                        const fromRoundHorPoule = fromRoundHorPoules.shift();
                        if (fromRoundHorPoule === undefined) {
                            throw new Error('fromRoundHorPoule should not be undefined');
                        }
                        fromHorPoules.push(fromRoundHorPoule);
                        nrOfChildRoundPlaces -= fromRoundHorPoule.getPlaces().length;
                    }
                    defaultCreator.createRules(fromHorPoules, qualifyGroup);
                });
            })
        });
    }
}