import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PouleStructure, QualifyTarget } from '../../public_api';
import { getCompetitionMapper, getStructureEditor } from '../helpers/singletonCreator';
import { jsonBaseCompetition } from '../data/competition';
import { createPlanningConfigNoTime } from '../helpers/planningConfigCreator';
import { StructureOutput } from '../helpers/structureOutput';

describe('Structure', () => {

    it('basics', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, createPlanningConfigNoTime(), new PouleStructure(4, 4, 4, 4));
        const rootRound = structure.getRootRound();
        const firstRoundNumber = structure.getFirstRoundNumber();

        expect(rootRound.getNumber()).to.equal(firstRoundNumber);
        expect(structure.getLastRoundNumber()).to.equal(firstRoundNumber);

        structureEditor.addQualifier(rootRound, QualifyTarget.Winners);

        expect(rootRound.getNumber().getNext()).to.equal(structure.getLastRoundNumber());

        expect(structure.getRoundNumbers().length).to.equal(2);

        expect(structure.getRoundNumber(1)).to.equal(firstRoundNumber);
        expect(structure.getRoundNumber(2)).to.equal(firstRoundNumber.getNext());
        expect(structure.getRoundNumber(3)).to.equal(undefined);
        expect(structure.getRoundNumber(0)).to.equal(undefined);

        // (new StructureOutput()).output(structure, console);
    });

    it('planning', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, createPlanningConfigNoTime(), new PouleStructure(4, 4, 4, 4));
        expect(structure.hasPlanning()).to.equal(false);
        const rootRound = structure.getRootRound();
        structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
        structureEditor.addQualifier(rootRound, QualifyTarget.Losers);
        expect(structure.hasPlanning()).to.equal(false);
        structure.getFirstRoundNumber().setHasPlanning(true);
        expect(structure.hasPlanning()).to.equal(false);
    });
});
