import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper, getStructureEditor } from '../helpers/singletonCreator';
import { jsonBaseCompetition } from '../data/competition';

import { createGames } from '../helpers/gamescreator';
import { createTeamCompetitors } from '../helpers/teamcompetitorscreator';
import { NameService, CompetitorMap, Referee, PouleStructure, QualifyTarget } from '../../public_api';
import { createPlanningConfigNoTime } from '../helpers/planningConfigCreator';
import { StructureOutput } from '../helpers/structureOutput';

describe('NameService', () => {

    it('winnerslosers description', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, [3, 3, 2]);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new NameService(competitorMap);

        expect(nameService.getQualifyTargetDescription(QualifyTarget.Winners)).to.equal('winnaar');
        expect(nameService.getQualifyTargetDescription(QualifyTarget.Losers)).to.equal('verliezer');
        expect(nameService.getQualifyTargetDescription(QualifyTarget.Winners, true)).to.equal('winnaars');
        expect(nameService.getQualifyTargetDescription(QualifyTarget.Losers, true)).to.equal('verliezers');
        expect(nameService.getQualifyTargetDescription(QualifyTarget.Dropouts)).to.equal('');
    });

    it('roundnumber name', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, [3, 3, 2]);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new NameService(competitorMap);
        const rootRound = structure.getRootRound();

        structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2, 2]);
        const losersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2, 2]);
        const secondRoundNumber = firstRoundNumber.getNext();
        expect(secondRoundNumber).to.not.equal(undefined);
        if (secondRoundNumber === undefined) {
            return;
        }
        const secondRoundNumberName = nameService.getRoundNumberName(secondRoundNumber);
        // all equal
        expect(secondRoundNumberName).to.equal('finale');

        structureEditor.addChildRound(losersChildRound, QualifyTarget.Losers, [2]);
        // not all equal
        const newSecondRoundNumberName = nameService.getRoundNumberName(secondRoundNumber);
        expect(newSecondRoundNumberName).to.equal('2<sup>de</sup> ronde');
    });

    it('round name, roundAndParentsNeedsRanking no ranking', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();

        // root needs no ranking, unequal depth
        {
            const jsonPlanningConfig = createPlanningConfigNoTime();
            const structure = structureEditor.create(competition, jsonPlanningConfig, [2, 2]);
            const firstRoundNumber = structure.getFirstRoundNumber();
            const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
            const nameService = new NameService(competitorMap);
            const rootRound = structure.getRootRound();

            structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
            expect(nameService.getRoundName(rootRound)).to.equal('&frac12; finale');

            structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);
            expect(nameService.getRoundName(rootRound)).to.equal('&frac12; finale');
        }

        // root needs ranking
        {
            const jsonPlanningConfig = createPlanningConfigNoTime();
            const structure2 = structureEditor.create(competition, jsonPlanningConfig, [4, 4, 4, 4]);
            const firstRoundNumber2 = structure2.getFirstRoundNumber();
            const competitorMap2 = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber2));
            const nameService2 = new NameService(competitorMap2);
            const rootRound2 = structure2.getRootRound();

            expect(nameService2.getRoundName(rootRound2)).to.equal('1<sup>ste</sup> ronde');

            // child needs ranking
            const winnersChildRound2 = structureEditor.addChildRound(rootRound2, QualifyTarget.Winners, [3]);

            expect(nameService2.getRoundName(winnersChildRound2)).to.equal('2<sup>de</sup> ronde');
        }
    });

    it('round name, htmlFractialNumber', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, [2, 2, 2, 2, 2, 2, 2, 2]);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new NameService(competitorMap);
        const rootRound = structure.getRootRound();

        // root needs ranking, depth 2
        {
            const winnersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [4, 4]);
            const winnersWinnersRound = structureEditor.addChildRound(winnersChildRound, QualifyTarget.Winners, [2, 2]);

            const losersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [4, 4]);
            const losersLosersRound = structureEditor.addChildRound(losersChildRound, QualifyTarget.Losers, [2, 2]);

            expect(nameService.getRoundName(rootRound)).to.equal('&frac14; finale');

            const winnersFinal = structureEditor.addChildRound(winnersWinnersRound, QualifyTarget.Winners, [2]);
            const losersFinal = structureEditor.addChildRound(losersLosersRound, QualifyTarget.Losers, [2]);

            const number = 8;
            expect(nameService.getRoundName(rootRound)).to.equal(
                '<span style="font-size: 80%"><sup>1</sup>&frasl;<sub>' + number + '</sub></span> finale'
            );
            expect(nameService.getRoundName(losersFinal)).to.equal('15<sup>de</sup>' + ' / ' + '16<sup>de</sup>' + ' pl');
        }
    });

    it('poule name', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const pouleStructure = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2];
        const structure = structureEditor.create(competition, jsonPlanningConfig, pouleStructure);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new NameService(competitorMap);
        const rootRound = structure.getRootRound();

        // basics
        {
            const pouleOne = rootRound.getPoule(1);
            expect(pouleOne).to.not.equal(undefined);
            if (pouleOne) {
                expect(nameService.getPouleName(pouleOne, false)).to.equal('A');
                expect(nameService.getPouleName(pouleOne, true)).to.equal('poule A');
            }

            const poule27 = rootRound.getPoule(27);
            expect(poule27).to.not.equal(undefined);
            if (poule27) {
                expect(nameService.getPouleName(poule27, false)).to.equal('AA');
                expect(nameService.getPouleName(poule27, true)).to.equal('poule AA');
            }

            const poule30 = rootRound.getPoule(30);
            expect(poule30).to.not.equal(undefined);
            if (poule30) {
                expect(nameService.getPouleName(poule30, false)).to.equal('AD');
                expect(nameService.getPouleName(poule30, true)).to.equal('wed. AD');
            }
        }
    });

    it('place name', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, [3]);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const firstTeamCompetitor = createTeamCompetitors(competition, firstRoundNumber).shift();
        expect(firstTeamCompetitor).to.not.equal(undefined);
        if (!firstTeamCompetitor) {
            return
        }
        const competitorMap = new CompetitorMap([firstTeamCompetitor]);
        const nameService = new NameService(competitorMap);
        const rootRound = structure.getRootRound();

        // basics
        {
            const firstPlace = rootRound.getFirstPlace(QualifyTarget.Winners);
            expect(firstPlace).to.not.equal(undefined);
            if (firstPlace) {
                expect(nameService.getPlaceName(firstPlace, false, false)).to.equal('A1');
                expect(nameService.getPlaceName(firstPlace, true, false)).to.equal('tc 1.1');
                expect(nameService.getPlaceName(firstPlace, false, true)).to.equal('poule A nr. 1');
                expect(nameService.getPlaceName(firstPlace, true, true)).to.equal('tc 1.1');
            }
            const lastPlace = rootRound.getFirstPlace(QualifyTarget.Losers);
            expect(lastPlace).to.not.equal(undefined);
            if (lastPlace) {
                expect(nameService.getPlaceName(lastPlace)).to.equal('A3');
                expect(nameService.getPlaceName(lastPlace, true, false)).to.equal('A3');
                expect(nameService.getPlaceName(lastPlace, false, true)).to.equal('poule A nr. 3');
                expect(nameService.getPlaceName(lastPlace, true, true)).to.equal('poule A nr. 3');
            }
        }
    });

    it('place fromname', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, [3, 3, 3]);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const firstTeamCompetitor = createTeamCompetitors(competition, firstRoundNumber).shift();
        expect(firstTeamCompetitor).to.not.equal(undefined);
        if (!firstTeamCompetitor) {
            return
        }
        const competitorMap = new CompetitorMap([firstTeamCompetitor]);
        const nameService = new NameService(competitorMap);
        const rootRound = structure.getRootRound();

        // basics
        {
            const firstPlace = rootRound.getFirstPlace(QualifyTarget.Winners);
            const winnersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2, 2]);

            expect(firstPlace).to.not.equal(undefined);
            if (firstPlace) {
                expect(nameService.getPlaceFromName(firstPlace, false, false)).to.equal('A1');
                expect(nameService.getPlaceFromName(firstPlace, true, false)).to.equal('tc 1.1');
                expect(nameService.getPlaceFromName(firstPlace, false, true)).to.equal('poule A nr. 1');
                expect(nameService.getPlaceFromName(firstPlace, true, true)).to.equal('tc 1.1');
            }
            const lastPlace = rootRound.getFirstPlace(QualifyTarget.Losers);
            expect(lastPlace).to.not.equal(undefined);
            if (lastPlace) {
                expect(nameService.getPlaceFromName(lastPlace, false, false)).to.equal('C3');
                expect(nameService.getPlaceFromName(lastPlace, true, false)).to.equal('C3');
                expect(nameService.getPlaceFromName(lastPlace, false, true)).to.equal('poule C nr. 3');
                expect(nameService.getPlaceFromName(lastPlace, true, true)).to.equal('poule C nr. 3');
            }

            const winnersFirstPlace = winnersChildRound.getFirstPoule().getPlace(1);
            expect(nameService.getPlaceFromName(winnersFirstPlace, false, false)).to.equal('A1');
            expect(nameService.getPlaceFromName(winnersFirstPlace, false, true)).to.equal('poule A nr. 1');

            const winnersLastPlace = winnersChildRound.getFirstPoule().getPlace(2);
            expect(nameService.getPlaceFromName(winnersLastPlace, false, false)).to.equal('?2');
            expect(nameService.getPlaceFromName(winnersLastPlace, false, true)).to.equal('beste nummer 2');

            const winnersWinnersRound = structureEditor.addChildRound(winnersChildRound, QualifyTarget.Winners, [2]);
            const pouleTmp = winnersWinnersRound.getPoule(1);
            expect(pouleTmp).to.not.equal(undefined);
            if (pouleTmp) {
                const doubleWinnersFirstPlace = pouleTmp.getPlace(1);
                expect(doubleWinnersFirstPlace).to.not.equal(undefined);
                if (doubleWinnersFirstPlace) {
                    expect(nameService.getPlaceFromName(doubleWinnersFirstPlace, false, false)).to.equal('D1');
                    expect(nameService.getPlaceFromName(doubleWinnersFirstPlace, false, true)).to.equal('winnaar D');
                }
            }

            const winnersLosersRound = structureEditor.addChildRound(winnersChildRound, QualifyTarget.Losers, [2]);
            const pouleOneWinnersLosersChildRound = winnersLosersRound.getPoule(1);
            const winnersLosersFirstPlace = pouleOneWinnersLosersChildRound.getPlace(1);
            expect(winnersLosersFirstPlace).to.not.equal(undefined);
            if (!winnersLosersFirstPlace) {
                return;
            }
            expect(nameService.getPlaceFromName(winnersLosersFirstPlace, false)).to.equal('D2');
            expect(nameService.getPlaceFromName(winnersLosersFirstPlace, false, true)).to.equal('verliezer D');
        }
    });

    it('places fromname', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, [3]);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new NameService(competitorMap);
        const rootRound = structure.getRootRound();

        // basics
        {
            const firstPlace = rootRound.getFirstPlace(QualifyTarget.Winners);
            expect(firstPlace).to.not.equal(undefined);
            if (!firstPlace) {
                return;
            }

            createGames(structure.getFirstRoundNumber());
            const game = firstPlace.getPoule().getGames()[0];
            const gamePlaces = game.getPlaces();
            expect(nameService.getPlacesFromName(gamePlaces, false, false)).to.equal('A2 & A3');
        }
    });

    it('horizontalpoule name', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, [4, 4, 4]);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new NameService(competitorMap);
        const rootRound = structure.getRootRound();

        // basics
        {
            const firstWinnersHorPoule = rootRound.getHorizontalPoules(QualifyTarget.Winners)[0];
            expect(nameService.getHorizontalPouleName(firstWinnersHorPoule)).to.equal('nummers 1');

            const winnersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
            const losersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);

            const firstWinnersHorPoule2 = rootRound.getHorizontalPoules(QualifyTarget.Winners)[0];
            expect(nameService.getHorizontalPouleName(firstWinnersHorPoule2)).to.equal('2 beste nummers 1');

            const firstLosersHorPoule = rootRound.getHorizontalPoules(QualifyTarget.Losers)[0];
            expect(nameService.getHorizontalPouleName(firstLosersHorPoule)).to.equal('2 slechtste nummers laatste');

            structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 2);
            structureEditor.addQualifiers(rootRound, QualifyTarget.Losers, 2);

            const firstWinnersHorPoule3 = rootRound.getHorizontalPoules(QualifyTarget.Winners)[0];
            expect(nameService.getHorizontalPouleName(firstWinnersHorPoule3)).to.equal('nummers 1');

            const firstLosersHorPoule3 = rootRound.getHorizontalPoules(QualifyTarget.Losers)[0];
            expect(nameService.getHorizontalPouleName(firstLosersHorPoule3)).to.equal('nummers laatste');

            const secondWinnersHorPoule = rootRound.getHorizontalPoules(QualifyTarget.Winners)[1];
            expect(nameService.getHorizontalPouleName(secondWinnersHorPoule)).to.equal('beste nummer 2');

            const secondLosersHorPoule = rootRound.getHorizontalPoules(QualifyTarget.Losers)[1];
            expect(nameService.getHorizontalPouleName(secondLosersHorPoule)).to.equal('slechtste 1 na laatst');

            structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 1);
            const secondWinnersHorPoule2 = rootRound.getHorizontalPoules(QualifyTarget.Winners)[1];
            expect(nameService.getHorizontalPouleName(secondWinnersHorPoule2)).to.equal('2 beste nummers 2');

            structureEditor.addQualifiers(rootRound, QualifyTarget.Losers, 1);
            const secondLosersHorPoule2 = rootRound.getHorizontalPoules(QualifyTarget.Losers)[1];
            expect(nameService.getHorizontalPouleName(secondLosersHorPoule2)).to.equal('2 slechtste nummers 1 na laatst');
        }
    });

    it('referee name', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, [3]);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new NameService(competitorMap);
        const rootRound = structure.getRootRound();

        // basics
        {
            const firstPlace = rootRound.getFirstPlace(QualifyTarget.Winners);
            expect(firstPlace).to.not.equal(undefined);
            if (!firstPlace) {
                return;
            }

            createGames(structure.getFirstRoundNumber());
            const game = firstPlace.getPoule().getGames()[0];
            expect(nameService.getRefereeName(game)).to.equal('');

            const referee = new Referee(competition, 'CDK');
            referee.setName('Co Du');
            game.setReferee(referee);

            expect(nameService.getRefereeName(game)).to.equal('CDK');
            expect(nameService.getRefereeName(game, false)).to.equal('CDK');
            expect(nameService.getRefereeName(game, true)).to.equal('Co Du');

            game.setReferee(undefined);
            game.setRefereePlace(firstPlace);

            expect(nameService.getRefereeName(game)).to.equal('tc 1.1');
            expect(nameService.getRefereeName(game, false)).to.equal('tc 1.1');
            expect(nameService.getRefereeName(game, true)).to.equal('tc 1.1');
        }
    });

    // it('rule descriptions', () => {
    //     const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

    //     const structureEditor = getStructureEditor();
    //     const jsonPlanningConfig = createPlanningConfigNoTime();
    //     const structure = structureEditor.create(competition, jsonPlanningConfig, [3]);
    //     const rootRound: Round = structure.getRootRound();

    //     const rankingService = new RoundRankingCalculator();
    //     const ruleDescriptions = rankingService.getRuleDescriptions();
    //     expect(ruleDescriptions.length).to.equal(5);

    //     const rankingService2 = new RoundRankingCalculator(jsonPlanningConfig.gameMode, RankingRuleSet.EC);
    //     const ruleDescriptions2 = rankingService2.getRuleDescriptions();
    //     expect(ruleDescriptions2.length).to.equal(5);

    //     const rankingService3 = new RoundRankingCalculator(jsonPlanningConfig.gameMode, 0);
    //     expect(() => rankingService3.getRuleDescriptions()).to.throw(Error);
    // });


});
