import { expect } from 'chai';
import { describe, it } from 'mocha';

import { QualifyGroup, StructureService } from '../../public_api';
import { getCompetitionMapper } from '../helpers/mappers';
import { jsonBaseCompetition } from '../data/competition';
import { getDefaultStructureOptions } from '../helpers/getdefaultstructureoptions';

describe('Structure', () => {

    it('basics', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService(getDefaultStructureOptions());
        const structure = structureService.create(competition, 16, 4);
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

        const structureService = new StructureService(getDefaultStructureOptions());
        const structure = structureService.create(competition, 16, 4);
        const rootRound = structure.getRootRound();
        const firstRoundNumber = structure.getFirstRoundNumber();

        expect(rootRound.getNumber()).to.equal(firstRoundNumber);

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        structure.setStructureNumbers();

        expect(rootRound.getChild(QualifyGroup.WINNERS, 1).getStructureNumber()).to.equal(0);
        expect(rootRound.getStructureNumber()).to.equal(2);
        expect(rootRound.getChild(QualifyGroup.LOSERS, 1).getStructureNumber()).to.equal(14);

        expect(rootRound.getPoule(1).getStructureNumber()).to.equal(1);
        expect(rootRound.getPoule(4).getStructureNumber()).to.equal(4);
        expect(rootRound.getChild(QualifyGroup.WINNERS, 1).getPoule(1).getStructureNumber()).to.equal(5);
        expect(rootRound.getChild(QualifyGroup.LOSERS, 1).getPoule(1).getStructureNumber()).to.equal(6);
    });

    it('planning', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService(getDefaultStructureOptions());
        const structure = structureService.create(competition, 16, 4);
        expect(structure.hasPlanning()).to.equal(false);
        const rootRound = structure.getRootRound();
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        expect(structure.hasPlanning()).to.equal(false);
        structure.getFirstRoundNumber().setHasPlanning(true);
        expect(structure.hasPlanning()).to.equal(false);
    });
});
