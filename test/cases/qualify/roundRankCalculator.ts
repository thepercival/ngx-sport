import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper, getStructureEditor } from '../../helpers/singletonCreator';
import { jsonBaseCompetition } from '../../data/competition';

import { createPlanningConfigNoTime } from '../../helpers/planningConfigCreator';
import { QualifyTarget, Round } from '../../../public-api';
import { StructureOutput } from '../../helpers/structureOutput';
import { RoundRankCalculator } from '../../../src/qualify/roundRankCalculator';


describe('Previous', () => {

    it('simple [7,7] => W[5],L[5] => W[2],L[2],W[2],L[2] ', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [7, 7], createPlanningConfigNoTime());
        const rootRound: Round = structure.getSingleCategory().getRootRound();

        const winnersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [5]);
        const losersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [5]);

        const round1and2 = structureEditor.addChildRound(winnersChildRound, QualifyTarget.Winners, [2]);
        const round4and5 = structureEditor.addChildRound(winnersChildRound, QualifyTarget.Losers, [2]);
        const round10and11 = structureEditor.addChildRound(losersChildRound, QualifyTarget.Winners, [2]);
        const round13and14 = structureEditor.addChildRound(losersChildRound, QualifyTarget.Losers, [2]);

        const rankCalculator = new RoundRankCalculator(rootRound.getCategory());
        expect(rankCalculator.getRank(round1and2)).to.equal(0);
        expect(rankCalculator.getRank(round4and5)).to.equal(3);
        expect(rankCalculator.getRank(round10and11)).to.equal(9);
        expect(rankCalculator.getRank(round13and14)).to.equal(12);

        expect(rankCalculator.getRank(winnersChildRound)).to.equal(2);
        expect(rankCalculator.getRank(losersChildRound)).to.equal(11);

        expect(rankCalculator.getRank(rootRound)).to.equal(5);

        // (new StructureOutput()).toConsole(structure, console);
    });

    /*it('setStructureNumbers', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, createPlanningConfigNoTime(), [4, 4, 4, 4]);
        const rootRound = structure.getSingleCategory().getRootRound();
        const firstRoundNumber = structure.getFirstRoundNumber();

        expect(rootRound.getNumber()).to.equal(firstRoundNumber);

        structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
        structureEditor.addQualifier(rootRound, QualifyTarget.Losers);

        structure.setStructureNumbers();
        const childOfRootRound = rootRound.getChild(QualifyTarget.Winners, 1);
        expect(childOfRootRound).to.not.equal(undefined);
        if (childOfRootRound) {
            expect(childOfRootRound.getStructureNumber()).to.equal(0);
        }

        expect(rootRound.getStructureNumber()).to.equal(2);
        const loserChildOfRootRound = rootRound.getChild(QualifyTarget.Losers, 1);
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

        const winnersRound = rootRound.getChild(QualifyTarget.Winners, 1);
        expect(winnersRound).to.not.equal(undefined);
        if (winnersRound) {
            const winnersPoule = winnersRound.getPoule(1);
            expect(winnersPoule).to.not.equal(undefined);
            if (winnersPoule) {
                expect(winnersPoule.getStructureNumber()).to.equal(5);
            }

        }

        const losersRound = rootRound.getChild(QualifyTarget.Losers, 1);
        expect(losersRound).to.not.equal(undefined);
        if (losersRound) {
            const losersPoule = losersRound.getPoule(1);
            expect(losersPoule).to.not.equal(undefined);
            if (losersPoule) {
                expect(losersPoule.getStructureNumber()).to.equal(6);
            }
        }
    });*/
});
