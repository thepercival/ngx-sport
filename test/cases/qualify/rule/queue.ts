import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PouleStructure, QualifyGroup, QualifyReservationService, QualifyService, Round } from '../../../../public_api';
import { jsonBaseCompetition } from '../../../data/competition';
import { createGames } from '../../../helpers/gamescreator';
import { createPlanningConfigNoTime } from '../../../helpers/planningConfigCreator';
import { setAgainstScoreSingle } from '../../../helpers/setscores';
import { getCompetitionMapper, getStructureEditor } from '../../../helpers/singletonCreator';


describe('QualifyRuleQueue', () => {

    it('free and reserve', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, createPlanningConfigNoTime(), new PouleStructure(5));
        const rootRound: Round = structure.getRootRound();

        structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
        structureEditor.addQualifier(rootRound, QualifyTarget.Losers);

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }

        createGames(structure.getFirstRoundNumber());

        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1);
        setAgainstScoreSingle(pouleOne, 1, 4, 4, 1);
        setAgainstScoreSingle(pouleOne, 1, 5, 5, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 3, 2);
        setAgainstScoreSingle(pouleOne, 2, 4, 4, 2);
        setAgainstScoreSingle(pouleOne, 2, 5, 5, 2);
        setAgainstScoreSingle(pouleOne, 3, 4, 4, 3);
        setAgainstScoreSingle(pouleOne, 3, 5, 5, 3);
        setAgainstScoreSingle(pouleOne, 4, 5, 5, 4);

        const qualifyService = new QualifyService(rootRound);
        qualifyService.setQualifiers();

        const winnersRound = rootRound.getChild(QualifyTarget.Winners, 1);
        expect(winnersRound).to.not.equal(undefined);
        if (!winnersRound) {
            return;
        }
        const resService = new QualifyReservationService(winnersRound);

        expect(resService.isFree(1, pouleOne)).to.equal(true);
        resService.reserve(1, pouleOne);
        expect(resService.isFree(1, pouleOne)).to.equal(false);
    });
});
