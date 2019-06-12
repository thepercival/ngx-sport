import { expect } from 'chai';
import { describe, it } from 'mocha';

import { StructureService } from '../../../public_api';
import { QualifyGroup, HorizontalPoule } from '../../../public_api';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { check332astructure } from './332a';

describe('Structure/Service', () => {

    it('332a', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 8, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 4);
        structureService.addQualifiers(rootRound, QualifyGroup.LOSERS, 4);

        [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
            const childRound = rootRound.getBorderQualifyGroup(winnersOrLosers).getChildRound();
            structureService.addQualifier(childRound, QualifyGroup.WINNERS);
            structureService.addQualifier(childRound, QualifyGroup.LOSERS);
        });

        check332astructure(structure);
    });

    it('default poules', () => {
        const structureService = new StructureService({ min: 3, max: 40 });

        expect(() => structureService.getDefaultNrOfPoules(2)).to.throw(Error);
        expect(structureService.getDefaultNrOfPoules(3)).to.equal(1);
        expect(structureService.getDefaultNrOfPoules(40)).to.equal(8);
        expect(() => structureService.getDefaultNrOfPoules(41)).to.throw(Error);

        const structureService2 = new StructureService();
        expect(structureService2.getDefaultNrOfPoules(2)).to.equal(1);
        expect(() => structureService2.getDefaultNrOfPoules(1)).to.throw(Error);
        expect(structureService2.getDefaultNrOfPoules(41)).to.equal(8);
    });

    it('minimal number of places per poule', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 6, 3);
        const rootRound = structure.getRootRound();

        expect(() => structureService.removePlaceFromRootRound(rootRound)).to.throw(Error);
    });

    it('minimal number of places/poules', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 2);
        const rootRound = structure.getRootRound();

        expect(() => structureService.removePoule(rootRound, false)).to.not.throw(Error);

        expect(() => structureService.removePoule(rootRound, false)).to.throw(Error);
    });

    it('maximal number of places', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService({ min: 3, max: 40 });
        const structure = structureService.create(competition, 36, 6);
        const rootRound = structure.getRootRound();

        expect(() => structureService.addPoule(rootRound, true)).to.throw(Error);
    });

    it('minumum number of qualifiers', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 2);
        const rootRound = structure.getRootRound();

        structureService.addPlaceToRootRound(rootRound);
        structureService.addPlaceToRootRound(rootRound);

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 3);

        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        expect(() => structureService.removePlaceFromRootRound(rootRound)).to.not.throw(Error);
        expect(() => structureService.removePlaceFromRootRound(rootRound)).to.throw(Error);

        structureService.addPlaceToRootRound(rootRound);

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.removeQualifier(rootRound, QualifyGroup.LOSERS);

        expect(() => structureService.removePoule(rootRound, true)).to.throw(Error);
    });

    it('maximal number of qualifiers', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 2);
        const rootRound = structure.getRootRound();

        expect(() => structureService.addQualifier(rootRound, QualifyGroup.WINNERS)).to.not.throw(Error);
        expect(() => structureService.addQualifier(rootRound, QualifyGroup.WINNERS)).to.not.throw(Error);
        expect(() => structureService.addQualifier(rootRound, QualifyGroup.WINNERS)).to.not.throw(Error);

        structureService.removeQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

        expect(() => structureService.addQualifier(rootRound, QualifyGroup.WINNERS)).to.throw(Error);
    });

    it('qualifiers available', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 8, 2);
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 4);

        expect(() => structureService.removePoule(rootRound, true)).to.not.throw(Error);
        expect(() => structureService.removePoule(rootRound, true)).to.throw(Error);
    });

    it('competitor range', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService({ min: 3, max: 40 });
        const structure = structureService.create(competition, 3, 1);
        const rootRound = structure.getRootRound();

        expect(() => structureService.removePlaceFromRootRound(rootRound)).to.throw(Error);

        const structure2 = structureService.create(competition, 40, 4);
        const rootRound2 = structure2.getRootRound();

        expect(() => structureService.addPlaceToRootRound(rootRound2)).to.throw(Error);
    });

    it('remove poule next round', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 6);
        const rootRound = structure.getRootRound();
        structureService.addPoule(rootRound, true);

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 4);

        const childRound = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS).getChildRound();

        expect(() => structureService.removePoule(childRound)).to.not.throw(Error);
        expect(() => structureService.addPoule(childRound)).to.not.throw(Error);
        expect(() => structureService.removePoule(childRound)).to.not.throw(Error);

        expect(childRound.getPoules().length).to.equal(1);
        expect(childRound.getNrOfPlaces()).to.equal(4);
    });

    it('qualifygroup splittable winners 332', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 8, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 4);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(false);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.throw(Error);
        }

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(true);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.not.throw(Error);
        }
    });

    it('qualifygroup splittable losers 332', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 8, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.LOSERS, 4);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyGroup.LOSERS, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyGroup.LOSERS, 2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(false);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.throw(Error);
        }

        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyGroup.LOSERS, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyGroup.LOSERS, 2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(true);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.not.throw(Error);
        }
    });

    it('qualifygroup splittable winners 331', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 7, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 4);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(false);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.throw(Error);
        }

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(true);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.not.throw(Error);
        }
    });

    it('qualifygroup splittable losers 331', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 7, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.LOSERS, 4);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyGroup.LOSERS, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyGroup.LOSERS, 2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoule1, horPoule2)).to.equal(false);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoule1, horPoule2)).to.throw(Error);
        }

        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);

            expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(2);

            const horPoule1 = rootRound.getHorizontalPoule(QualifyGroup.LOSERS, 1);
            const horPoule2 = rootRound.getHorizontalPoule(QualifyGroup.LOSERS, 2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoule1)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoule2)).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoule2, horPoule1)).to.equal(true);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule1)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoule2)).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoule2, horPoule1)).to.not.throw(Error);
        }
    });

    it('qualifygroup split order', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 12, 2);
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 12);

        const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);

        expect(borderQualifyGroup.getHorizontalPoules().length).to.equal(6);

        const horPoule4 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 4);
        const horPoule5 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 5);

        // nrs 1 t/ 4(8) opgesplits van nrs 5 t/m 6(4)
        structureService.splitQualifyGroup(borderQualifyGroup, horPoule4, horPoule5);

        const horPoule2 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 2);
        const horPoule3 = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 3);

        const firstQualifyGroup = rootRound.getQualifyGroup(QualifyGroup.WINNERS, 1);

        // nrs 1 t/ 2(4), nrs 3 t/ 4(4) en nrs 5 t/m 6(4)
        structureService.splitQualifyGroup(firstQualifyGroup, horPoule2, horPoule3);

        const qualifyGroup12 = rootRound.getQualifyGroup(QualifyGroup.WINNERS, 1);
        const qualifyGroup56 = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);

        const horPoule1c = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 1);
        const horPoule2c = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 2);
        const horPoule3c = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 3);
        const horPoule4c = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 4);
        const horPoule5c = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 5);
        const horPoule6c = rootRound.getHorizontalPoule(QualifyGroup.WINNERS, 6);

        const hasHorPoule = ( qualifyGroup: QualifyGroup, horPoule: HorizontalPoule ): boolean => {
            return qualifyGroup.getHorizontalPoules().find( horPouleIt => horPouleIt === horPoule ) !== undefined;
        };
        expect(hasHorPoule( qualifyGroup12, horPoule1c)).to.equal(true);
        expect(hasHorPoule( qualifyGroup12, horPoule2c)).to.equal(true);
        expect(hasHorPoule( qualifyGroup12, horPoule3c)).to.equal(false);
        expect(hasHorPoule( qualifyGroup12, horPoule4c)).to.equal(false);
        expect(hasHorPoule( qualifyGroup56, horPoule5c)).to.equal(true);
        expect(hasHorPoule( qualifyGroup56, horPoule6c)).to.equal(true);
        expect(hasHorPoule( qualifyGroup56, horPoule3c)).to.equal(false);
        expect(hasHorPoule( qualifyGroup56, horPoule4c)).to.equal(false);
    });

    it('qualifygroups unmergable winners 33', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 6, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 3);
        structureService.addQualifiers(rootRound, QualifyGroup.LOSERS, 3);

        {
            const winnersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
            const losersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
            // const horPoules = borderQualifyGroup.getHorizontalPoules();

            expect(structureService.areQualifyGroupsMergable(undefined, winnersBorderQualifyGroup)).to.equal(false);
            expect(structureService.areQualifyGroupsMergable(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.equal(false);
            expect(structureService.areQualifyGroupsMergable(winnersBorderQualifyGroup, undefined)).to.equal(false);

            expect(() => structureService.mergeQualifyGroups(undefined, winnersBorderQualifyGroup)).to.throw(Error);
            expect(() => structureService.mergeQualifyGroups(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.throw(Error);
            expect(() => structureService.mergeQualifyGroups(winnersBorderQualifyGroup, undefined)).to.throw(Error);
        }
    });

    it('qualifygroups unmergable winners 544', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 13, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 5);
        structureService.addQualifiers(rootRound, QualifyGroup.LOSERS, 5);

        {
            const winnersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
            const losersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
            // const horPoules = borderQualifyGroup.getHorizontalPoules();

            expect(structureService.areQualifyGroupsMergable(winnersBorderQualifyGroup, winnersBorderQualifyGroup)).to.equal(false);
            expect(structureService.areQualifyGroupsMergable(undefined, winnersBorderQualifyGroup)).to.equal(false);
            expect(structureService.areQualifyGroupsMergable(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.equal(false);
            expect(structureService.areQualifyGroupsMergable(winnersBorderQualifyGroup, undefined)).to.equal(false);

            expect(() => structureService.mergeQualifyGroups(undefined, winnersBorderQualifyGroup)).to.throw(Error);
            expect(() => structureService.mergeQualifyGroups(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.throw(Error);
            expect(() => structureService.mergeQualifyGroups(winnersBorderQualifyGroup, undefined)).to.throw(Error);
        }
    });

    it('qualifygroups mergable winners 544', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 13, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 5);
        structureService.addQualifiers(rootRound, QualifyGroup.LOSERS, 5);

        const winnersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
        const winHorPoules = winnersBorderQualifyGroup.getHorizontalPoules();

        expect(() => structureService.splitQualifyGroup(winnersBorderQualifyGroup, winHorPoules[0], winHorPoules[1])).to.not.throw(Error);
        const winnersBorderQualifyGroups = rootRound.getQualifyGroups(QualifyGroup.WINNERS);
        expect(() => structureService.mergeQualifyGroups(winnersBorderQualifyGroups[1], winnersBorderQualifyGroups[0])).to.not.throw(Error);

        const losersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
        const losHorPoules = losersBorderQualifyGroup.getHorizontalPoules();

        expect(() => structureService.splitQualifyGroup(winnersBorderQualifyGroup, losHorPoules[0], losHorPoules[1])).to.not.throw(Error);
        const losersBorderQualifyGroups = rootRound.getQualifyGroups(QualifyGroup.LOSERS);
        expect(() => structureService.mergeQualifyGroups(losersBorderQualifyGroups[0], losersBorderQualifyGroups[1])).to.not.throw(Error);
    });
});
