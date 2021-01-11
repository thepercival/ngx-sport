import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper } from '../../helpers/mappers';
import { jsonBaseCompetition } from '../../data/competition';

import { setScoreSingle } from '../../helpers/setscores';
import { createGames } from '../../helpers/gamescreator';
import { Poule, QualifyGroup, RankingService, Round, State, StructureService } from '../../../public_api';

describe('Ranking/Service', () => {

    it('rule descriptions', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 3);
        const rootRound: Round = structure.getRootRound();

        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const ruleDescriptions = rankingService.getRuleDescriptions();
        expect(ruleDescriptions.length).to.equal(5);

        const rankingService2 = new RankingService(RankingService.RULESSET_EC);
        const ruleDescriptions2 = rankingService2.getRuleDescriptions();
        expect(ruleDescriptions2.length).to.equal(5);

        const rankingService3 = new RankingService(0);
        expect(() => rankingService3.getRuleDescriptions()).to.throw(Error);
    });

    it('multiple equal ranked', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 3);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());

        setScoreSingle(pouleOne, 1, 2, 0, 0);
        setScoreSingle(pouleOne, 1, 3, 0, 0);
        setScoreSingle(pouleOne, 2, 3, 0, 0);

        const equalRank = 1;

        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const items = rankingService.getItemsForPoule(pouleOne);
        items.forEach(item => expect(item.getRank()).to.equal(equalRank));

        const equalItems = rankingService.getItemsByRank(items, equalRank);
        expect(equalItems.length).to.equal(pouleOne.getPlaces().length)

        // cached items
        const cachedItems = rankingService.getItemsForPoule(pouleOne);
        cachedItems.forEach(item => expect(item.getRank()).to.equal(1));
    });

    it('single ranked, state played', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 3);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());

        setScoreSingle(pouleOne, 1, 2, 2, 1);
        setScoreSingle(pouleOne, 1, 3, 3, 1);
        setScoreSingle(pouleOne, 2, 3, 3, 2);

        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const items = rankingService.getItemsForPoule(pouleOne);

        const rankingItemOne = rankingService.getItemByRank(items, 1);
        expect(rankingItemOne).to.not.equal(undefined);
        if (!rankingItemOne) {
            return;
        }
        expect(rankingItemOne.getPlace()).to.equal(pouleOne.getPlace(1));

        const rankingItemTwo = rankingService.getItemByRank(items, 2);
        expect(rankingItemTwo).to.not.equal(undefined);
        if (!rankingItemTwo) {
            return;
        }
        expect(rankingItemTwo.getPlace()).to.equal(pouleOne.getPlace(2));

        const rankingItemThree = rankingService.getItemByRank(items, 3);
        expect(rankingItemThree).to.not.equal(undefined);
        if (!rankingItemThree) {
            return;
        }
        expect(rankingItemThree.getPlace()).to.equal(pouleOne.getPlace(3));
    });

    it('single ranked, state progress && played', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 3);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setScoreSingle(pouleOne, 1, 2, 2, 1, State.InProgress);
        setScoreSingle(pouleOne, 1, 3, 3, 1, State.InProgress);
        setScoreSingle(pouleOne, 2, 3, 3, 2, State.InProgress);

        const rankingService = new RankingService(RankingService.RULESSET_WC, State.InProgress + State.Finished);
        const items = rankingService.getItemsForPoule(pouleOne);

        const rankingItemOne = rankingService.getItemByRank(items, 1);
        expect(rankingItemOne).to.not.equal(undefined);
        if (!rankingItemOne) {
            return;
        }
        expect(rankingItemOne.getPlace()).to.equal(pouleOne.getPlace(1));

        const rankingItemTwo = rankingService.getItemByRank(items, 2);
        expect(rankingItemTwo).to.not.equal(undefined);
        if (!rankingItemTwo) {
            return;
        }
        expect(rankingItemTwo.getPlace()).to.equal(pouleOne.getPlace(2));

        const rankingItemThree = rankingService.getItemByRank(items, 3);
        expect(rankingItemThree).to.not.equal(undefined);
        if (!rankingItemThree) {
            return;
        }
        expect(rankingItemThree.getPlace()).to.equal(pouleOne.getPlace(3));

        const rankingService2 = new RankingService(RankingService.RULESSET_WC);
        const items2 = rankingService2.getItemsForPoule(pouleOne);
        items2.forEach(item => expect(item.getRank()).to.equal(1));
    });

    it('horizontal ranked EC/WC', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 6);
        const rootRound: Round = structure.getRootRound();

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

        setScoreSingle(pouleOne, 1, 2, 2, 1);
        setScoreSingle(pouleOne, 1, 3, 3, 1);
        setScoreSingle(pouleOne, 2, 3, 3, 2);

        setScoreSingle(pouleTwo, 1, 2, 4, 2);
        setScoreSingle(pouleTwo, 1, 3, 6, 2);
        setScoreSingle(pouleTwo, 2, 3, 6, 4);

        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const firstHorizontalPoule = rootRound.getHorizontalPoules(QualifyGroup.WINNERS)[0];
        const placeLocations = rankingService.getPlaceLocationsForHorizontalPoule(firstHorizontalPoule);

        expect(placeLocations[0].getPouleNr()).to.equal(2);
        expect(placeLocations[1].getPouleNr()).to.equal(1);

        const rankingService2 = new RankingService(RankingService.RULESSET_EC);
        const placeLocations2 = rankingService2.getPlaceLocationsForHorizontalPoule(firstHorizontalPoule);

        expect(placeLocations2[0].getPouleNr()).to.equal(2);
        expect(placeLocations2[1].getPouleNr()).to.equal(1);
    });

    it('horizontal ranked no single rule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 6, 2);
        const rootRound: Round = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

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

        setScoreSingle(pouleOne, 1, 2, 2, 1);
        setScoreSingle(pouleOne, 1, 3, 3, 1);
        setScoreSingle(pouleOne, 2, 3, 3, 2);

        setScoreSingle(pouleTwo, 1, 2, 4, 2);
        setScoreSingle(pouleTwo, 1, 3, 6, 2);
        setScoreSingle(pouleTwo, 2, 3, 6, 4);

        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const firstHorizontalPoule = rootRound.getHorizontalPoules(QualifyGroup.WINNERS)[0];
        const placeLocations = rankingService.getPlaceLocationsForHorizontalPoule(firstHorizontalPoule);

        expect(placeLocations.length).to.equal(0);
    });

    it('single ranked, EC/WC', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 4);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());

        setScoreSingle(pouleOne, 1, 2, 1, 0);
        setScoreSingle(pouleOne, 3, 4, 1, 0);
        setScoreSingle(pouleOne, 4, 1, 1, 0);
        setScoreSingle(pouleOne, 3, 2, 0, 2);
        setScoreSingle(pouleOne, 1, 3, 1, 0);
        setScoreSingle(pouleOne, 2, 4, 1, 0);

        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const items = rankingService.getItemsForPoule(pouleOne);

        const rankingItemOne = rankingService.getItemByRank(items, 1);
        expect(rankingItemOne).to.not.equal(undefined);
        if (!rankingItemOne) {
            return;
        }
        expect(rankingItemOne.getPlace()).to.equal(pouleOne.getPlace(2));

        const rankingItemTwo = rankingService.getItemByRank(items, 2);
        expect(rankingItemTwo).to.not.equal(undefined);
        if (!rankingItemTwo) {
            return;
        }
        expect(rankingItemTwo.getPlace()).to.equal(pouleOne.getPlace(1));


        const rankingService2 = new RankingService(RankingService.RULESSET_EC);
        const items2 = rankingService2.getItemsForPoule(pouleOne);

        const rankingItemOne2 = rankingService2.getItemByRank(items2, 1);
        expect(rankingItemOne2).to.not.equal(undefined);
        if (!rankingItemOne2) {
            return;
        }
        expect(rankingItemOne2.getPlace()).to.equal(pouleOne.getPlace(1));

        const rankingItemTwo2 = rankingService2.getItemByRank(items2, 2);
        expect(rankingItemTwo2).to.not.equal(undefined);
        if (!rankingItemTwo2) {
            return;
        }
        expect(rankingItemTwo2.getPlace()).to.equal(pouleOne.getPlace(2));
    });

    it('variation 1, mostPoints', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 3);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setScoreSingle(pouleOne, 1, 2, 1, 2);
        setScoreSingle(pouleOne, 1, 3, 1, 3);
        setScoreSingle(pouleOne, 2, 3, 2, 3);

        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const items = rankingService.getItemsForPoule(pouleOne);

        const rankingItemOne = rankingService.getItemByRank(items, 1);
        expect(rankingItemOne).to.not.equal(undefined);
        if (!rankingItemOne) {
            return;
        }
        expect(rankingItemOne.getPlace()).to.equal(pouleOne.getPlace(3));

        const rankingItemTwo = rankingService.getItemByRank(items, 2);
        expect(rankingItemTwo).to.not.equal(undefined);
        if (!rankingItemTwo) {
            return;
        }
        expect(rankingItemTwo.getPlace()).to.equal(pouleOne.getPlace(2));

        const rankingItemThree = rankingService.getItemByRank(items, 3);
        expect(rankingItemThree).to.not.equal(undefined);
        if (!rankingItemThree) {
            return;
        }
        expect(rankingItemThree.getPlace()).to.equal(pouleOne.getPlace(1));
    });

    it('variation 2, fewestGames', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 4);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setScoreSingle(pouleOne, 1, 2, 5, 0);
        setScoreSingle(pouleOne, 3, 4, 0, 1);
        setScoreSingle(pouleOne, 4, 1, 1, 1);
        setScoreSingle(pouleOne, 3, 2, 0, 0);
        setScoreSingle(pouleOne, 1, 3, 0, 1);
        // setScoreSingle(pouleOne, 2, 4, 0, 1);        

        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const items = rankingService.getItemsForPoule(pouleOne);

        const rankingItemOne = rankingService.getItemByRank(items, 1);
        expect(rankingItemOne).to.not.equal(undefined);
        if (!rankingItemOne) {
            return;
        }
        expect(rankingItemOne.getPlace()).to.equal(pouleOne.getPlace(4));

        const rankingItemTwo = rankingService.getItemByRank(items, 2);
        expect(rankingItemTwo).to.not.equal(undefined);
        if (!rankingItemTwo) {
            return;
        }
        expect(rankingItemTwo.getPlace()).to.equal(pouleOne.getPlace(1));

        const rankingItemThree = rankingService.getItemByRank(items, 3);
        expect(rankingItemThree).to.not.equal(undefined);
        if (!rankingItemThree) {
            return;
        }
        expect(rankingItemThree.getPlace()).to.equal(pouleOne.getPlace(3));
    });

    it('variation 3, fewestGames', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 4);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());

        // setScoreSingle(pouleOne, 1, 2, 1, 0);
        setScoreSingle(pouleOne, 3, 4, 3, 0);
        setScoreSingle(pouleOne, 4, 1, 1, 1);
        setScoreSingle(pouleOne, 3, 2, 0, 0);
        setScoreSingle(pouleOne, 1, 3, 1, 0);
        setScoreSingle(pouleOne, 2, 4, 0, 5);

        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const items = rankingService.getItemsForPoule(pouleOne);

        const rankingItemOne = rankingService.getItemByRank(items, 1);
        expect(rankingItemOne).to.not.equal(undefined);
        if (!rankingItemOne) {
            return;
        }
        expect(rankingItemOne.getPlace()).to.equal(pouleOne.getPlace(1));

        const rankingItemTwo = rankingService.getItemByRank(items, 2);
        expect(rankingItemTwo).to.not.equal(undefined);
        if (!rankingItemTwo) {
            return;
        }
        expect(rankingItemTwo.getPlace()).to.equal(pouleOne.getPlace(4));

        const rankingItemThree = rankingService.getItemByRank(items, 3);
        expect(rankingItemThree).to.not.equal(undefined);
        if (!rankingItemThree) {
            return;
        }
        expect(rankingItemThree.getPlace()).to.equal(pouleOne.getPlace(3));
    });

    it('variation 4, mostScoreed', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 3);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setScoreSingle(pouleOne, 1, 2, 1, 1);
        setScoreSingle(pouleOne, 1, 3, 2, 1);
        setScoreSingle(pouleOne, 2, 3, 1, 0);
        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const items = rankingService.getItemsForPoule(pouleOne);

        const rankingItemOne = rankingService.getItemByRank(items, 1);
        expect(rankingItemOne).to.not.equal(undefined);
        if (!rankingItemOne) {
            return;
        }
        expect(rankingItemOne.getPlace()).to.equal(pouleOne.getPlace(1));

        const rankingItemTwo = rankingService.getItemByRank(items, 2);
        expect(rankingItemTwo).to.not.equal(undefined);
        if (!rankingItemTwo) {
            return;
        }
        expect(rankingItemTwo.getPlace()).to.equal(pouleOne.getPlace(2));

        const rankingItemThree = rankingService.getItemByRank(items, 3);
        expect(rankingItemThree).to.not.equal(undefined);
        if (!rankingItemThree) {
            return;
        }
        expect(rankingItemThree.getPlace()).to.equal(pouleOne.getPlace(3));
    });

    it('variation 5, against eachother , no games', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 4);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        // 3 gelijk laten eindigen
        setScoreSingle(pouleOne, 1, 2, 1, 0);
        // setScoreSingle(pouleOne, 1, 3, 1, 0);
        // setScoreSingle(pouleOne, 1, 4, 1, 1);
        setScoreSingle(pouleOne, 2, 3, 0, 1);
        setScoreSingle(pouleOne, 2, 4, 0, 1);
        // setScoreSingle(pouleOne, 3, 4, 3, 0);
        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const items = rankingService.getItemsForPoule(pouleOne);

        const rankingItemFour = rankingService.getItemByRank(items, 4);
        expect(rankingItemFour).to.not.equal(undefined);
        if (!rankingItemFour) {
            return;
        }
        expect(rankingItemFour.getPlace()).to.equal(pouleOne.getPlace(2));
    });

    it('variation 5, against eachother , equal', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 4);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        // 3 gelijk laten eindigen
        setScoreSingle(pouleOne, 1, 2, 1, 0);
        setScoreSingle(pouleOne, 1, 3, 1, 0);
        setScoreSingle(pouleOne, 1, 4, 0, 1);
        setScoreSingle(pouleOne, 2, 3, 0, 1);
        setScoreSingle(pouleOne, 2, 4, 0, 1);
        setScoreSingle(pouleOne, 3, 4, 1, 0);
        const rankingService = new RankingService(RankingService.RULESSET_WC);
        const items = rankingService.getItemsForPoule(pouleOne);

        expect(items[0].getRank()).to.equal(1);
        expect(items[1].getRank()).to.equal(1);
        expect(items[2].getRank()).to.equal(1);
        const rankingItemFour = rankingService.getItemByRank(items, 4);
        expect(rankingItemFour).to.not.equal(undefined);
        if (!rankingItemFour) {
            return;
        }
        expect(rankingItemFour.getPlace()).to.equal(pouleOne.getPlace(2));
    });
});
