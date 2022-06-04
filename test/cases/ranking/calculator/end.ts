import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper, getStructureEditor } from '../../../helpers/singletonCreator';
import { jsonBaseCompetition } from '../../../data/competition';
import { createGames } from '../../../helpers/gamescreator';
import { EndRankingCalculator, QualifyService, QualifyTarget, StartLocationMap } from '../../../../public-api';
import { createTeamCompetitors } from '../../../helpers/teamcompetitorscreator';
import { setAgainstScoreSingle } from '../../../helpers/setscores';
import { createPlanningConfigNoTime } from '../../../helpers/planningConfigCreator';

describe('EndRankingCalculator', () => {

    it('one poule of three places', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const competitorMap = new StartLocationMap(createTeamCompetitors(competition, structure.getRootRounds()));
        const defaultCat = structure.getSingleCategory();
        const rootRound = defaultCat.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 3, 2);

        const rankingService = new EndRankingCalculator(defaultCat);
        const items = rankingService.getItems();

        for (let rank = 1; rank <= items.length; rank++) {
            const endRankingItem = items[rank - 1];
            const placeLocation = endRankingItem.getStartLocation();
            expect(placeLocation).to.not.equal(undefined);
            if (!placeLocation) {
                continue;
            }
            const competitor = competitorMap.getCompetitor(placeLocation);
            expect(competitor).to.not.equal(undefined);
            expect(competitor?.getName()).to.equal('tc 1.' + rank);
            expect(endRankingItem.getUniqueRank()).to.equal(rank);
        }
    });

    it('one poule of three places, with no competitor', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const teamCompetitors = createTeamCompetitors(competition, structure.getRootRounds());
        teamCompetitors.pop();
        const competitorMap = new StartLocationMap(teamCompetitors);
        const defaultCat = structure.getSingleCategory();
        const rootRound = defaultCat.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }

        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 3, 2);

        const rankingService = new EndRankingCalculator(defaultCat);
        const items = rankingService.getItems();

        const endRankingItem = items[2];
        const placeLocation = endRankingItem.getStartLocation();
        expect(placeLocation).to.not.equal(undefined);
        if (!placeLocation) {
            return;
        }
        const competitor = competitorMap.getCompetitor(placeLocation);

        expect(competitor).to.equal(undefined);
    });

    it('one poule of three places, not finsihed', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        // const competitorMap = new StartLocationMap(createTeamCompetitors(competition, structure.getRootRounds()));
        const defaultCat = structure.getSingleCategory();
        const rootRound = defaultCat.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }

        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1);
        // setAgainstScoreSingle(pouleOne, 2, 3, 3, 2);

        const rankingService = new EndRankingCalculator(defaultCat);
        const items = rankingService.getItems();

        for (let rank = 1; rank <= items.length; rank++) {
            const endRankingItem = items[rank - 1];
            expect(endRankingItem.getStartLocation()).to.equal(undefined);
        }
    });

    it('2 roundnumbers, [5] => (W[2],L[2])', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [5], createPlanningConfigNoTime());
        const competitorMap = new StartLocationMap(createTeamCompetitors(competition, structure.getRootRounds()));
        const defaultCat = structure.getSingleCategory();
        const rootRound = defaultCat.getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const losersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1); // 1 12p
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1); // 2 9p
        setAgainstScoreSingle(pouleOne, 1, 4, 4, 1); // 3 6p
        setAgainstScoreSingle(pouleOne, 1, 5, 5, 1); // 4 3p
        setAgainstScoreSingle(pouleOne, 2, 3, 3, 2); // 5 0p
        setAgainstScoreSingle(pouleOne, 2, 4, 4, 2);
        setAgainstScoreSingle(pouleOne, 2, 5, 5, 2);
        setAgainstScoreSingle(pouleOne, 3, 4, 4, 3);
        setAgainstScoreSingle(pouleOne, 3, 5, 5, 3);
        setAgainstScoreSingle(pouleOne, 4, 5, 5, 4);

        const winnersPoule = winnersRound.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }
        const losersPoule = losersRound.getPoule(1);
        expect(losersPoule).to.not.equal(undefined);
        if (!losersPoule) {
            return;
        }
        const secondRoundNumber = structure.getFirstRoundNumber().getNext();
        expect(secondRoundNumber).to.not.equal(undefined);
        if (!secondRoundNumber) {
            return;
        }
        createGames(secondRoundNumber);
        setAgainstScoreSingle(winnersPoule, 1, 2, 2, 1);
        setAgainstScoreSingle(losersPoule, 1, 2, 2, 1);

        const qualifyService = new QualifyService(rootRound);
        qualifyService.setQualifiers();

        const rankingService = new EndRankingCalculator(defaultCat);
        const items = rankingService.getItems();

        for (let rank = 1; rank <= items.length; rank++) {
            const endRankingItem = items[rank - 1];
            const placeLocation = endRankingItem.getStartLocation();
            expect(placeLocation).to.not.equal(undefined);
            if (!placeLocation) {
                continue;
            }
            const competitor = competitorMap.getCompetitor(placeLocation);
            expect(competitor).to.not.equal(undefined);
            expect(competitor?.getName()).to.equal('tc 1.' + rank);
        }
    });
});
