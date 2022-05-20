import { assert, expect } from 'chai';
import { describe, it } from 'mocha';
import { BalancedPouleStructure, QualifyTarget } from '../../../public-api';
import { QualifyOriginCalculator } from '../../../src/qualify/originCalculator';
import { jsonBaseCompetition } from '../../data/competition';
import { createPlanningConfigNoTime } from '../../helpers/planningConfigCreator';
import { getCompetitionMapper, getStructureEditor } from '../../helpers/singletonCreator';
import { StructureOutput } from '../../helpers/structureOutput';

describe('QualifyOriginCalculator', () => {

    it('nohistory', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [2, 2, 2, 2, 2, 2, 2, 2], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);

        const originCalculator = new QualifyOriginCalculator();

        const origins = originCalculator.getPossibleOrigins(rootRound.getPoule(1));
        expect(origins.length).to.equal(0);
    });

    it('multiple rule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [2, 2, 2, 2, 2, 2, 2, 2], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);

        const firstWinnersQualifyGroup = rootRound.getQualifyGroup(QualifyTarget.Winners, 1);
        assert(firstWinnersQualifyGroup !== undefined);
        if (firstWinnersQualifyGroup === undefined) {
            return;
        }
        const poule = firstWinnersQualifyGroup.getChildRound().getPoule(1);

        const originCalculator = new QualifyOriginCalculator();

        const origins = originCalculator.getPossibleOrigins(poule);

        expect(origins.length).to.equal(8);

        // (new StructureOutput()).toConsole(structure, console);
    });

    it('single rule, winners->depth 1', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4, 4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2, 2, 2, 2]);

        const originCalculator = new QualifyOriginCalculator();

        const firstPouleWinnersRound = winnersRound.getPoule(1);
        const firstWinnerOrigins = originCalculator.getPossibleOrigins(firstPouleWinnersRound);
        expect(firstWinnerOrigins.length).to.equal(2);

        const lastPouleWinnersRound = winnersRound.getPoule(4);
        const lastWinnerOrigins = originCalculator.getPossibleOrigins(lastPouleWinnersRound);
        expect(lastWinnerOrigins.length).to.equal(2);

        // (new StructureOutput()).toConsole(structure, console);
    });

    it('single rule, winners->depth 1', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4, 4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [4, 4]);

        const winnersWinnersRound = structureEditor.addChildRound(winnersChildRound, QualifyTarget.Winners, [2, 2]);

        // (new StructureOutput()).toConsole(structure, console);

        const originCalculator = new QualifyOriginCalculator();

        const firstPouleWinnersWinnersRound = winnersWinnersRound.getPoule(1);
        const origins = originCalculator.getPossibleOrigins(firstPouleWinnersWinnersRound);
        expect(origins.length).to.equal(6); // 4 from round 1 and 2 from round 2
    });
});
