import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper, getStructureEditor } from '../helpers/singletonCreator';
import { jsonBaseCompetition } from '../data/competition';

import { createGames } from '../helpers/gamescreator';
import { createTeamCompetitors } from '../helpers/teamcompetitorscreator';
import { NameService, CompetitorMap, Referee, PouleStructure, QualifyTarget } from '../../public_api';
import { createPlanningConfigNoTime } from '../helpers/planningConfigCreator';

describe('NameService', () => {

    it('winnerslosers description', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, new PouleStructure(3, 3, 2));
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
        const structure = structureEditor.create(competition, jsonPlanningConfig, new PouleStructure(3, 3, 2));
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new NameService(competitorMap);
        const rootRound = structure.getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 4);
        structureEditor.addQualifiers(rootRound, QualifyTarget.Losers, 4);
        const secondRoundNumber = firstRoundNumber.getNext();
        expect(secondRoundNumber).to.not.equal(undefined);
        if (secondRoundNumber === undefined) {
            return;
        }
        const secondRoundNumberName = nameService.getRoundNumberName(secondRoundNumber);
        // all equal
        expect(secondRoundNumberName).to.equal('finale');

        const losersChildRound = rootRound.getBorderQualifyGroup(QualifyTarget.Losers).getChildRound();

        structureEditor.addQualifier(losersChildRound, QualifyTarget.Losers);
        // not all equal
        const newSecondRoundNumberName = nameService.getRoundNumberName(secondRoundNumber);
        expect(newSecondRoundNumberName).to.equal('2<sup>de</sup> ronde');
    });

    it('round name, roundAndParentsNeedsRanking no ranking', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        // root needs no ranking, unequal depth
        {
            const structureEditor = getStructureEditor();
            const jsonPlanningConfig = createPlanningConfigNoTime();
            const structure = structureEditor.create(competition, jsonPlanningConfig, new PouleStructure(2, 2));
            const firstRoundNumber = structure.getFirstRoundNumber();
            const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
            const nameService = new NameService(competitorMap);
            const rootRound = structure.getRootRound();

            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);

            expect(nameService.getRoundName(rootRound)).to.equal('&frac12; finale');

            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);

            expect(nameService.getRoundName(rootRound)).to.equal('&frac12; finale');
        }

        // root needs ranking
        {
            const structureEditor2 = getStructureEditor();
            const jsonPlanningConfig = createPlanningConfigNoTime();
            const structure2 = structureEditor2.create(competition, jsonPlanningConfig, new PouleStructure(4, 4, 4, 4));
            const firstRoundNumber2 = structure2.getFirstRoundNumber();
            const competitorMap2 = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber2));
            const nameService2 = new NameService(competitorMap2);
            const rootRound2 = structure2.getRootRound();

            expect(nameService2.getRoundName(rootRound2)).to.equal('1<sup>ste</sup> ronde');

            // child needs ranking
            structureEditor2.addQualifier(rootRound2, QualifyTarget.Winners);
            structureEditor2.addQualifier(rootRound2, QualifyTarget.Winners);
            const childOfRootRound2 = rootRound2.getChild(QualifyTarget.Winners, 1)
            expect(childOfRootRound2).to.not.equal(undefined);
            if (childOfRootRound2 === undefined) {
                return;
            }
            expect(nameService2.getRoundName(childOfRootRound2)).to.equal('2<sup>de</sup> ronde');
        }

    });

    it('round name, htmlFractialNumber', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, new PouleStructure(2, 2, 2, 2, 2, 2, 2, 2));
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new NameService(competitorMap);
        const rootRound = structure.getRootRound();

        // root needs ranking, depth 2
        {
            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);

            const winnersChildRound = rootRound.getBorderQualifyGroup(QualifyTarget.Winners).getChildRound();

            structureEditor.addQualifier(winnersChildRound, QualifyTarget.Winners);
            structureEditor.addQualifier(winnersChildRound, QualifyTarget.Winners);
            structureEditor.addQualifier(winnersChildRound, QualifyTarget.Winners);

            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);
            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);
            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);
            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);
            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);
            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);
            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);

            const losersChildRound = rootRound.getBorderQualifyGroup(QualifyTarget.Losers).getChildRound();

            structureEditor.addQualifier(losersChildRound, QualifyTarget.Losers);
            structureEditor.addQualifier(losersChildRound, QualifyTarget.Losers);
            structureEditor.addQualifier(losersChildRound, QualifyTarget.Losers);

            expect(nameService.getRoundName(rootRound)).to.equal('&frac14; finale');

            const doubleWinnersChildRound = winnersChildRound.getBorderQualifyGroup(QualifyTarget.Winners).getChildRound();
            structureEditor.addQualifier(doubleWinnersChildRound, QualifyTarget.Winners);

            const doubleLosersChildRound = losersChildRound.getBorderQualifyGroup(QualifyTarget.Losers).getChildRound();
            structureEditor.addQualifier(doubleLosersChildRound, QualifyTarget.Losers);

            const number = 8;
            expect(nameService.getRoundName(rootRound)).to.equal(
                '<span style="font-size: 80%"><sup>1</sup>&frasl;<sub>' + number + '</sub></span> finale'
            );

            const losersFinal = doubleLosersChildRound.getBorderQualifyGroup(QualifyTarget.Losers).getChildRound();
            expect(nameService.getRoundName(losersFinal)).to.equal('15<sup>de</sup>' + ' / ' + '16<sup>de</sup>' + ' pl');
        }
    });

    it('poule name', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const pouleStructure = new PouleStructure(3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2);
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
        const structure = structureEditor.create(competition, jsonPlanningConfig, new PouleStructure(3));
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
        const structure = structureEditor.create(competition, jsonPlanningConfig, new PouleStructure(3, 3, 3));
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

            structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 4);

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

            const winnersChildRound = rootRound.getBorderQualifyGroup(QualifyTarget.Winners).getChildRound();
            expect(winnersChildRound).to.not.equal(undefined);
            if (!winnersChildRound) {
                return
            }

            const poule1WinnersChildRound = winnersChildRound.getPoule(1);
            expect(poule1WinnersChildRound).to.not.equal(undefined);
            if (!poule1WinnersChildRound) {
                return
            }
            const winnersLastPlace = poule1WinnersChildRound.getPlace(2);
            expect(winnersLastPlace).to.not.equal(undefined);
            if (winnersLastPlace) {
                expect(nameService.getPlaceFromName(winnersLastPlace, false, false)).to.equal('?2');
                expect(nameService.getPlaceFromName(winnersLastPlace, false, true)).to.equal('beste nummer 2');
            }

            const winnersFirstPlace = poule1WinnersChildRound.getPlace(1);
            expect(winnersFirstPlace).to.not.equal(undefined);
            if (winnersFirstPlace) {
                expect(nameService.getPlaceFromName(winnersFirstPlace, false, false)).to.equal('A1');
                expect(nameService.getPlaceFromName(winnersFirstPlace, false, true)).to.equal('poule A nr. 1');
            }

            structureEditor.addQualifier(winnersChildRound, QualifyTarget.Winners);
            const doubleWinnersChildRound = winnersChildRound.getBorderQualifyGroup(QualifyTarget.Winners).getChildRound();
            expect(doubleWinnersChildRound).to.not.equal(undefined);
            if (doubleWinnersChildRound) {
                const pouleTmp = doubleWinnersChildRound.getPoule(1);
                expect(pouleTmp).to.not.equal(undefined);
                if (pouleTmp) {
                    const doubleWinnersFirstPlace = pouleTmp.getPlace(1);
                    expect(doubleWinnersFirstPlace).to.not.equal(undefined);
                    if (doubleWinnersFirstPlace) {
                        expect(nameService.getPlaceFromName(doubleWinnersFirstPlace, false, false)).to.equal('D1');
                        expect(nameService.getPlaceFromName(doubleWinnersFirstPlace, false, true)).to.equal('winnaar D');
                    }
                }
            }

            structureEditor.addQualifier(winnersChildRound, QualifyTarget.Losers);
            const winnersLosersChildRound = winnersChildRound.getBorderQualifyGroup(QualifyTarget.Losers).getChildRound();
            expect(winnersLosersChildRound).to.not.equal(undefined);
            if (!winnersLosersChildRound) {
                return;
            }
            const pouleOnewinnersLosersChildRound = winnersLosersChildRound.getPoule(1);
            expect(pouleOnewinnersLosersChildRound).to.not.equal(undefined);
            if (!pouleOnewinnersLosersChildRound) {
                return;
            }
            const winnersLosersFirstPlace = pouleOnewinnersLosersChildRound.getPlace(1);
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
        const structure = structureEditor.create(competition, jsonPlanningConfig, new PouleStructure(3));
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
        const structure = structureEditor.create(competition, jsonPlanningConfig, new PouleStructure(4, 4, 4));
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new NameService(competitorMap);
        const rootRound = structure.getRootRound();

        // basics
        {
            const firstWinnersHorPoule = rootRound.getHorizontalPoules(QualifyTarget.Winners)[0];
            expect(nameService.getHorizontalPouleName(firstWinnersHorPoule)).to.equal('nummers 1');

            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);

            const firstWinnersHorPoule2 = rootRound.getHorizontalPoules(QualifyTarget.Winners)[0];
            expect(nameService.getHorizontalPouleName(firstWinnersHorPoule2)).to.equal('2 beste nummers 1');

            const firstLosersHorPoule = rootRound.getHorizontalPoules(QualifyTarget.Losers)[0];
            expect(nameService.getHorizontalPouleName(firstLosersHorPoule)).to.equal('2 slechtste nummers laatste');

            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);

            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);
            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);

            const firstWinnersHorPoule3 = rootRound.getHorizontalPoules(QualifyTarget.Winners)[0];
            expect(nameService.getHorizontalPouleName(firstWinnersHorPoule3)).to.equal('nummers 1');

            const firstLosersHorPoule3 = rootRound.getHorizontalPoules(QualifyTarget.Losers)[0];
            expect(nameService.getHorizontalPouleName(firstLosersHorPoule3)).to.equal('nummers laatste');

            const secondWinnersHorPoule = rootRound.getHorizontalPoules(QualifyTarget.Winners)[1];
            expect(nameService.getHorizontalPouleName(secondWinnersHorPoule)).to.equal('beste nummer 2');

            const secondLosersHorPoule = rootRound.getHorizontalPoules(QualifyTarget.Losers)[1];
            expect(nameService.getHorizontalPouleName(secondLosersHorPoule)).to.equal('slechtste 1 na laatst');


            structureEditor.addQualifier(rootRound, QualifyTarget.Winners);
            const secondWinnersHorPoule2 = rootRound.getHorizontalPoules(QualifyTarget.Winners)[1];
            expect(nameService.getHorizontalPouleName(secondWinnersHorPoule2)).to.equal('2 beste nummers 2');

            structureEditor.addQualifier(rootRound, QualifyTarget.Losers);
            const secondLosersHorPoule2 = rootRound.getHorizontalPoules(QualifyTarget.Losers)[1];
            expect(nameService.getHorizontalPouleName(secondLosersHorPoule2)).to.equal('2 slechtste nummers 1 na laatst');
        }
    });

    it('referee name', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const jsonPlanningConfig = createPlanningConfigNoTime();
        const structure = structureEditor.create(competition, jsonPlanningConfig, new PouleStructure(3));
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
    //     const structure = structureEditor.create(competition, jsonPlanningConfig, new PouleStructure(3));
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
