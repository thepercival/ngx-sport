import { assert, expect } from 'chai';
import { describe, it } from 'mocha';
import { BalancedPouleStructure, Poule, QualifyTarget } from '../../../../public_api';
import { QualifyOriginCalculator } from '../../../../src/qualify/originCalculator';
import { QualifyRuleCreator } from '../../../../src/qualify/rule/creator';
import { DefaultQualifyRuleCreator } from '../../../../src/qualify/rule/defaultCreator';
import { jsonBaseCompetition } from '../../../data/competition';
import { createPlanningConfigNoTime } from '../../../helpers/planningConfigCreator';
import { getCompetitionMapper, getStructureEditor } from '../../../helpers/singletonCreator';
import { StructureOutput } from '../../../helpers/structureOutput';

describe('DefaultQualifyRuleCreator', () => {

    it('[4,4,4,4,4] => [2,2,2,2,2,2,2,2]', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, createPlanningConfigNoTime(), [4, 4, 4, 4, 4]);
        const rootRound = structure.getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2, 2, 2, 2, 2, 2, 2, 2]);

        const fromHorPoules = rootRound.getHorizontalPoules(QualifyTarget.Winners);
        const qualifyGroup = rootRound.getQualifyGroup(QualifyTarget.Winners, 1);
        assert(qualifyGroup !== undefined);
        expect(qualifyGroup).to.not.equal(undefined);
        if (qualifyGroup === undefined) {
            throw Error('qualifyGroup can not be undefined');
        }
        // (new QualifyRuleCreator()).remove(rootRound);
        // const defaultQualifyGroupnCalculator = new DefaultQualifyRuleCreator();
        // defaultQualifyGroupnCalculator.createRules(fromHorPoules, qualifyGroup);

        // (new StructureOutput()).output(structure, console);

        winnersRound.getPoules().forEach((poule: Poule) => {
            const fromPlace1 = qualifyGroup.getFromPlace(poule.getPlace(1));
            const fromPlace2 = qualifyGroup.getFromPlace(poule.getPlace(2));
            expect(fromPlace1?.getPoule()).to.not.equal(fromPlace2?.getPoule(), 'places in second round should not have same origin');
        });

        // const origins = originCalculator.getPossibleOrigins(rootRound.getPoule(1));
        // expect(origins.length).to.equal(0);
    });
});
