import { assert, expect } from 'chai';
import { describe, it } from 'mocha';
import { BalancedPouleStructure, Place, Poule, QualifyTarget } from '../../../../public-api';
import { QualifyOriginCalculator } from '../../../../src/qualify/originCalculator';
import { QualifyRuleCreator } from '../../../../src/qualify/rule/creator';
import { DefaultQualifyRuleCreator } from '../../../../src/qualify/rule/defaultCreator';
import { jsonBaseCompetition } from '../../../data/competition';
import { createPlanningConfigNoTime } from '../../../helpers/planningConfigCreator';
import { getCompetitionMapper, getStructureEditor } from '../../../helpers/singletonCreator';
import { StructureOutput } from '../../../helpers/structureOutput';

describe('DefaultQualifyRuleCreator', () => {

    it('[3,3,3] => [2,2,2,2]', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 3], createPlanningConfigNoTime());
        const rootRound = structure.getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2, 2, 2, 2]);

        const qualifyGroup = rootRound.getQualifyGroup(QualifyTarget.Winners, 1);
        assert(qualifyGroup !== undefined);
        expect(qualifyGroup).to.not.equal(undefined);
        if (qualifyGroup === undefined) {
            throw Error('qualifyGroup can not be undefined');
        }

        // (new StructureOutput()).toConsole(structure, console);

        winnersRound.getPoules().forEach((poule: Poule) => {
            const fromPlace1 = qualifyGroup.getFromPlace(poule.getPlace(1));
            const fromPlace2 = qualifyGroup.getFromPlace(poule.getPlace(2));
            expect(fromPlace1?.getPoule()).to.not.equal(fromPlace2?.getPoule(), 'places in second round should not have same origin');
        });

        // const origins = originCalculator.getPossibleOrigins(rootRound.getPoule(1));
        // expect(origins.length).to.equal(0);
    });

    it('[4,4,4,4,4] => [2,2,2,2,2,2,2,2]', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4, 4, 4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2, 2, 2, 2, 2, 2, 2, 2]);

        const qualifyGroup = rootRound.getQualifyGroup(QualifyTarget.Winners, 1);
        assert(qualifyGroup !== undefined);
        expect(qualifyGroup).to.not.equal(undefined);
        if (qualifyGroup === undefined) {
            throw Error('qualifyGroup can not be undefined');
        }

        // (new StructureOutput()).toConsole(structure, console);

        winnersRound.getPoules().forEach((poule: Poule) => {
            const fromPlace1 = qualifyGroup.getFromPlace(poule.getPlace(1));
            const fromPlace2 = qualifyGroup.getFromPlace(poule.getPlace(2));
            expect(fromPlace1?.getPoule()).to.not.equal(fromPlace2?.getPoule(), 'places in second round should not have same origin');
        });

        // const origins = originCalculator.getPossibleOrigins(rootRound.getPoule(1));
        // expect(origins.length).to.equal(0);
    });


    it('[4,4,4,4] => [2,2,2,2,2,2,2,2] => [2,2,2,2]', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4, 4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2, 2, 2, 2, 2, 2, 2, 2]);

        const firstQualifyGroup = rootRound.getQualifyGroup(QualifyTarget.Winners, 1);
        expect(firstQualifyGroup).to.not.equal(undefined);
        if (firstQualifyGroup === undefined) {
            throw Error('firstQualifyGroup can not be undefined');
        }
        const quarterFinal = structureEditor.addChildRound(winnersRound, QualifyTarget.Winners, [2, 2, 2, 2]);
        const lastQualifyGroup = winnersRound.getQualifyGroup(QualifyTarget.Winners, 1);
        expect(lastQualifyGroup).to.not.equal(undefined);
        if (lastQualifyGroup === undefined) {
            throw Error('lastQualifyGroup can not be undefined');
        }

        // (new StructureOutput()).toConsole(structure, console);

        quarterFinal.getPoules().forEach((poule: Poule) => {
            // fromPlace1
            const fromPlace1 = lastQualifyGroup.getFromPlace(poule.getPlace(1));
            expect(fromPlace1).to.not.equal(undefined);
            if (fromPlace1 === undefined) {
                throw Error('fromPlace1 can not be undefined');
            }
            const grandParentPlaces1: Place[] = [];
            fromPlace1.getPoule().getPlaces().forEach((parentPlace: Place) => {
                const grandParentPlace = firstQualifyGroup.getFromPlace(parentPlace);
                if (grandParentPlace === undefined) {
                    throw Error('grandParentPlace can not be undefined');
                }
                grandParentPlaces1.push(grandParentPlace);
            });
            const grandParentPoules1 = grandParentPlaces1.map((place: Place) => place.getPoule());

            // fromPlace2
            const fromPlace2 = lastQualifyGroup.getFromPlace(poule.getPlace(2));
            expect(fromPlace2).to.not.equal(undefined);
            if (fromPlace2 === undefined) {
                throw Error('fromPlace2 can not be undefined');
            }
            const grandParentPlaces2: Place[] = [];
            fromPlace2.getPoule().getPlaces().forEach((parentPlace: Place) => {
                const grandParentPlace = firstQualifyGroup.getFromPlace(parentPlace);
                if (grandParentPlace === undefined) {
                    throw Error('grandParentPlace can not be undefined');
                }
                grandParentPlaces2.push(grandParentPlace);
            });
            const grandParentPoules2 = grandParentPlaces2.map((place: Place) => place.getPoule());

            grandParentPoules1.forEach((grandParentPoule1: Poule) => {
                const msg = 'poule "' + poule.getNumber() + '" should not be among poules';
                const hasOverlap = grandParentPoules2.indexOf(grandParentPoule1) >= 0;
                expect(hasOverlap, msg).to.be.false;
            });
        });
    });

    it('performance', () => {

        const createStructure = () => {
            const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

            const structureEditor = getStructureEditor();
            const structure = structureEditor.create(competition, [8, 8, 8, 8, 8], createPlanningConfigNoTime());
            const rootRound = structure.getRootRound();

            const secondRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [6, 6, 6, 6, 6]);
            const thirdRound = structureEditor.addChildRound(secondRound, QualifyTarget.Winners, [4, 4, 4, 4, 4]);
            const fourthRound = structureEditor.addChildRound(thirdRound, QualifyTarget.Winners, [2, 2, 2, 2, 2, 2, 2, 2]);
            const quarterFinal = structureEditor.addChildRound(fourthRound, QualifyTarget.Winners, [2, 2, 2, 2]);
            const semiFinal = structureEditor.addChildRound(quarterFinal, QualifyTarget.Winners, [2, 2]);
            structureEditor.addChildRound(semiFinal, QualifyTarget.Winners, [2]);
            // (new StructureOutput()).toConsole(structure, console);
        };

        // (async function demo() {
        let beginning = new Date().getTime();;
        // await createStructure();
        createStructure();
        const duration = new Date().getTime() - beginning;
        expect(duration).to.be.below(10);
        // })();
    });
});
