import { assert, expect } from 'chai';
import { describe, it } from 'mocha';
import { QualifyTarget, Round, RoundRankingCalculator } from '../../public-api';
import { jsonBaseCompetition } from '../data/competition';
import { createGames } from '../helpers/gamescreator';
import { createPlanningConfigNoTime } from '../helpers/planningConfigCreator';
import { setAgainstScoreSingle } from '../helpers/setscores';
import { getCompetitionMapper, getStructureEditor } from '../helpers/singletonCreator';

describe('CDK', () => {

    it('horizontal ranked no single rule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, [3, 3]);
        const rootRound: Round = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 3);

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        const pouleTwo = rootRound.getPoule(2);
        expect(pouleTwo).to.not.equal(undefined);
        if (!pouleTwo) {
            return;
        }

        createGames(structure.getFirstRoundNumber());

        setAgainstScoreSingle(pouleOne, 1, 2, 1, 0);
        setAgainstScoreSingle(pouleOne, 1, 3, 1, 0);
        setAgainstScoreSingle(pouleOne, 2, 3, 0, 1);

        setAgainstScoreSingle(pouleTwo, 1, 2, 1, 0);
        setAgainstScoreSingle(pouleTwo, 1, 3, 1, 0);
        setAgainstScoreSingle(pouleTwo, 2, 3, 0, 2);

        const rankingService = new RoundRankingCalculator();
        const nrsTwo = rootRound.getHorizontalPoule(QualifyTarget.Winners, 2);
        const rankingItems = rankingService.getItemsForHorizontalPoule(nrsTwo);

        const thirdPlace = rankingService.getItemByRank(rankingItems, 1);
        // console.log(thirdPlace);
        expect(thirdPlace).to.not.equal(undefined);
        if (!thirdPlace) {
            return;
        }
        expect(thirdPlace.getPlace()).to.equal(pouleTwo.getPlace(3));
    });
});