import { assert, expect } from 'chai';
import { describe, it } from 'mocha';
import { PouleStructure, QualifyTarget } from '../../../public_api';
import { QualifyOriginCalculator } from '../../../src/qualify/originCalculator';
import { jsonBaseCompetition } from '../../data/competition';
import { createPlanningConfigNoTime } from '../../helpers/planningConfigCreator';
import { getCompetitionMapper, getStructureEditor } from '../../helpers/singletonCreator';
import { StructureOutput } from '../../helpers/structureOutput';

describe('QualifyOriginCalculator', () => {

    it('nohistory', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, createPlanningConfigNoTime(), new PouleStructure(2, 2, 2, 2, 2, 2, 2, 2));
        const rootRound = structure.getRootRound();

        structureEditor.addQualifier(rootRound, QualifyTarget.Winners);

        const originCalculator = new QualifyOriginCalculator();

        const origins = originCalculator.getPossibleOrigins(rootRound.getPoule(1));
        expect(origins.length).to.equal(0);
    });

    it('multiple rule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, createPlanningConfigNoTime(), new PouleStructure(2, 2, 2, 2, 2, 2, 2, 2));
        const rootRound = structure.getRootRound();

        structureEditor.addQualifier(rootRound, QualifyTarget.Winners);

        const firstWinnersQualifyGroup = rootRound.getQualifyGroup(QualifyTarget.Winners, 1);
        assert(firstWinnersQualifyGroup !== undefined);
        if (firstWinnersQualifyGroup === undefined) {
            return;
        }
        const poule = firstWinnersQualifyGroup.getChildRound().getPoule(1);

        const originCalculator = new QualifyOriginCalculator();

        const origins = originCalculator.getPossibleOrigins(poule);

        expect(origins.length).to.equal(8);

        // (new StructureOutput()).output(structure, console);
    });

    it('single rule, winners->depth 1', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, createPlanningConfigNoTime(), new PouleStructure(4, 4, 4, 4));
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 8);

        const firstWinnersQualifyGroup = rootRound.getQualifyGroup(QualifyTarget.Winners, 1);
        assert(firstWinnersQualifyGroup !== undefined);
        if (firstWinnersQualifyGroup === undefined) {
            return;
        }

        const originCalculator = new QualifyOriginCalculator();

        const firstPouleWinnersRound = firstWinnersQualifyGroup.getChildRound().getPoule(1);
        const firstWinnerOrigins = originCalculator.getPossibleOrigins(firstPouleWinnersRound);
        expect(firstWinnerOrigins.length).to.equal(2);

        const lastPouleWinnersRound = firstWinnersQualifyGroup.getChildRound().getPoule(4);
        const lastWinnerOrigins = originCalculator.getPossibleOrigins(lastPouleWinnersRound);
        expect(lastWinnerOrigins.length).to.equal(2);

        // (new StructureOutput()).output(structure, console);
    });

    it('single rule, winners->depth 1', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, createPlanningConfigNoTime(), new PouleStructure(4, 4, 4, 4));
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 8);

        const firstWinnersQualifyGroup = rootRound.getQualifyGroup(QualifyTarget.Winners, 1);
        assert(firstWinnersQualifyGroup !== undefined);
        if (firstWinnersQualifyGroup === undefined) {
            return;
        }

        const secondRound = firstWinnersQualifyGroup.getChildRound();
        structureEditor.addQualifiers(secondRound, QualifyTarget.Winners, 4);

        const secondWinnersQualifyGroup = secondRound.getQualifyGroup(QualifyTarget.Winners, 1);
        assert(secondWinnersQualifyGroup !== undefined);
        if (secondWinnersQualifyGroup === undefined) {
            return;
        }

        const originCalculator = new QualifyOriginCalculator();

        const firstPouleSecondWinnersRound = secondWinnersQualifyGroup.getChildRound().getPoule(1);
        const origins = originCalculator.getPossibleOrigins(firstPouleSecondWinnersRound);
        expect(origins.length).to.equal(6); // 4 from round 1 and 2 from round 2

        // (new StructureOutput()).output(structure, console);
    });

});
