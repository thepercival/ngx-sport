import { expect } from 'chai';
import { describe, it } from 'mocha';

import { StructureService } from '../../../public_api';
import { QualifyGroup } from '../../../tmp/public_api';
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

        for (let i = 1; i < 4; i++) { structureService.addQualifier(rootRound, QualifyGroup.WINNERS); }
        for (let i = 1; i < 4; i++) { structureService.addQualifier(rootRound, QualifyGroup.LOSERS); }

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

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

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

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

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

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

        const childRound = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS).getChildRound();

        expect(() => structureService.removePoule(childRound)).to.not.throw(Error);
        expect(() => structureService.addPoule(childRound)).to.not.throw(Error);
        expect(() => structureService.removePoule(childRound)).to.not.throw(Error);

        expect(childRound.getPoules().length).to.equal(1);
        expect(childRound.getNrOfPlaces()).to.equal(4);
    });

    it('qualifygroup unsplittable winners 332', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 8, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
            const horPoules = borderQualifyGroup.getHorizontalPoules();

            expect(horPoules.length).to.equal(2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(false);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[2], horPoules[1])).to.throw(Error);
        }

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
            const horPoules = borderQualifyGroup.getHorizontalPoules();

            expect(horPoules.length).to.equal(2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(true);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[0], horPoules[1])).to.not.throw(Error);
        }
    });

    it('qualifygroup (un)splittable losers 332', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 8, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
            const horPoules = borderQualifyGroup.getHorizontalPoules();

            expect(horPoules.length).to.equal(2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(false);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[2], horPoules[1])).to.throw(Error);
        }

        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
            const horPoules = borderQualifyGroup.getHorizontalPoules();

            expect(horPoules.length).to.equal(2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(true);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[0], horPoules[1])).to.not.throw(Error);
        }
    });

    it('qualifygroup (un)splittable winners 331', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 7, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
            const horPoules = borderQualifyGroup.getHorizontalPoules();

            expect(horPoules.length).to.equal(2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(false);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[2], horPoules[1])).to.throw(Error);
        }

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
            const horPoules = borderQualifyGroup.getHorizontalPoules();

            expect(horPoules.length).to.equal(2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(true);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[0], horPoules[1])).to.not.throw(Error);
        }
    });

    it('qualifygroup (un)splittable losers 331', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 7, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
            const horPoules = borderQualifyGroup.getHorizontalPoules();

            expect(horPoules.length).to.equal(2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(false);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[0], horPoules[1])).to.throw(Error);
        }

        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        {
            const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
            const horPoules = borderQualifyGroup.getHorizontalPoules();

            expect(horPoules.length).to.equal(2);

            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
            expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(true);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
            expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[1], horPoules[0])).to.not.throw(Error);
        }
    });

    it('qualifygroups unmergable winners 33', () => {

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 6, 3);
        const rootRound = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

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

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

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

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

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
