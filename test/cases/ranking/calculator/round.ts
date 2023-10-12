import { expect } from 'chai';
import { describe, it } from 'mocha';

import { AgainstRuleSet, QualifyTarget, Round, RoundRankingCalculator, RoundRankingItem, GameState, Poule, Cumulative, PointsCalculation, QualifyDistribution } from '../../../../public-api';
import { setAgainstScoreSingle } from '../../../helpers/setscores';
import { createPlanningConfigNoTime } from '../../../helpers/planningConfigCreator';
import { createGames } from '../../../helpers/gamescreator';
import { getCompetitionMapper, getStructureEditor } from '../../../helpers/singletonCreator';
import { jsonBaseCompetition, jsonMultiSportsCompetition } from '../../../data/competition';


describe('RoundRankingCalculator', () => {

    it('multiple equal ranked', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

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

        const getItemsByRank = (rankingItems: RoundRankingItem[], rank: number): RoundRankingItem[] => {
            return rankingItems.filter(rankingItemIt => rankingItemIt.getRank() === rank);
        }
        const equalItems = getItemsByRank(items, equalRank);

        expect(equalItems.length).to.equal(pouleOne.getPlaces().length)

        // cached items
        const cachedItems = rankingService.getItemsForPoule(pouleOne);
        cachedItems.forEach(item => expect(item.getRank()).to.equal(1));
    });

    // it('hor poule ranked', () => {
    //     const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

    //     const structureEditor = getStructureEditor();
    //     const jsonPlanningConfig = createPlanningConfigNoTime();
    //     const structure = structureEditor.create(competition, jsonPlanningConfig, [3, 3]);
    //     const rootRound: Round = structure.getSingleCategory().getRootRound();

    //     const pouleOne = rootRound.getPoule(1);
    //     expect(pouleOne).to.not.equal(undefined);
    //     if (!pouleOne) {
    //         return;
    //     }
    //     createGames(structure.getFirstRoundNumber());
    //     setAgainstScoreSingle(pouleOne, 1, 2, 0, 0);
    //     setAgainstScoreSingle(pouleOne, 1, 3, 0, 0);
    //     setAgainstScoreSingle(pouleOne, 2, 3, 0, 0);

    //     const pouleTwo = rootRound.getPoule(1);
    //     expect(pouleTwo).to.not.equal(undefined);
    //     if (!pouleTwo) {
    //         return;
    //     }
    //     createGames(structure.getFirstRoundNumber());
    //     setAgainstScoreSingle(pouleTwo, 1, 2, 1, 0);
    //     setAgainstScoreSingle(pouleTwo, 1, 3, 1, 0);
    //     setAgainstScoreSingle(pouleTwo, 2, 3, 0, 1);

    //     const equalRank = 1;

    //     const nrTwos = rootRound.getHorizontalPoule(QualifyTarget.Winners, 2);
    //     const rankingService = new RoundRankingCalculator();
    //     const items = rankingService.getItemsForHorizontalPoule(nrTwos);

    //     items.forEach((item: RoundRankingItem) => {
    //         if (item.getRank() === 1) {
    //             expect(item.getPlace()).to.equal(pouleTwo.getPlace(3));
    //         }
    //     });
    // });

    it('single ranked, state finished', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

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

    it('single ranked, state progress && finished', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1, GameState.InProgress);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1, GameState.InProgress);
        setAgainstScoreSingle(pouleOne, 2, 3, 3, 2, GameState.InProgress);

        const rankingService = new RoundRankingCalculator([GameState.InProgress, GameState.Finished]);
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

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

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
        // Against: 1.1, 1.2, 1.3
        // AgainstAmong


        const rankingService = new RoundRankingCalculator();
        const firstHorizontalPoule = rootRound.getHorizontalPoules(QualifyTarget.Winners)[0];
        const places = rankingService.getPlacesForHorizontalPoule(firstHorizontalPoule);

        expect(places[0].getPouleNr()).to.equal(2);
        expect(places[1].getPouleNr()).to.equal(1);

        competition.setAgainstRuleSet(AgainstRuleSet.AmongFirst);
        const rankingService2 = new RoundRankingCalculator();
        const places2 = rankingService2.getPlacesForHorizontalPoule(firstHorizontalPoule);

        expect(places2[0].getPouleNr()).to.equal(2);
        expect(places2[1].getPouleNr()).to.equal(1);
    });

    it('[3,3], multiple rule third place against diff', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 3, QualifyDistribution.HorizontalSnake);

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

        const thirdPlacedItem = rankingService.getItemByRank(rankingItems, 1);
        // console.log(thirdPlace);
        expect(thirdPlacedItem).to.not.equal(undefined);
        if (!thirdPlacedItem) {
            return;
        }
        expect(thirdPlacedItem.getPlace()).to.equal(pouleTwo.getPlace(3));
    });

    it('[3,3], multiple rule third place against totally equal', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 3, QualifyDistribution.HorizontalSnake);

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
        setAgainstScoreSingle(pouleTwo, 2, 3, 0, 1);

        const rankingService = new RoundRankingCalculator();
        const nrsTwo = rootRound.getHorizontalPoule(QualifyTarget.Winners, 2);
        const rankingItems = rankingService.getItemsForHorizontalPoule(nrsTwo);

        const thirdPlace = rankingService.getItemByRank(rankingItems, 1);
        // console.log(thirdPlace);
        expect(thirdPlace).to.not.equal(undefined);
        if (!thirdPlace) {
            return;
        }
        expect(thirdPlace.getPlace()).to.equal(pouleOne.getPlace(3));
    });

    it('single ranked, AgainstAmount vs Against', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

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
        if (rankingItemFirstPlace) {
            expect(rankingItemFirstPlace.getPlace()).to.equal(pouleOne.getPlace(2));
        }

        const rankingItemSecondPlace = rankingService.getItemByRank(items, 2);
        expect(rankingItemSecondPlace).to.not.equal(undefined);
        if (rankingItemSecondPlace) {
            expect(rankingItemSecondPlace.getPlace()).to.equal(pouleOne.getPlace(1));
        }

        // AMONGFIRST
        competition.setAgainstRuleSet(AgainstRuleSet.AmongFirst);
        const amongRankingCalculator = new RoundRankingCalculator();
        const amongItems = amongRankingCalculator.getItemsForPoule(pouleOne);

        const amongRankingItemFirstPlace = amongRankingCalculator.getItemByRank(amongItems, 1);
        expect(amongRankingItemFirstPlace).to.not.equal(undefined);
        if (amongRankingItemFirstPlace) {
            expect(amongRankingItemFirstPlace.getPlace()).to.equal(pouleOne.getPlace(1));
        }

        const amongRankingItemSecondPlace = amongRankingCalculator.getItemByRank(amongItems, 2);
        expect(amongRankingItemSecondPlace).to.not.equal(undefined);
        if (amongRankingItemSecondPlace) {
            expect(amongRankingItemSecondPlace.getPlace()).to.equal(pouleOne.getPlace(2));
        }

    });

    it('variation 1, mostPoints', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

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

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

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

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

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

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

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

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

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

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

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

    it('place extra points', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        pouleOne.getPlace(1).setExtraPoints(-4);

        createGames(structure.getFirstRoundNumber());
        // 3 gelijk laten eindigen
        setAgainstScoreSingle(pouleOne, 1, 2, 1, 0);
        setAgainstScoreSingle(pouleOne, 1, 3, 1, 0);
        setAgainstScoreSingle(pouleOne, 2, 3, 1, 0);
        const rankingService = new RoundRankingCalculator();
        const items = rankingService.getItemsForPoule(pouleOne);

        const first = rankingService.getItemByRank(items, 1);
        expect(first).to.not.equal(undefined);
        if (first) {
            expect(first.getPlace().getPlaceNr()).to.equal(2);
        }
        const second = rankingService.getItemByRank(items, 2);
        expect(second).to.not.equal(undefined);
        if (second) {
            expect(second.getPlace().getPlaceNr()).to.equal(1);
        }
    });

    it('game extra home/away-points', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        pouleOne.getPlace(1).setExtraPoints(-4);

        createGames(structure.getFirstRoundNumber());
        // 3 gelijk laten eindigen
        setAgainstScoreSingle(pouleOne, 1, 2, 1, 0, GameState.Finished, -4);
        setAgainstScoreSingle(pouleOne, 1, 3, 1, 0);
        setAgainstScoreSingle(pouleOne, 2, 3, 1, 0, GameState.Finished, 0, 4);
        const rankingService = new RoundRankingCalculator();
        const items = rankingService.getItemsForPoule(pouleOne);

        const first = rankingService.getItemByRank(items, 1);
        expect(first).to.not.equal(undefined);
        if (first) {
            expect(first.getPlace().getPlaceNr()).to.equal(3);
        }
        const second = rankingService.getItemByRank(items, 2);
        expect(second).to.not.equal(undefined);
        if (second) {
            expect(second.getPlace().getPlaceNr()).to.equal(2);
        }
    });

    it('pointsCalculation scores', () => {
        jsonBaseCompetition.sports[0].defaultPointsCalculation = PointsCalculation.Scores;
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        // 3 gelijk laten eindigen
        setAgainstScoreSingle(pouleOne, 1, 2, 7, 6);
        setAgainstScoreSingle(pouleOne, 1, 3, 7, 0);
        setAgainstScoreSingle(pouleOne, 1, 4, 7, 0);
        setAgainstScoreSingle(pouleOne, 2, 3, 0, 1);
        setAgainstScoreSingle(pouleOne, 2, 4, 0, 1);
        setAgainstScoreSingle(pouleOne, 3, 4, 1, 0);
        const rankingService = new RoundRankingCalculator();
        const items = rankingService.getItemsForPoule(pouleOne);

        expect(items[0].getPlace().getPlaceNr()).to.equal(1);
        expect(items[1].getPlace().getPlaceNr()).to.equal(2);
        expect(items[2].getPlace().getPlaceNr()).to.equal(3);
        expect(items[3].getPlace().getPlaceNr()).to.equal(4);
        jsonBaseCompetition.sports[0].defaultPointsCalculation = PointsCalculation.AgainstGamePoints;
    });

    it('test2SportsByRank', () => {

        const competition = getCompetitionMapper().toObject(jsonMultiSportsCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());

        setScoresHelper(pouleOne);

        const roundRankingCalculator = new RoundRankingCalculator();
        const roundRankingItems = roundRankingCalculator.getItemsForPoule(pouleOne);

        const roundRankingItem1 = roundRankingItems.shift();
        expect(roundRankingItem1).not.to.equal(undefined);
        expect(roundRankingItem1.getPlace().getPlaceNr()).to.equal(4);

        const roundRankingItem2 = roundRankingItems.shift();
        expect(roundRankingItem2).not.to.equal(undefined);
        expect(roundRankingItem2.getPlace().getPlaceNr()).to.equal(1);

        const roundRankingItem3 = roundRankingItems.shift();
        expect(roundRankingItem3).not.to.equal(undefined);
        expect(roundRankingItem3.getPlace().getPlaceNr()).to.equal(3);

        const roundRankingItem4 = roundRankingItems.shift();
        expect(roundRankingItem4).not.to.equal(undefined);
        expect(roundRankingItem4.getPlace().getPlaceNr()).to.equal(2);
    });

    it('test2SportsByPerformance', () => {

        const competition = getCompetitionMapper().toObject(jsonMultiSportsCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4], createPlanningConfigNoTime());
        const defaultCat = structure.getSingleCategory();
        const rootRound: Round = defaultCat.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }
        createGames(structure.getFirstRoundNumber());

        setScoresHelper(pouleOne);

        const roundRankingCalculator = new RoundRankingCalculator(undefined, Cumulative.byPerformance);
        const roundRankingItems = roundRankingCalculator.getItemsForPoule(pouleOne);

        const roundRankingItem1 = roundRankingItems.shift();
        expect(roundRankingItem1).not.to.equal(undefined);
        expect(roundRankingItem1.getPlace().getPlaceNr()).to.equal(1);

        const roundRankingItem2 = roundRankingItems.shift();
        expect(roundRankingItem2).not.to.equal(undefined);
        expect(roundRankingItem2.getPlace().getPlaceNr()).to.equal(4);

        const roundRankingItem3 = roundRankingItems.shift();
        expect(roundRankingItem3).not.to.equal(undefined);
        expect(roundRankingItem3.getPlace().getPlaceNr()).to.equal(3);

        const roundRankingItem4 = roundRankingItems.shift();
        expect(roundRankingItem4).not.to.equal(undefined);
        expect(roundRankingItem4.getPlace().getPlaceNr()).to.equal(2);
    });
});

function setScoresHelper(poule: Poule) {
    setAgainstScoreSingle(poule, 1, 2, 6, 0); // V
    setAgainstScoreSingle(poule, 3, 4, 1, 0); // V
    setAgainstScoreSingle(poule, 1, 4, 0, 3); // S2
    setAgainstScoreSingle(poule, 2, 3, 0, 2); // S2
    setAgainstScoreSingle(poule, 2, 4, 0, 1); // S3
    setAgainstScoreSingle(poule, 1, 3, 1, 0); // S3
    // pl     rank      pnt    saldo        cumulativeRank
    //                                      V   S2      S3      TOT        RANK
    //  1        1        6      7-3        1    4      1        6          2
    //  2        4        0      0-9        4    3      2        9          4
    //  3        3        6      3-1        2    2      2        6          3
    //  4        2        6      4-1        3    1      1        5          1
}


