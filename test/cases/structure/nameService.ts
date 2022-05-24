import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper, getStructureEditor } from '../../helpers/singletonCreator';
import { jsonBaseCompetition } from '../../data/competition';

import { createGames } from '../../helpers/gamescreator';
import { createTeamCompetitors } from '../../helpers/teamcompetitorscreator';
import { CompetitorMap, Referee, PouleStructure, QualifyTarget, StructureNameService } from '../../../public-api';
import { createPlanningConfigNoTime } from '../../helpers/planningConfigCreator';
import { StructureOutput } from '../../helpers/structureOutput';

describe('StructureNameService', () => {

    it('roundnumber name', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 2], createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new StructureNameService(competitorMap);
        const rootRound = structure.getSingleCategory().getRootRound();

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
        expect(newSecondRoundNumberName).to.equal('2<sup>e</sup> ronde');
    });

    it('round name, roundAndParentsNeedsRanking no ranking', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();

        // root needs no ranking, unequal depth
        {
            const structure = structureEditor.create(competition, [2, 2], createPlanningConfigNoTime());
            const firstRoundNumber = structure.getFirstRoundNumber();
            const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
            const nameService = new StructureNameService(competitorMap);
            const rootRound = structure.getSingleCategory().getRootRound();

            structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
            expect(nameService.getRoundName(rootRound)).to.equal('&frac12; finale');

            structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);
            expect(nameService.getRoundName(rootRound)).to.equal('&frac12; finale');
        }

        // root needs ranking
        {
            const structure2 = structureEditor.create(competition, [4, 4, 4, 4], createPlanningConfigNoTime());
            const firstRoundNumber2 = structure2.getFirstRoundNumber();
            const competitorMap2 = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber2));
            const nameService2 = new StructureNameService(competitorMap2);
            const rootRound2 = structure2.getSingleCategory().getRootRound();

            expect(nameService2.getRoundName(rootRound2)).to.equal('1<sup>e</sup> ronde');

            // child needs ranking
            const winnersChildRound2 = structureEditor.addChildRound(rootRound2, QualifyTarget.Winners, [3]);

            expect(nameService2.getRoundName(winnersChildRound2)).to.equal('2<sup>e</sup> ronde');
        }
    });

    it('round name, htmlFractialNumber', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [2, 2, 2, 2, 2, 2, 2, 2], createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new StructureNameService(competitorMap);
        const rootRound = structure.getSingleCategory().getRootRound();

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
            expect(nameService.getRoundName(losersFinal)).to.equal('15<sup>e</sup>' + ' / ' + '16<sup>e</sup>' + ' pl');
        }
    });

    it('poule name', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const pouleStructure = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2];
        const structure = structureEditor.create(competition, pouleStructure, createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new StructureNameService(competitorMap);
        const rootRound = structure.getSingleCategory().getRootRound();

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
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const firstTeamCompetitor = createTeamCompetitors(competition, firstRoundNumber).shift();
        expect(firstTeamCompetitor).to.not.equal(undefined);
        if (!firstTeamCompetitor) {
            return
        }
        const competitorMap = new CompetitorMap([firstTeamCompetitor]);
        const nameService = new StructureNameService(competitorMap);
        const rootRound = structure.getSingleCategory().getRootRound();

        // basics
        {
            const firstPlace = rootRound.getFirstPlace(QualifyTarget.Winners);
            expect(firstPlace).to.not.equal(undefined);
            if (firstPlace) {
                expect(nameService.getPlaceName(firstPlace, false, false)).to.equal('A1');
                expect(nameService.getPlaceName(firstPlace, true, false)).to.equal('tc 1.1');
                expect(nameService.getPlaceName(firstPlace, false, true)).to.equal('nr. 1 poule A');
                expect(nameService.getPlaceName(firstPlace, true, true)).to.equal('tc 1.1');
            }
            const lastPlace = rootRound.getFirstPlace(QualifyTarget.Losers);
            expect(lastPlace).to.not.equal(undefined);
            if (lastPlace) {
                expect(nameService.getPlaceName(lastPlace)).to.equal('A3');
                expect(nameService.getPlaceName(lastPlace, true, false)).to.equal('A3');
                expect(nameService.getPlaceName(lastPlace, false, true)).to.equal('nr. 3 poule A');
                expect(nameService.getPlaceName(lastPlace, true, true)).to.equal('nr. 3 poule A');
            }
        }
    });

    it('place fromname', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 3], createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const firstTeamCompetitor = createTeamCompetitors(competition, firstRoundNumber).shift();
        expect(firstTeamCompetitor).to.not.equal(undefined);
        if (!firstTeamCompetitor) {
            return
        }
        const competitorMap = new CompetitorMap([firstTeamCompetitor]);
        const nameService = new StructureNameService(competitorMap);
        nameService.enableConsoleOutput();
        const rootRound = structure.getSingleCategory().getRootRound();

        // basics
        {
            const firstPlace = rootRound.getFirstPlace(QualifyTarget.Winners);
            const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2, 2]);

            expect(firstPlace).to.not.equal(undefined);
            if (firstPlace) {
                expect(nameService.getPlaceFromName(firstPlace, false, false)).to.equal('A1');
                expect(nameService.getPlaceFromName(firstPlace, true, false)).to.equal('tc 1.1');
                expect(nameService.getPlaceFromName(firstPlace, false, true)).to.equal('nr. 1 poule A');
                expect(nameService.getPlaceFromName(firstPlace, true, true)).to.equal('tc 1.1');
            }
            const lastPlace = rootRound.getFirstPlace(QualifyTarget.Losers);
            expect(lastPlace).to.not.equal(undefined);
            if (lastPlace) {
                expect(nameService.getPlaceFromName(lastPlace, false, false)).to.equal('C3');
                expect(nameService.getPlaceFromName(lastPlace, true, false)).to.equal('C3');
                expect(nameService.getPlaceFromName(lastPlace, false, true)).to.equal('nr. 3 poule C');
                expect(nameService.getPlaceFromName(lastPlace, true, true)).to.equal('nr. 3 poule C');
            }

            const winnersLastPlace = winnersRound.getPoule(1).getPlace(2);
            expect(nameService.getPlaceFromName(winnersLastPlace, false, false)).to.equal('1e2');
            expect(nameService.getPlaceFromName(winnersLastPlace, false, true)).to.equal('1e van 2e plekken');

            const winnersFirstPlace = winnersRound.getPoule(1).getPlace(1);
            expect(nameService.getPlaceFromName(winnersFirstPlace, false, false)).to.equal('A1');
            expect(nameService.getPlaceFromName(winnersFirstPlace, false, true)).to.equal('1e poule A');


            const winnersWinnersRound = structureEditor.addChildRound(winnersRound, QualifyTarget.Winners, [2]);
            const pouleTmp = winnersWinnersRound.getPoule(1);
            expect(pouleTmp).to.not.equal(undefined);
            if (pouleTmp) {
                const doubleWinnersFirstPlace = pouleTmp.getPlace(1);
                expect(doubleWinnersFirstPlace).to.not.equal(undefined);
                if (doubleWinnersFirstPlace) {
                    expect(nameService.getPlaceFromName(doubleWinnersFirstPlace, false, false)).to.equal('D1');
                    expect(nameService.getPlaceFromName(doubleWinnersFirstPlace, false, true)).to.equal('1e pl. wed. D');
                }
            }

            const winnersLosersRound = structureEditor.addChildRound(winnersRound, QualifyTarget.Losers, [2]);
            const pouleOneWinnersLosersChildRound = winnersLosersRound.getPoule(1);
            const winnersLosersFirstPlace = pouleOneWinnersLosersChildRound.getPlace(1);
            expect(winnersLosersFirstPlace).to.not.equal(undefined);
            if (!winnersLosersFirstPlace) {
                return;
            }
            expect(nameService.getPlaceFromName(winnersLosersFirstPlace, false)).to.equal('D2');
            expect(nameService.getPlaceFromName(winnersLosersFirstPlace, false, true)).to.equal('2e pl. wed. D');
        }
    });

    it('places fromname', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new CompetitorMap(createTeamCompetitors(competition, firstRoundNumber));
        const nameService = new StructureNameService(competitorMap);
        const rootRound = structure.getSingleCategory().getRootRound();

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

    it('place fromname 2', () => {

        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 3, 3], createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const firstTeamCompetitor = createTeamCompetitors(competition, firstRoundNumber).shift();
        expect(firstTeamCompetitor).to.not.equal(undefined);
        if (!firstTeamCompetitor) {
            return
        }
        const competitorMap = new CompetitorMap([firstTeamCompetitor]);
        const nameService = new StructureNameService(competitorMap);
        nameService.enableConsoleOutput();
        const rootRound = structure.getSingleCategory().getRootRound();

        // basics
        {
            const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2, 2]);
            const losersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [3, 2]);

            // (new StructureOutput()).toConsole(structure, console);

            const winnersSecondPlaceFirstPoule = winnersRound.getPoule(1).getPlace(2); // 1e2
            expect(nameService.getPlaceFromName(winnersSecondPlaceFirstPoule, false, false)).to.equal('1e2');
            expect(nameService.getPlaceFromName(winnersSecondPlaceFirstPoule, false, true)).to.equal('1e van 2e plekken');

            const losersFirstPlaceFirstPoule = losersRound.getPoule(1).getPlace(1); // 3e3
            expect(nameService.getPlaceFromName(losersFirstPlaceFirstPoule, false, false)).to.equal('3e3');
            expect(nameService.getPlaceFromName(losersFirstPlaceFirstPoule, false, true)).to.equal('3e van 2e pl. van onderen');

            const losersSecondPlaceFirstPoule = losersRound.getPoule(1).getPlace(2); // 2e3
            expect(nameService.getPlaceFromName(losersSecondPlaceFirstPoule, false, false)).to.equal('2e3');
            expect(nameService.getPlaceFromName(losersSecondPlaceFirstPoule, false, true)).to.equal('2e van 2e pl. van onderen');
        }
    });

});
