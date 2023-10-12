import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper, getStructureEditor } from '../../../helpers/singletonCreator';
import { jsonBaseCompetition } from '../../../data/competition';
import { createGames } from '../../../helpers/gamescreator';
import { EndRankingCalculator, QualifyDistribution, QualifyService, QualifyTarget, StartLocationMap } from '../../../../public-api';
import { createTeamCompetitors } from '../../../helpers/teamcompetitorscreator';
import { setAgainstScoreSingle } from '../../../helpers/setscores';
import { createPlanningConfigNoTime } from '../../../helpers/planningConfigCreator';
import { StructureOutput } from '../../../helpers/structureOutput';

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

    it('2 roundnumbers, [4,4,4] => (W[5],(L[5])', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4,4,4], createPlanningConfigNoTime());
        const competitorMap = new StartLocationMap(createTeamCompetitors(competition, structure.getRootRounds()));
        const defaultCat = structure.getSingleCategory();
        const rootRound = defaultCat.getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [5], QualifyDistribution.Vertical);        
        const losersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [5], QualifyDistribution.Vertical);

        (new StructureOutput()).toConsole(structure, console);

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
        const pouleThree = rootRound.getPoule(3);
        expect(pouleThree).to.not.equal(undefined);
        if (!pouleThree) {
            return;
        }
        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1); // 1 9p
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1); // 2 6p
        setAgainstScoreSingle(pouleOne, 1, 4, 4, 1); // 3 3p        
        setAgainstScoreSingle(pouleOne, 2, 3, 3, 2); // 4 0p
        setAgainstScoreSingle(pouleOne, 2, 4, 4, 2);
        setAgainstScoreSingle(pouleOne, 3, 4, 4, 3);        

        setAgainstScoreSingle(pouleTwo, 1, 2, 4, 2); // 1 9p
        setAgainstScoreSingle(pouleTwo, 1, 3, 6, 2); // 2 6p
        setAgainstScoreSingle(pouleTwo, 1, 4, 8, 2); // 3 3p        
        setAgainstScoreSingle(pouleTwo, 2, 3, 6, 4); // 4 0p
        setAgainstScoreSingle(pouleTwo, 2, 4, 8, 4);
        setAgainstScoreSingle(pouleTwo, 3, 4, 8, 6);     
        
        setAgainstScoreSingle(pouleThree, 1, 2, 8, 4); // 1 9p
        setAgainstScoreSingle(pouleThree, 1, 3, 12, 4); // 2 6p
        setAgainstScoreSingle(pouleThree, 1, 4, 16, 4); // 3 3p        
        setAgainstScoreSingle(pouleThree, 2, 3, 12, 8); // 4 0p
        setAgainstScoreSingle(pouleThree, 2, 4, 16, 8);
        setAgainstScoreSingle(pouleThree, 3, 4, 16, 12);        

        const secondRoundNumber = structure.getFirstRoundNumber().getNext();
        expect(secondRoundNumber).to.not.equal(undefined);
        if (!secondRoundNumber) {
            return;
        }
        createGames(secondRoundNumber);
        
        const winnersPoule1 = winnersRound.getPoule(1);
        expect(winnersPoule1).to.not.equal(undefined);
        if (!winnersPoule1) {
            return;
        }
        setAgainstScoreSingle(winnersPoule1, 1, 2, 2, 1); // 1 12p
        setAgainstScoreSingle(winnersPoule1, 1, 3, 3, 1); // 2 9p
        setAgainstScoreSingle(winnersPoule1, 1, 4, 4, 1); // 3 6p
        setAgainstScoreSingle(winnersPoule1, 1, 5, 5, 1); // 4 3p
        setAgainstScoreSingle(winnersPoule1, 2, 3, 3, 2); // 5 0p
        setAgainstScoreSingle(winnersPoule1, 2, 4, 4, 2);
        setAgainstScoreSingle(winnersPoule1, 2, 5, 5, 2);
        setAgainstScoreSingle(winnersPoule1, 3, 4, 4, 3);
        setAgainstScoreSingle(winnersPoule1, 3, 5, 5, 3);
        setAgainstScoreSingle(winnersPoule1, 4, 5, 5, 4);   

        const losersPoule1 = losersRound.getPoule(1);
        expect(losersPoule1).to.not.equal(undefined);
        if (!losersPoule1) {
            return;
        }
        setAgainstScoreSingle(losersPoule1, 1, 2, 2, 1); // 1 12p
        setAgainstScoreSingle(losersPoule1, 1, 3, 3, 1); // 2 9p
        setAgainstScoreSingle(losersPoule1, 1, 4, 4, 1); // 3 6p
        setAgainstScoreSingle(losersPoule1, 1, 5, 5, 1); // 4 3p
        setAgainstScoreSingle(losersPoule1, 2, 3, 3, 2); // 5 0p
        setAgainstScoreSingle(losersPoule1, 2, 4, 4, 2);
        setAgainstScoreSingle(losersPoule1, 2, 5, 5, 2);
        setAgainstScoreSingle(losersPoule1, 3, 4, 4, 3);
        setAgainstScoreSingle(losersPoule1, 3, 5, 5, 3);
        setAgainstScoreSingle(losersPoule1, 4, 5, 5, 4);   

        const qualifyService = new QualifyService(rootRound);
        qualifyService.setQualifiers();

        const rankingService = new EndRankingCalculator(defaultCat);
        const items = rankingService.getItems();

        for (let rank = 1; rank <= items.length; rank++) {
            const endRankingItem = items[rank - 1];
            
            const startLocation = endRankingItem.getStartLocation();
            expect(startLocation).to.not.equal(undefined);
            if (!startLocation) {
                continue;
            }

            if( rank === 1) {
                expect(startLocation.getPouleNr()).to.equal(1);
                expect(startLocation.getPlaceNr()).to.equal(1);
            } else if( rank === 2) {
                expect(startLocation.getPouleNr()).to.equal(2);
                expect(startLocation.getPlaceNr()).to.equal(1);
            }
            else if( rank === 3) {
                expect(startLocation.getPouleNr()).to.equal(3);
                expect(startLocation.getPlaceNr()).to.equal(1);
            }
            else if( rank === 4) {
                expect(startLocation.getPouleNr()).to.equal(3);
                expect(startLocation.getPlaceNr()).to.equal(2);
            }
            else if( rank === 5) {
                expect(startLocation.getPouleNr()).to.equal(2);
                expect(startLocation.getPlaceNr()).to.equal(2);
            }
            else if( rank === 6) {
                expect(startLocation.getPouleNr()).to.equal(1); // 2
                expect(startLocation.getPlaceNr()).to.equal(2); // 1
            }
            else if( rank === 7) {
                expect(startLocation.getPouleNr()).to.equal(1); // 3
                expect(startLocation.getPlaceNr()).to.equal(3); // 3
            }
            else if( rank === 8) {
                expect(startLocation.getPouleNr()).to.equal(3);
                expect(startLocation.getPlaceNr()).to.equal(3);
            }
            else if( rank === 9) {
                expect(startLocation.getPouleNr()).to.equal(2);
                expect(startLocation.getPlaceNr()).to.equal(3);
            }
            else if( rank === 10) {
                expect(startLocation.getPouleNr()).to.equal(1);
                expect(startLocation.getPlaceNr()).to.equal(4);
            }
            else if( rank === 11) {
                expect(startLocation.getPouleNr()).to.equal(2);
                expect(startLocation.getPlaceNr()).to.equal(4);
            }
            else if( rank === 12) {
                expect(startLocation.getPouleNr()).to.equal(3);
                expect(startLocation.getPlaceNr()).to.equal(4);
            }
            // placeLocation            
            
            
        }
    });
});
