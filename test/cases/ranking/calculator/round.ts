import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper, getStructureService } from '../../../helpers/singletonCreator';
import { jsonBaseCompetition } from '../../../data/competition';

import { createGames } from '../../../helpers/gamescreator';
import { PouleStructure, QualifyGroup, RankedRoundItem, RankingRuleSet, Round, RoundRankingCalculator, State } from '../../../../public_api';
import { setAgainstScoreSingle } from '../../../helpers/setscores';
import { createPlanningConfigNoTime } from '../../../helpers/planningConfigCreator';

describe('RoundRankingCalculator', () => {

    it('multiple equal ranked', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = getStructureService();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(3));
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());

        setAgainstScoreSingle(pouleOne, 1, 2, 0, 0);
        setAgainstScoreSingle(pouleOne, 1, 3, 0, 0);
        setAgainstScoreSingle(pouleOne, 2, 3, 0, 0);

        const equalRank = 1;

        const rankingService = new RoundRankingCalculator();
        const items = rankingService.getItemsForPoule(pouleOne);
        items.forEach(item => expect(item.getRank()).to.equal(equalRank));

        const getItemsByRank = (rankingItems: RankedRoundItem[], rank: number): RankedRoundItem[] => {
            return rankingItems.filter(rankingItemIt => rankingItemIt.getRank() === rank);
        }
        const equalItems = getItemsByRank(items, equalRank);

        expect(equalItems.length).to.equal(pouleOne.getPlaces().length)

        // cached items
        const cachedItems = rankingService.getItemsForPoule(pouleOne);
        cachedItems.forEach(item => expect(item.getRank()).to.equal(1));
    });

    it('single ranked, state played', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = getStructureService();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(3));
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());

        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 3, 2);

        const rankingService = new RoundRankingCalculator();
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

        const structureService = getStructureService();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(3));
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1, State.InProgress);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1, State.InProgress);
        setAgainstScoreSingle(pouleOne, 2, 3, 3, 2, State.InProgress);

        const rankingService = new RoundRankingCalculator([State.InProgress, State.Finished]);
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

        const rankingService2 = new RoundRankingCalculator();
        const items2 = rankingService2.getItemsForPoule(pouleOne);
        items2.forEach(item => expect(item.getRank()).to.equal(1));
    });

    it('horizontal ranked EC/WC', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = getStructureService();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(3, 3));
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

        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 3, 2);

        setAgainstScoreSingle(pouleTwo, 1, 2, 4, 2);
        setAgainstScoreSingle(pouleTwo, 1, 3, 6, 2);
        setAgainstScoreSingle(pouleTwo, 2, 3, 6, 4);


        const rankingService = new RoundRankingCalculator();
        const firstHorizontalPoule = rootRound.getHorizontalPoules(QualifyGroup.WINNERS)[0];
        const placeLocations = rankingService.getPlaceLocationsForHorizontalPoule(firstHorizontalPoule);

        expect(placeLocations[0].getPouleNr()).to.equal(2);
        expect(placeLocations[1].getPouleNr()).to.equal(1);

        competition.setRankingRuleSet(RankingRuleSet.AgainstAmong);
        const rankingService2 = new RoundRankingCalculator();
        const placeLocations2 = rankingService2.getPlaceLocationsForHorizontalPoule(firstHorizontalPoule);

        expect(placeLocations2[0].getPouleNr()).to.equal(2);
        expect(placeLocations2[1].getPouleNr()).to.equal(1);
    });

    // it('horizontal ranked no single rule', () => {
    //     const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

    //     const structureService = getStructureService();
    //     const jsonPlanningConfig = createPlanningConfigNoTime();
    //     const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(3, 3));
    //     const rootRound: Round = structure.getRootRound();

    //     structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

    //     const pouleOne = rootRound.getPoule(1);
    //     expect(pouleOne).to.not.equal(undefined);
    //     if (!pouleOne) {
    //         return;
    //     }
    //     const pouleTwo = rootRound.getPoule(2);
    //     expect(pouleTwo).to.not.equal(undefined);
    //     if (!pouleTwo) {
    //         return;
    //     }

    //     createGames(structure.getFirstRoundNumber());

    //     setAgainstScoreSingle(pouleOne, 1, 2, 2, 1);
    //     setAgainstScoreSingle(pouleOne, 1, 3, 3, 1);
    //     setAgainstScoreSingle(pouleOne, 2, 3, 3, 2);

    //     setAgainstScoreSingle(pouleTwo, 1, 2, 4, 2);
    //     setAgainstScoreSingle(pouleTwo, 1, 3, 6, 2);
    //     setAgainstScoreSingle(pouleTwo, 2, 3, 6, 4);

    //     const rankingService = new RoundRankingCalculator();
    //     const firstHorizontalPoule = rootRound.getHorizontalPoules(QualifyGroup.WINNERS)[0];
    //     const placeLocations = rankingService.getPlaceLocationsForHorizontalPoule(firstHorizontalPoule);

    //     expect(placeLocations.length).to.equal(0); why should this be zero?
    // });

    it('single ranked, AgainstAmount vs Against', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = getStructureService();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(4));
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());

        setAgainstScoreSingle(pouleOne, 1, 2, 1, 0);
        setAgainstScoreSingle(pouleOne, 3, 4, 1, 0);
        setAgainstScoreSingle(pouleOne, 4, 1, 1, 0);
        setAgainstScoreSingle(pouleOne, 3, 2, 0, 2);
        setAgainstScoreSingle(pouleOne, 1, 3, 1, 0);
        setAgainstScoreSingle(pouleOne, 2, 4, 1, 0);
        // 1 6p 2-1
        // 2 6p 3-1
        // 3 3p 1-3
        // 4 3p 1-2     
        // 1 wint van 2

        const rankingService = new RoundRankingCalculator();
        const items = rankingService.getItemsForPoule(pouleOne);

        const rankingItemFirstPlace = rankingService.getItemByRank(items, 1);
        expect(rankingItemFirstPlace).to.not.equal(undefined);
        if (!rankingItemFirstPlace) {
            return;
        }
        expect(rankingItemFirstPlace.getPlace()).to.equal(pouleOne.getPlace(2));

        const rankingItemSecondPlace = rankingService.getItemByRank(items, 2);
        expect(rankingItemSecondPlace).to.not.equal(undefined);
        if (!rankingItemSecondPlace) {
            return;
        }
        expect(rankingItemSecondPlace.getPlace()).to.equal(pouleOne.getPlace(1));

        competition.setRankingRuleSet(RankingRuleSet.AgainstAmong);
        const amongRankingCalculator = new RoundRankingCalculator();
        const amongItems = amongRankingCalculator.getItemsForPoule(pouleOne);

        const amongRankingItemFirstPlace = amongRankingCalculator.getItemByRank(amongItems, 1);
        expect(amongRankingItemFirstPlace).to.not.equal(undefined);
        if (!amongRankingItemFirstPlace) {
            return;
        }
        expect(amongRankingItemFirstPlace.getPlace()).to.equal(pouleOne.getPlace(1));

        const amongRankingItemSecondPlace = amongRankingCalculator.getItemByRank(amongItems, 2);
        expect(amongRankingItemSecondPlace).to.not.equal(undefined);
        if (!amongRankingItemSecondPlace) {
            return;
        }
        expect(amongRankingItemSecondPlace.getPlace()).to.equal(pouleOne.getPlace(2));
    });

    it('variation 1, mostPoints', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = getStructureService();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(3));
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 1, 2);
        setAgainstScoreSingle(pouleOne, 1, 3, 1, 3);
        setAgainstScoreSingle(pouleOne, 2, 3, 2, 3);

        const rankingService = new RoundRankingCalculator();
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

        const structureService = getStructureService();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(4));
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 5, 0);
        setAgainstScoreSingle(pouleOne, 3, 4, 0, 1);
        setAgainstScoreSingle(pouleOne, 4, 1, 1, 1);
        setAgainstScoreSingle(pouleOne, 3, 2, 0, 0);
        setAgainstScoreSingle(pouleOne, 1, 3, 0, 1);
        // setAgainstScoreSingle(pouleOne, 2, 4, 0, 1);        

        const rankingService = new RoundRankingCalculator();
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

        const structureService = getStructureService();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(4));
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());

        // setAgainstScoreSingle(pouleOne, 1, 2, 1, 0);
        setAgainstScoreSingle(pouleOne, 3, 4, 3, 0);
        setAgainstScoreSingle(pouleOne, 4, 1, 1, 1);
        setAgainstScoreSingle(pouleOne, 3, 2, 0, 0);
        setAgainstScoreSingle(pouleOne, 1, 3, 1, 0);
        setAgainstScoreSingle(pouleOne, 2, 4, 0, 5);

        const rankingService = new RoundRankingCalculator();
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

        const structureService = getStructureService();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(3));
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 1, 1);
        setAgainstScoreSingle(pouleOne, 1, 3, 2, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 1, 0);
        const rankingService = new RoundRankingCalculator();
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

        const structureService = getStructureService();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(4));
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        // 3 gelijk laten eindigen
        setAgainstScoreSingle(pouleOne, 1, 2, 1, 0);
        // setAgainstScoreSingle(pouleOne, 1, 3, 1, 0);
        // setAgainstScoreSingle(pouleOne, 1, 4, 1, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 0, 1);
        setAgainstScoreSingle(pouleOne, 2, 4, 0, 1);
        // setAgainstScoreSingle(pouleOne, 3, 4, 3, 0);
        const rankingService = new RoundRankingCalculator();
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

        const structureService = getStructureService();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureService.create(competition, jsonPlanningConfig, new PouleStructure(4));
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        // 3 gelijk laten eindigen
        setAgainstScoreSingle(pouleOne, 1, 2, 1, 0);
        setAgainstScoreSingle(pouleOne, 1, 3, 1, 0);
        setAgainstScoreSingle(pouleOne, 1, 4, 0, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 0, 1);
        setAgainstScoreSingle(pouleOne, 2, 4, 0, 1);
        setAgainstScoreSingle(pouleOne, 3, 4, 1, 0);
        const rankingService = new RoundRankingCalculator();
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
