import { expect } from 'chai';
import { describe, it } from 'mocha';

import { QualifyTarget, StructureEditor } from '../../../../public-api';
import { QualifyGroup, HorizontalPoule } from '../../../../public-api';
import { getMapper } from '../../../helpers/singletonCreator';
import { jsonCompetition } from '../../../data/competition';
import { check332astructure } from './332a';

describe('Structure/Service', () => {

    it('332a', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 8, 3);
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 4);
        structureEditor.addQualifiers(rootRound, QualifyTarget.Losers, 4);

        [QualifyTarget.Winners, QualifyTarget.Losers].forEach((qualifyTarget: QualifyTarget) => {
            const childRound = rootRound.getBorderQualifyGroup(qualifyTarget).getChildRound();
            structureEditor.addQualifier(childRound, QualifyTarget.Winners);
            structureEditor.addQualifier(childRound, QualifyTarget.Losers);
        });

        check332astructure(structure);
    });

    it('default poules', () => {
        const structureEditor = new StructureEditor({ min: 3, max: 40 });

        expect(() => structureEditor.getDefaultNrOfPoules(2)).to.throw(Error);
        expect(structureEditor.getDefaultNrOfPoules(3)).to.equal(1);
        expect(structureEditor.getDefaultNrOfPoules(40)).to.equal(8);
        expect(() => structureEditor.getDefaultNrOfPoules(41)).to.throw(Error);

        const structureEditor2 = new StructureEditor();
        expect(structureEditor2.getDefaultNrOfPoules(2)).to.equal(1);
        expect(() => structureEditor2.getDefaultNrOfPoules(1)).to.throw(Error);
        expect(structureEditor2.getDefaultNrOfPoules(41)).to.equal(8);
    });

    it('minimal number of places per poule', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 6, 3);
        const rootRound = structure.getRootRound();

        expect(() => structureEditor.removePlaceFromRootRound(rootRound)).to.throw(Error);
    });

    it('minimal number of places/poules', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 4, 2);
        const rootRound = structure.getRootRound();

        expect(() => structureEditor.removePoule(rootRound, false)).to.not.throw(Error);

        expect(() => structureEditor.removePoule(rootRound, false)).to.throw(Error);
    });

    it('maximal number of places', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor({ min: 3, max: 40 });
        const structure = structureEditor.create(competition, 36, 6);
        const rootRound = structure.getRootRound();

        expect(() => structureEditor.addPoule(rootRound, true)).to.throw(Error);
    });

    it('minumum number of qualifiers', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 4, 2);
        const rootRound = structure.getRootRound();

        structureEditor.addPlaceToRootRound(rootRound);
        structureEditor.addPlaceToRootRound(rootRound);

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 3);

        structureEditor.addQualifier(rootRound, QualifyTarget.Losers);

        expect(() => structureEditor.removePlaceFromRootRound(rootRound)).to.not.throw(Error);
        expect(() => structureEditor.removePlaceFromRootRound(rootRound)).to.throw(Error);

        structureEditor.addPlaceToRootRound(rootRound);

        structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
        structureEditor.removeQualifier(rootRound, QualifyTarget.Losers);

        expect(() => structureEditor.removePoule(rootRound, true)).to.throw(Error);
    });

    it('maximal number of qualifiers', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 4, 2);
        const rootRound = structure.getRootRound();

        expect(() => structureEditor.addQualifier(rootRound, QualifyTarget.Winners)).to.not.throw(Error);
        expect(() => structureEditor.addQualifier(rootRound, QualifyTarget.Winners)).to.not.throw(Error);
        expect(() => structureEditor.addQualifier(rootRound, QualifyTarget.Winners)).to.not.throw(Error);

        structureEditor.removeQualifier(rootRound, QualifyTarget.Winners);
        structureEditor.addQualifier(rootRound, QualifyTarget.Winners);

        expect(() => structureEditor.addQualifier(rootRound, QualifyTarget.Winners)).to.throw(Error);
    });

    it('qualifiers available', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 8, 2);
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 4);

        expect(() => structureEditor.removePoule(rootRound, true)).to.not.throw(Error);
        expect(() => structureEditor.removePoule(rootRound, true)).to.throw(Error);
    });

    it('competitor range', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor({ min: 3, max: 40 });
        const structure = structureEditor.create(competition, 3, 1);
        const rootRound = structure.getRootRound();

        expect(() => structureEditor.removePlaceFromRootRound(rootRound)).to.throw(Error);

        const structure2 = structureEditor.create(competition, 40, 4);
        const rootRound2 = structure2.getRootRound();

        expect(() => structureEditor.addPlaceToRootRound(rootRound2)).to.throw(Error);
    });

    it('remove poule next round', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 6);
        const rootRound = structure.getRootRound();
        structureEditor.addPoule(rootRound, true);

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 4);

        const childRound = rootRound.getBorderQualifyGroup(QualifyTarget.Winners).getChildRound();

        expect(() => structureEditor.removePoule(childRound)).to.not.throw(Error);
        expect(() => structureEditor.addPoule(childRound)).to.not.throw(Error);
        expect(() => structureEditor.removePoule(childRound)).to.not.throw(Error);

        expect(childRound.getPoules().length).to.equal(1);
        expect(childRound.getNrOfPlaces()).to.equal(4);
    });

    it('qualifygroup splittable winners 332', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 8, 3);
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 4);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Winners);
            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 2);

            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(false);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.throw(Error);
        }

        structureEditor.addQualifier(rootRound, QualifyTarget.Winners);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Winners);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 2);

            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(true);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.not.throw(Error);
        }
    });

    it('qualifygroup splittable losers 332', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 8, 3);
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Losers, 4);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Losers);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyTarget.Losers, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyTarget.Losers, 2);

            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(false);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.throw(Error);
        }

        structureEditor.addQualifier(rootRound, QualifyTarget.Losers);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Losers);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyTarget.Losers, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyTarget.Losers, 2);

            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(true);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.not.throw(Error);
        }
    });

    it('qualifygroup splittable winners 331', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 7, 3);
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 4);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Winners);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 2);

            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(false);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.throw(Error);
        }

        structureEditor.addQualifier(rootRound, QualifyTarget.Winners);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Winners);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 2);

            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(true);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.not.throw(Error);
        }
    });

    it('qualifygroup splittable losers 331', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 7, 3);
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Losers, 4);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Losers);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyTarget.Losers, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyTarget.Losers, 2);

            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(false);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.throw(Error);
        }

        structureEditor.addQualifier(rootRound, QualifyTarget.Losers);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Losers);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyTarget.Losers, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyTarget.Losers, 2);

            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureEditor.isQualifyGroupSplittable(horPoule2, horPoule1)).to.equal(true);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureEditor.splitQualifyGroup(borderQualifyGroup, horPoule2, horPoule1)).to.not.throw(Error);
        }
    });

    it('qualifygroup split order', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 12, 2);
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 12);

        const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Winners);

        expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(6);

        const horPoule4 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 4);
        const horPoule5 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 5);

        // nrs 1 t/ 4(8) opgesplits van nrs 5 t/m 6(4)
        structureEditor.splitQualifyGroup(borderQualifyGroup, horPoule4, horPoule5);

        const horPoule2 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 2);
        const horPoule3 = rootRound.getHorizontalPoule(QualifyTarget.Winners, 3);

        const firstQualifyGroup = rootRound.getQualifyGroup(QualifyTarget.Winners, 1);

        // nrs 1 t/ 2(4), nrs 3 t/ 4(4) en nrs 5 t/m 6(4)
        structureEditor.splitQualifyGroup(firstQualifyGroup, horPoule2, horPoule3);

        const qualifyGroup12 = rootRound.getQualifyGroup(QualifyTarget.Winners, 1);
        const qualifyGroup56 = rootRound.getBorderQualifyGroup(QualifyTarget.Winners);

        const horPoule1c = rootRound.getHorizontalPoule(QualifyTarget.Winners, 1);
        const horPoule2c = rootRound.getHorizontalPoule(QualifyTarget.Winners, 2);
        const horPoule3c = rootRound.getHorizontalPoule(QualifyTarget.Winners, 3);
        const horPoule4c = rootRound.getHorizontalPoule(QualifyTarget.Winners, 4);
        const horPoule5c = rootRound.getHorizontalPoule(QualifyTarget.Winners, 5);
        const horPoule6c = rootRound.getHorizontalPoule(QualifyTarget.Winners, 6);

        const hasHorPoule = (qualifyGroup: QualifyGroup, horPoule: HorizontalPoule): boolean => {
            return qualifyGroup.getHorizontalPoules().find(horPouleIt => horPouleIt === horPoule) !== undefined;
        };
        expect(hasHorPoule(qualifyGroup12, horPoule1c)).to.equal(true);
        expect(hasHorPoule(qualifyGroup12, horPoule2c)).to.equal(true);
        expect(hasHorPoule(qualifyGroup12, horPoule3c)).to.equal(false);
        expect(hasHorPoule(qualifyGroup12, horPoule4c)).to.equal(false);
        expect(hasHorPoule(qualifyGroup56, horPoule5c)).to.equal(true);
        expect(hasHorPoule(qualifyGroup56, horPoule6c)).to.equal(true);
        expect(hasHorPoule(qualifyGroup56, horPoule3c)).to.equal(false);
        expect(hasHorPoule(qualifyGroup56, horPoule4c)).to.equal(false);
    });

    it('qualifygroups mergable 33', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 6, 3);
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 3);
        structureEditor.addQualifiers(rootRound, QualifyTarget.Losers, 3);

        {
            const winnersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Winners);
            const losersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Losers);

            expect(structureEditor.areQualifyGroupsMergable(undefined, winnersBorderQualifyGroup)).to.equal(false);
            expect(structureEditor.areQualifyGroupsMergable(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.equal(false);
            expect(structureEditor.areQualifyGroupsMergable(winnersBorderQualifyGroup, undefined)).to.equal(false);

            expect(() => structureEditor.mergeQualifyGroups(undefined, winnersBorderQualifyGroup)).to.throw(Error);
            expect(() => structureEditor.mergeQualifyGroups(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.throw(Error);
            expect(() => structureEditor.mergeQualifyGroups(winnersBorderQualifyGroup, undefined)).to.throw(Error);
        }
    });

    it('qualifygroups mergable 544', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 13, 3);
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 5);
        structureEditor.addQualifiers(rootRound, QualifyTarget.Losers, 5);

        {
            const winnersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Winners);
            const losersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Losers);

            expect(structureEditor.areQualifyGroupsMergable(winnersBorderQualifyGroup, winnersBorderQualifyGroup)).to.equal(false);
            expect(structureEditor.areQualifyGroupsMergable(undefined, winnersBorderQualifyGroup)).to.equal(false);
            expect(structureEditor.areQualifyGroupsMergable(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.equal(false);
            expect(structureEditor.areQualifyGroupsMergable(winnersBorderQualifyGroup, undefined)).to.equal(false);

            expect(() => structureEditor.mergeQualifyGroups(undefined, winnersBorderQualifyGroup)).to.throw(Error);
            expect(() => structureEditor.mergeQualifyGroups(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.throw(Error);
            expect(() => structureEditor.mergeQualifyGroups(winnersBorderQualifyGroup, undefined)).to.throw(Error);
        }
    });

    it('qualifygroups mergable 544', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureEditor = new StructureEditor();
        const structure = structureEditor.create(competition, 13, 3);
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 5);
        structureEditor.addQualifiers(rootRound, QualifyTarget.Losers, 5);

        const winnersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Winners);
        const winHorPoules = winnersBorderQualifyGroup.getHorizontalPoules();

        expect(() => structureEditor.splitQualifyGroup(winnersBorderQualifyGroup, winHorPoules[0], winHorPoules[1])).to.not.throw(Error);
        const winnersBorderQualifyGroups = rootRound.getQualifyGroups(QualifyTarget.Winners);
        expect(() => structureEditor.mergeQualifyGroups(winnersBorderQualifyGroups[1], winnersBorderQualifyGroups[0])).to.not.throw(Error);

        const losersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyTarget.Losers);
        const losHorPoules = losersBorderQualifyGroup.getHorizontalPoules();

        expect(() => structureEditor.splitQualifyGroup(winnersBorderQualifyGroup, losHorPoules[0], losHorPoules[1])).to.not.throw(Error);
        const losersBorderQualifyGroups = rootRound.getQualifyGroups(QualifyTarget.Losers);
        expect(() => structureEditor.mergeQualifyGroups(losersBorderQualifyGroups[0], losersBorderQualifyGroups[1])).to.not.throw(Error);
    });
});
