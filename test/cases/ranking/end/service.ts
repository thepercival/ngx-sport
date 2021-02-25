import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper, getStructureService } from '../../../helpers/singletonCreator';
import { jsonBaseCompetition } from '../../../data/competition';
import { createGames } from '../../../helpers/gamescreator';
import { EndRankingService, PlaceLocationMap, PouleStructure, QualifyGroup, QualifyService } from '../../../../public_api';
import { createTeamCompetitors } from '../../../helpers/teamcompetitorscreator';
import { setAgainstScoreSingle } from '../../../helpers/setscores';
import { createPlanningConfigNoTime } from '../../../helpers/planningConfigCreator';

describe('EndRankingService', () => {

    it('one poule of three places', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureService = getStructureService();
        const structure = structureService.create(competition, createPlanningConfigNoTime(), new PouleStructure(3));
        const firstRoundNumber = structure.getFirstRoundNumber();
        const placeLocationMap = new PlaceLocationMap(createTeamCompetitors(competition, firstRoundNumber));
        const rootRound = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 3, 2);

        const rankingService = new EndRankingService(structure);
        const items = rankingService.getItems();

        for (let rank = 1; rank <= items.length; rank++) {
            const endRankingItem = items[rank - 1];
            const placeLocation = endRankingItem.getStartPlaceLocation();
            expect(placeLocation).to.not.equal(undefined);
            if (!placeLocation) {
                continue;
            }
            const competitor = placeLocationMap.getCompetitor(placeLocation);
            expect(competitor.getName()).to.equal('tc 1.' + rank);
            expect(endRankingItem.getUniqueRank()).to.equal(rank);
        }
    });

    it('one poule of three places, with no competitor', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureService = getStructureService();
        const structure = structureService.create(competition, createPlanningConfigNoTime(), new PouleStructure(3));
        const firstRoundNumber = structure.getFirstRoundNumber();
        const teamCompetitors = createTeamCompetitors(competition, firstRoundNumber);
        teamCompetitors.pop();
        const placeLocationMap = new PlaceLocationMap(teamCompetitors);
        const rootRound = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }

        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 3, 2);

        const rankingService = new EndRankingService(structure);
        const items = rankingService.getItems();

        const endRankingItem = items[2];
        const placeLocation = endRankingItem.getStartPlaceLocation();
        expect(placeLocation).to.not.equal(undefined);
        if (!placeLocation) {
            return;
        }
        const competitor = placeLocationMap.getCompetitor(placeLocation);

        expect(competitor).to.equal(undefined);
    });

    it('one poule of three places, not played', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureService = getStructureService();
        const structure = structureService.create(competition, createPlanningConfigNoTime(), new PouleStructure(3));
        const firstRoundNumber = structure.getFirstRoundNumber();
        const placeLocationMap = new PlaceLocationMap(createTeamCompetitors(competition, firstRoundNumber));
        const rootRound = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }

        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1);
        // setAgainstScoreSingle(pouleOne, 2, 3, 3, 2);

        const rankingService = new EndRankingService(structure);
        const items = rankingService.getItems();

        for (let rank = 1; rank <= items.length; rank++) {
            const endRankingItem = items[rank - 1];
            expect(endRankingItem.getStartPlaceLocation()).to.equal(undefined);
        }
    });

    it('2 roundnumbers, five places', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureService = getStructureService();
        const structure = structureService.create(competition, createPlanningConfigNoTime(), new PouleStructure(5));
        const firstRoundNumber = structure.getFirstRoundNumber();
        const placeLocationMap = new PlaceLocationMap(createTeamCompetitors(competition, firstRoundNumber));
        const rootRound = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

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

        const winnersRound = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRound).to.not.equal(undefined);
        if (!winnersRound) {
            return;
        }
        const winnersPoule = winnersRound.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }
        const losersRound = rootRound.getChild(QualifyGroup.LOSERS, 1);
        expect(losersRound).to.not.equal(undefined);
        if (!losersRound) {
            return;
        }
        const losersPoule = losersRound.getPoule(1);
        expect(losersPoule).to.not.equal(undefined);
        if (!losersPoule) {
            return;
        }
        const secondRound = structure.getFirstRoundNumber().getNext();
        expect(secondRound).to.not.equal(undefined);
        if (!secondRound) {
            return;
        }
        createGames(secondRound);
        setAgainstScoreSingle(winnersPoule, 1, 2, 2, 1);
        setAgainstScoreSingle(losersPoule, 1, 2, 2, 1);

        const qualifyService = new QualifyService(rootRound);
        qualifyService.setQualifiers();

        const rankingService = new EndRankingService(structure);
        const items = rankingService.getItems();

        for (let rank = 1; rank <= items.length; rank++) {
            const endRankingItem = items[rank - 1];
            const placeLocation = endRankingItem.getStartPlaceLocation();
            expect(placeLocation).to.not.equal(undefined);
            if (!placeLocation) {
                continue;
            }
            const competitor = placeLocationMap.getCompetitor(placeLocation);
            expect(competitor.getName()).to.equal('tc 1.' + rank);
        }
    });
});
