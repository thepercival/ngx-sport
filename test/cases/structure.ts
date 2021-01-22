import { expect } from 'chai';
import { describe, it } from 'mocha';

import { QualifyGroup, StructureService } from '../../public_api';
import { getCompetitionMapper } from '../helpers/mappers';
import { jsonBaseCompetition } from '../data/competition';
import { createPlanningConfigNoTime } from '../helpers/planningConfigCreator';

describe('Structure', () => {

    it('basics', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, createPlanningConfigNoTime(), 16, 4);
        const rootRound = structure.getRootRound();
        const firstRoundNumber = structure.getFirstRoundNumber();

        expect(rootRound.getNumber()).to.equal(firstRoundNumber);
        expect(structure.getLastRoundNumber()).to.equal(firstRoundNumber);

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

        expect(rootRound.getNumber().getNext()).to.equal(structure.getLastRoundNumber());

        expect(structure.getRoundNumbers().length).to.equal(2);

        expect(structure.getRoundNumber(1)).to.equal(firstRoundNumber);
        expect(structure.getRoundNumber(2)).to.equal(firstRoundNumber.getNext());
        expect(structure.getRoundNumber(3)).to.equal(undefined);
        expect(structure.getRoundNumber(0)).to.equal(undefined);


    });

    it('setStructureNumbers', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, createPlanningConfigNoTime(), 16, 4);
        const rootRound = structure.getRootRound();
        const firstRoundNumber = structure.getFirstRoundNumber();

        expect(rootRound.getNumber()).to.equal(firstRoundNumber);

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        structure.setStructureNumbers();
        const childOfRootRound = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(childOfRootRound).to.not.equal(undefined);
        if (childOfRootRound) {
            expect(childOfRootRound.getStructureNumber()).to.equal(0);
        }

        expect(rootRound.getStructureNumber()).to.equal(2);
        const loserChildOfRootRound = rootRound.getChild(QualifyGroup.LOSERS, 1);
        expect(loserChildOfRootRound).to.not.equal(undefined);
        if (loserChildOfRootRound) {
            expect(loserChildOfRootRound.getStructureNumber()).to.equal(14);
        }

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (pouleOne) {
            expect(pouleOne.getStructureNumber()).to.equal(1);
        }
        const pouleFour = rootRound.getPoule(4);
        expect(pouleFour).to.not.equal(undefined);
        if (pouleFour) {
            expect(pouleFour.getStructureNumber()).to.equal(4);
        }

        const winnersRound = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRound).to.not.equal(undefined);
        if (winnersRound) {
            const winnersPoule = winnersRound.getPoule(1);
            expect(winnersPoule).to.not.equal(undefined);
            if (winnersPoule) {
                expect(winnersPoule.getStructureNumber()).to.equal(5);
            }

        }

        const losersRound = rootRound.getChild(QualifyGroup.LOSERS, 1);
        expect(losersRound).to.not.equal(undefined);
        if (losersRound) {
            const losersPoule = losersRound.getPoule(1);
            expect(losersPoule).to.not.equal(undefined);
            if (losersPoule) {
                expect(losersPoule.getStructureNumber()).to.equal(6);
            }
        }
    });

    it('planning', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, createPlanningConfigNoTime(), 16, 4);
        expect(structure.hasPlanning()).to.equal(false);
        const rootRound = structure.getRootRound();
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        expect(structure.hasPlanning()).to.equal(false);
        structure.getFirstRoundNumber().setHasPlanning(true);
        expect(structure.hasPlanning()).to.equal(false);
    });
});
