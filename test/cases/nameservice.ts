import { expect } from 'chai';
import { describe, it } from 'mocha';

import { NameService } from '../../src/nameservice';
import { QualifyGroup } from '../../src/qualify/group';
import { StructureService } from '../../src/structure/service';
import { getMapper } from '../createmapper';
import { jsonCompetition } from '../data/competition';

describe('NameService', () => {

    it('winnerslosers description', () => {

        const nameService = new NameService();

        expect(nameService.getWinnersLosersDescription(QualifyGroup.WINNERS)).to.equal('winnaar');
        expect(nameService.getWinnersLosersDescription(QualifyGroup.LOSERS)).to.equal('verliezer');
        expect(nameService.getWinnersLosersDescription(QualifyGroup.WINNERS, true)).to.equal('winnaars');
        expect(nameService.getWinnersLosersDescription(QualifyGroup.LOSERS, true)).to.equal('verliezers');
        expect(nameService.getWinnersLosersDescription(QualifyGroup.DROPOUTS)).to.equal('');
    });

    it('roundnumber name', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 8, 3);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const rootRound = structure.getRootRound();

        for (let i = 1; i < 4; i++) { structureService.addQualifier(rootRound, QualifyGroup.WINNERS); }
        for (let i = 1; i < 4; i++) { structureService.addQualifier(rootRound, QualifyGroup.LOSERS); }

        const secondRoundNumberName = nameService.getRoundNumberName(firstRoundNumber.getNext());
        // all equal
        expect(secondRoundNumberName).to.equal('finale');

        const losersChildRound = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS).getChildRound();

        structureService.addQualifier(losersChildRound, QualifyGroup.LOSERS);
        // not all equal
        const newSecondRoundNumberName = nameService.getRoundNumberName(firstRoundNumber.getNext());
        expect(newSecondRoundNumberName).to.equal('2<sup>de</sup> ronde');
    });

    it('round name, roundAndParentsNeedsRanking no ranking', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        // root needs no ranking, unequal depth
        {
            const structureService = new StructureService();
            const structure = structureService.create(competition, 4, 2);
            const rootRound = structure.getRootRound();

            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

            expect(nameService.getRoundName(rootRound)).to.equal('1<sup>ste</sup> ronde');

            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

            expect(nameService.getRoundName(rootRound)).to.equal('&frac12; finale');
        }

        // root needs ranking
        {
            const structureService2 = new StructureService();
            const structure2 = structureService2.create(competition, 16, 4);
            const rootRound2 = structure2.getRootRound();

            expect(nameService.getRoundName(rootRound2)).to.equal('1<sup>ste</sup> ronde');

            // child needs ranking
            structureService2.addQualifier(rootRound2, QualifyGroup.WINNERS);
            structureService2.addQualifier(rootRound2, QualifyGroup.WINNERS);

            expect(nameService.getRoundName(rootRound2.getChild(QualifyGroup.WINNERS, 1))).to.equal('2<sup>de</sup> ronde');
        }

    });

    it('round name, htmlFractialNumber', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);



        // root needs ranking, depth 2 
        {
            const structureService = new StructureService();
            const structure = structureService.create(competition, 16, 8);
            const rootRound = structure.getRootRound();

            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

            const winnersChildRound = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS).getChildRound();

            structureService.addQualifier(winnersChildRound, QualifyGroup.WINNERS);
            structureService.addQualifier(winnersChildRound, QualifyGroup.WINNERS);
            structureService.addQualifier(winnersChildRound, QualifyGroup.WINNERS);

            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

            const losersChildRound = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS).getChildRound();

            structureService.addQualifier(losersChildRound, QualifyGroup.LOSERS);
            structureService.addQualifier(losersChildRound, QualifyGroup.LOSERS);
            structureService.addQualifier(losersChildRound, QualifyGroup.LOSERS);

            expect(nameService.getRoundName(rootRound)).to.equal('&frac14; finale');

            const doubleWinnersChildRound = winnersChildRound.getBorderQualifyGroup(QualifyGroup.WINNERS).getChildRound();
            structureService.addQualifier(doubleWinnersChildRound, QualifyGroup.WINNERS);

            const doubleLosersChildRound = losersChildRound.getBorderQualifyGroup(QualifyGroup.LOSERS).getChildRound();
            structureService.addQualifier(doubleLosersChildRound, QualifyGroup.LOSERS);

            const number = 8;
            expect(nameService.getRoundName(rootRound)).to.equal('<span style="font-size: 80%"><sup>1</sup>&frasl;<sub>' + number + '</sub></span> finale');

            const losersFinal = doubleLosersChildRound.getBorderQualifyGroup(QualifyGroup.LOSERS).getChildRound();
            expect(nameService.getRoundName(losersFinal)).to.equal('15<sup>de</sup>' + '/' + '16<sup>de</sup>' + ' plaats');
        }
    });

    it('poule name', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);


        // {
        //     const structureService = new StructureService();
        //     const structure = structureService.create(competition, 4, 2);
        //     const rootRound = structure.getRootRound();

        //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

        //     expect(nameService.getRoundName(rootRound)).to.equal('1<sup>ste</sup> ronde');

        //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        // }

    });

    // it('default poules', () => {
    //     const structureService = new StructureService({ min: 3, max: 40 });

    //     expect(structureService.getDefaultNrOfPoules(2)).to.equal(undefined);
    //     expect(structureService.getDefaultNrOfPoules(3)).to.equal(1);
    //     expect(structureService.getDefaultNrOfPoules(40)).to.equal(8);
    //     expect(structureService.getDefaultNrOfPoules(41)).to.equal(undefined);

    //     const structureService2 = new StructureService();
    //     expect(structureService2.getDefaultNrOfPoules(2)).to.equal(1);
    //     expect(structureService2.getDefaultNrOfPoules(1)).to.equal(undefined);
    //     expect(structureService2.getDefaultNrOfPoules(41)).to.equal(undefined);
    // });

    // it('minimal number of places per poule', () => {
    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 6, 3);
    //     const rootRound = structure.getRootRound();

    //     expect(() => structureService.removePlaceFromRootRound(rootRound)).to.throw(Error);
    // });

    // it('minimal number of poules', () => {
    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 4, 2);
    //     const rootRound = structure.getRootRound();

    //     expect(() => structureService.removePoule(rootRound, false)).to.not.throw(Error);

    //     expect(() => structureService.removePoule(rootRound, false)).to.throw(Error);
    // });

    // it('minimal number of places', () => {
    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 4, 2);
    //     const rootRound = structure.getRootRound();

    //     expect(() => structureService.removePoule(rootRound, false)).to.not.throw(Error);

    //     expect(() => structureService.removePoule(rootRound, false)).to.throw(Error);
    // });

    // it('maximal number of places', () => {
    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService({ min: 3, max: 40 });
    //     const structure = structureService.create(competition, 36, 6);
    //     const rootRound = structure.getRootRound();

    //     expect(() => structureService.addPoule(rootRound, true)).to.throw(Error);
    // });

    // it('minumum number of qualifiers', () => {
    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 4, 2);
    //     const rootRound = structure.getRootRound();

    //     structureService.addPlaceToRootRound(rootRound);
    //     structureService.addPlaceToRootRound(rootRound);

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

    //     expect(() => structureService.removePlaceFromRootRound(rootRound)).to.not.throw(Error);
    //     expect(() => structureService.removePlaceFromRootRound(rootRound)).to.throw(Error);

    //     structureService.addPlaceToRootRound(rootRound);

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.removeQualifier(rootRound, QualifyGroup.LOSERS);

    //     expect(() => structureService.removePoule(rootRound, true)).to.throw(Error);
    // });

    // it('maximal number of qualifiers', () => {
    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 4, 2);
    //     const rootRound = structure.getRootRound();

    //     expect(() => structureService.addQualifier(rootRound, QualifyGroup.WINNERS)).to.not.throw(Error);
    //     expect(() => structureService.addQualifier(rootRound, QualifyGroup.WINNERS)).to.not.throw(Error);
    //     expect(() => structureService.addQualifier(rootRound, QualifyGroup.WINNERS)).to.not.throw(Error);

    //     structureService.removeQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

    //     expect(() => structureService.addQualifier(rootRound, QualifyGroup.WINNERS)).to.throw(Error);
    // });

    // it('qualifiers available', () => {
    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 8, 2);
    //     const rootRound = structure.getRootRound();

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

    //     expect(() => structureService.removePoule(rootRound, true)).to.not.throw(Error);
    //     expect(() => structureService.removePoule(rootRound, true)).to.throw(Error);
    // });

    // it('competitor range', () => {
    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService({ min: 3, max: 40 });
    //     const structure = structureService.create(competition, 3, 1);
    //     const rootRound = structure.getRootRound();

    //     expect(() => structureService.removePlaceFromRootRound(rootRound)).to.throw(Error);

    //     const structure2 = structureService.create(competition, 40, 4);
    //     const rootRound2 = structure2.getRootRound();

    //     expect(() => structureService.addPlaceToRootRound(rootRound2)).to.throw(Error);
    // });

    // it('remove poule next round', () => {
    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 6);
    //     const rootRound = structure.getRootRound();
    //     structureService.addPoule(rootRound, true);

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

    //     const childRound = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS).getChildRound();

    //     expect(() => structureService.removePoule(childRound)).to.not.throw(Error);
    //     expect(() => structureService.addPoule(childRound)).to.not.throw(Error);
    //     expect(() => structureService.removePoule(childRound)).to.not.throw(Error);

    //     expect(childRound.getPoules().length).to.equal(1);
    //     expect(childRound.getNrOfPlaces()).to.equal(4);
    // });

    // it('qualifygroup unsplittable winners 332', () => {

    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 8, 3);
    //     const rootRound = structure.getRootRound();

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

    //     {
    //         const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
    //         const horPoules = borderQualifyGroup.getHorizontalPoules();

    //         expect(horPoules.length).to.equal(2);

    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(false);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[2], horPoules[1])).to.throw(Error);
    //     }

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

    //     {
    //         const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
    //         const horPoules = borderQualifyGroup.getHorizontalPoules();

    //         expect(horPoules.length).to.equal(2);

    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(true);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[0], horPoules[1])).to.not.throw(Error);
    //     }
    // });

    // it('qualifygroup (un)splittable losers 332', () => {

    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 8, 3);
    //     const rootRound = structure.getRootRound();

    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

    //     {
    //         const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
    //         const horPoules = borderQualifyGroup.getHorizontalPoules();

    //         expect(horPoules.length).to.equal(2);

    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(false);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[2], horPoules[1])).to.throw(Error);
    //     }

    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

    //     {
    //         const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
    //         const horPoules = borderQualifyGroup.getHorizontalPoules();

    //         expect(horPoules.length).to.equal(2);

    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(true);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[0], horPoules[1])).to.not.throw(Error);
    //     }
    // });

    // it('qualifygroup (un)splittable winners 331', () => {

    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 7, 3);
    //     const rootRound = structure.getRootRound();

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

    //     {
    //         const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
    //         const horPoules = borderQualifyGroup.getHorizontalPoules();

    //         expect(horPoules.length).to.equal(2);

    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(false);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[2], horPoules[1])).to.throw(Error);
    //     }

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

    //     {
    //         const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
    //         const horPoules = borderQualifyGroup.getHorizontalPoules();

    //         expect(horPoules.length).to.equal(2);

    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(true);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[0], horPoules[1])).to.not.throw(Error);
    //     }
    // });

    // it('qualifygroup (un)splittable losers 331', () => {

    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 7, 3);
    //     const rootRound = structure.getRootRound();

    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

    //     {
    //         const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
    //         const horPoules = borderQualifyGroup.getHorizontalPoules();

    //         expect(horPoules.length).to.equal(2);

    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(false);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[0], horPoules[1])).to.throw(Error);
    //     }

    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

    //     {
    //         const borderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
    //         const horPoules = borderQualifyGroup.getHorizontalPoules();

    //         expect(horPoules.length).to.equal(2);

    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[0])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(undefined, horPoules[1])).to.equal(false);
    //         expect(structureService.isQualifyGroupSplittable(horPoules[0], horPoules[1])).to.equal(true);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[0])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, undefined, horPoules[1])).to.throw(Error);
    //         expect(() => structureService.splitQualifyGroup(borderQualifyGroup, horPoules[1], horPoules[0])).to.not.throw(Error);
    //     }
    // });

    // it('qualifygroups unmergable winners 33', () => {

    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 6, 3);
    //     const rootRound = structure.getRootRound();

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

    //     {
    //         const winnersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
    //         const losersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
    //         // const horPoules = borderQualifyGroup.getHorizontalPoules();

    //         expect(structureService.areQualifyGroupsMergable(undefined, winnersBorderQualifyGroup)).to.equal(false);
    //         expect(structureService.areQualifyGroupsMergable(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.equal(false);
    //         expect(structureService.areQualifyGroupsMergable(winnersBorderQualifyGroup, undefined)).to.equal(false);

    //         expect(() => structureService.mergeQualifyGroups(undefined, winnersBorderQualifyGroup)).to.throw(Error);
    //         expect(() => structureService.mergeQualifyGroups(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.throw(Error);
    //         expect(() => structureService.mergeQualifyGroups(winnersBorderQualifyGroup, undefined)).to.throw(Error);
    //     }
    // });

    // it('qualifygroups unmergable winners 544', () => {

    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 13, 3);
    //     const rootRound = structure.getRootRound();

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

    //     {
    //         const winnersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
    //         const losersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
    //         // const horPoules = borderQualifyGroup.getHorizontalPoules();

    //         expect(structureService.areQualifyGroupsMergable(winnersBorderQualifyGroup, winnersBorderQualifyGroup)).to.equal(false);
    //         expect(structureService.areQualifyGroupsMergable(undefined, winnersBorderQualifyGroup)).to.equal(false);
    //         expect(structureService.areQualifyGroupsMergable(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.equal(false);
    //         expect(structureService.areQualifyGroupsMergable(winnersBorderQualifyGroup, undefined)).to.equal(false);

    //         expect(() => structureService.mergeQualifyGroups(undefined, winnersBorderQualifyGroup)).to.throw(Error);
    //         expect(() => structureService.mergeQualifyGroups(losersBorderQualifyGroup, winnersBorderQualifyGroup)).to.throw(Error);
    //         expect(() => structureService.mergeQualifyGroups(winnersBorderQualifyGroup, undefined)).to.throw(Error);
    //     }
    // });

    // it('qualifygroups mergable winners 544', () => {

    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 13, 3);
    //     const rootRound = structure.getRootRound();

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
    //     structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

    //     const winnersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS);
    //     const winnersHorPoules = winnersBorderQualifyGroup.getHorizontalPoules();

    //     expect(() => structureService.splitQualifyGroup(winnersBorderQualifyGroup, winnersHorPoules[0], winnersHorPoules[1])).to.not.throw(Error);
    //     const winnersBorderQualifyGroups = rootRound.getQualifyGroups(QualifyGroup.WINNERS);
    //     expect(() => structureService.mergeQualifyGroups(winnersBorderQualifyGroups[1], winnersBorderQualifyGroups[0])).to.not.throw(Error);

    //     const losersBorderQualifyGroup = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS);
    //     const losersHorPoules = losersBorderQualifyGroup.getHorizontalPoules();

    //     expect(() => structureService.splitQualifyGroup(winnersBorderQualifyGroup, losersHorPoules[0], losersHorPoules[1])).to.not.throw(Error);
    //     const losersBorderQualifyGroups = rootRound.getQualifyGroups(QualifyGroup.LOSERS);
    //     expect(() => structureService.mergeQualifyGroups(losersBorderQualifyGroups[0], losersBorderQualifyGroups[1])).to.not.throw(Error);
    // });
});
