import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
    HorizontalMultipleQualifyRule,
    HorizontalSingleQualifyRule,
    QualifyDistribution,
    QualifyService,
    QualifyTarget,
    StartLocationMap
} from '../../../public-api';
import { getCompetitionMapper, getStructureEditor } from '../../helpers/singletonCreator';
import { jsonBaseCompetition } from '../../data/competition';
import { createGames } from '../../helpers/gamescreator';
import { createTeamCompetitors } from '../../helpers/teamcompetitorscreator';
import { createPlanningConfigNoTime } from '../../helpers/planningConfigCreator';
import { setAgainstScoreSingle } from '../../helpers/setscores';
import { StructureOutput } from '../../helpers/structureOutput';

describe('QualifyService', () => {

    it('2 roundnumbers, five places', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [5], createPlanningConfigNoTime());
        const startLocationMap = new StartLocationMap(createTeamCompetitors(competition, structure.getRootRounds()));
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const losersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);

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

        const qualifyService = new QualifyService(rootRound);
        qualifyService.setQualifiers();

        const winnersPoule = winnersRound.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }
        const winnersPlace1 = winnersPoule.getPlace(1);
        expect(winnersPlace1).to.not.equal(undefined);
        if (winnersPlace1) {
            const winnersLocation1 = winnersPlace1.getStartLocation();
            if (winnersLocation1) {
                expect(startLocationMap.getCompetitor(winnersLocation1)).to.not.equal(undefined);
                expect(startLocationMap.getCompetitor(winnersLocation1)?.getName()).to.equal('tc 1.1');
            }
        }
        const winnersPlace2 = winnersPoule.getPlace(2);
        expect(winnersPlace2).to.not.equal(undefined);
        if (winnersPlace2) {
            const winnersLocation2 = winnersPlace2.getStartLocation();
            if (winnersLocation2) {
                expect(startLocationMap.getCompetitor(winnersLocation2)).to.not.equal(undefined);
                expect(startLocationMap.getCompetitor(winnersLocation2)?.getName()).to.equal('tc 1.2');
            }
        }

        const loserssPoule = losersRound.getPoule(1);
        expect(loserssPoule).to.not.equal(undefined);
        if (!loserssPoule) {
            return;
        }
        const losersPlace1 = loserssPoule.getPlace(1);
        expect(losersPlace1).to.not.equal(undefined);
        if (losersPlace1) {
            const losersLocation1 = losersPlace1.getStartLocation();
            if (losersLocation1) {
                expect(startLocationMap.getCompetitor(losersLocation1)).to.not.equal(undefined);
                expect(startLocationMap.getCompetitor(losersLocation1)?.getName()).to.equal('tc 1.4');
            }
        }
        const losersPlace2 = loserssPoule.getPlace(2);
        expect(losersPlace2).to.not.equal(undefined);
        if (losersPlace2) {
            const losersLocation2 = losersPlace2.getStartLocation();
            if (losersLocation2) {
                expect(startLocationMap.getCompetitor(losersLocation2)).to.not.equal(undefined);
                expect(startLocationMap.getCompetitor(losersLocation2)?.getName()).to.equal('tc 1.5');
            }
        }

    });

    it('2 roundnumbers, five places, filter poule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3], createPlanningConfigNoTime());
        const competitorMap = new StartLocationMap(createTeamCompetitors(competition, structure.getRootRounds()));
        const rootRound = structure.getSingleCategory().getRootRound();

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

        const winnersRoundOne = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const losersRoundOne = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);

        createGames(structure.getFirstRoundNumber());

        setAgainstScoreSingle(pouleOne, 1, 2, 2, 1);
        setAgainstScoreSingle(pouleOne, 1, 3, 3, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 4, 1);

        setAgainstScoreSingle(pouleTwo, 1, 2, 2, 1);
        setAgainstScoreSingle(pouleTwo, 1, 3, 3, 1);
        setAgainstScoreSingle(pouleTwo, 2, 3, 4, 1);


        const qualifyService = new QualifyService(rootRound);
        qualifyService.setQualifiers(pouleOne);

        const winnersPoule = winnersRoundOne.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }

        const winnersPlace1 = winnersPoule.getPlace(1);
        expect(winnersPlace1).to.not.equal(undefined);
        if (winnersPlace1) {
            const winnersLocation1 = winnersPlace1.getStartLocation();
            if (winnersLocation1) {
                expect(competitorMap.getCompetitor(winnersLocation1)).to.not.equal(undefined);
                expect(competitorMap.getCompetitor(winnersLocation1)?.getName()).to.equal('tc 1.1');
            }
        }

        const winnersPlace2 = winnersPoule.getPlace(2);
        expect(winnersPlace2).to.not.equal(undefined);
        if (winnersPlace2) {
            expect(winnersPlace2.getQualifiedPlace()).to.equal(undefined);
        }

        const losersPoule = losersRoundOne.getPoule(1);
        expect(losersPoule).to.not.equal(undefined);
        if (!losersPoule) {
            return;
        }

        const losersPlace1 = losersPoule.getPlace(1);
        expect(losersPlace1).to.not.equal(undefined);
        if (losersPlace1) {
            const losersLocation1 = losersPlace1.getStartLocation();
            if (losersLocation1) {
                expect(competitorMap.getCompetitor(losersLocation1)).to.not.equal(undefined);
            }
        }

        const losersPlace2 = losersPoule.getPlace(2);
        expect(losersPlace2).to.not.equal(undefined);
        if (losersPlace2) {
            expect(losersPlace2.getQualifiedPlace()).to.equal(undefined);
        }
    });

    it('2 roundnumbers, [3,3,3] => W[4], L[4] : multiple rules', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 3], createPlanningConfigNoTime());
        const competitorMap = new StartLocationMap(createTeamCompetitors(competition, structure.getRootRounds()));
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [4]);
        const losersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [4]);

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

        setAgainstScoreSingle(pouleOne, 1, 2, 1, 2);
        setAgainstScoreSingle(pouleOne, 1, 3, 1, 3);
        setAgainstScoreSingle(pouleOne, 2, 3, 2, 3);
        setAgainstScoreSingle(pouleTwo, 1, 2, 1, 2);
        setAgainstScoreSingle(pouleTwo, 1, 3, 1, 3);
        setAgainstScoreSingle(pouleTwo, 2, 3, 2, 4);
        setAgainstScoreSingle(pouleThree, 1, 2, 1, 5);
        setAgainstScoreSingle(pouleThree, 1, 3, 1, 3);
        setAgainstScoreSingle(pouleThree, 2, 3, 2, 5);

        const qualifyService = new QualifyService(rootRound);
        const changedPlaces = qualifyService.setQualifiers();
        expect(changedPlaces.length).to.equal(8);


        const winnersPoule = winnersRound.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }
        const winnersQualifyGroup = winnersRound.getParentQualifyGroup();
        expect(winnersQualifyGroup).to.not.equal(undefined);
        if (winnersQualifyGroup === undefined) {
            return;
        }

        const winnersPlace1 = winnersPoule.getPlace(1);
        expect(winnersPlace1).to.not.equal(undefined);
        if (winnersPlace1) {
            const qualifyRule = winnersQualifyGroup.getRuleByToPlace(winnersPlace1);
            expect(qualifyRule).to.instanceOf(HorizontalSingleQualifyRule);
            const winnersLocation1 = winnersPlace1.getStartLocation();
            if (winnersLocation1) {
                expect(competitorMap.getCompetitor(winnersLocation1)).to.not.equal(undefined);
            }
        }

        const winnersPlace2 = winnersPoule.getPlace(2);
        expect(winnersPlace2).to.not.equal(undefined);
        if (winnersPlace2) {
            const qualifyRule = winnersQualifyGroup.getRuleByToPlace(winnersPlace2);
            expect(qualifyRule).to.instanceOf(HorizontalSingleQualifyRule);
            const winnersLocation2 = winnersPlace2.getStartLocation();
            if (winnersLocation2) {
                expect(competitorMap.getCompetitor(winnersLocation2)).to.not.equal(undefined);
            }
        }

        const winnersPlace3 = winnersPoule.getPlace(3);
        expect(winnersPlace3).to.not.equal(undefined);
        if (winnersPlace3) {
            const qualifyRule = winnersQualifyGroup.getRuleByToPlace(winnersPlace3);
            expect(qualifyRule).to.instanceOf(HorizontalSingleQualifyRule);
            const winnersLocation3 = winnersPlace3.getStartLocation();
            if (winnersLocation3) {
                expect(competitorMap.getCompetitor(winnersLocation3)).to.not.equal(undefined);
            }
        }

        const winnersPlace4 = winnersPoule.getPlace(4);
        expect(winnersPlace4).to.not.equal(undefined);
        if (winnersPlace4) {
            const qualifyRule = winnersQualifyGroup.getRuleByToPlace(winnersPlace4);
            expect(qualifyRule).to.instanceOf(HorizontalMultipleQualifyRule);
            const winnersLocation4 = winnersPlace4.getStartLocation();
            if (winnersLocation4) {
                expect(competitorMap.getCompetitor(winnersLocation4)?.getName()).to.equal('tc 3.2');
            }
        }

        const losersQualifyGroup = losersRound.getParentQualifyGroup();
        expect(losersQualifyGroup).to.not.equal(undefined);
        if (losersQualifyGroup === undefined) {
            return;
        }

        const losersPoule = losersRound.getPoule(1);
        expect(losersPoule).to.not.equal(undefined);
        if (!losersPoule) {
            return;
        }
        const losersPlace1 = losersPoule.getPlace(1);
        expect(losersPlace1).to.not.equal(undefined);
        if (losersPlace1) {
            const qualifyRule = losersQualifyGroup.getRuleByToPlace(losersPlace1);
            expect(qualifyRule).to.instanceOf(HorizontalMultipleQualifyRule);
            const losersLocation1 = losersPlace1.getStartLocation();
            if (losersLocation1) {
                expect(competitorMap.getCompetitor(losersLocation1)?.getName()).to.not.equal(undefined);
            }
        }

        const losersPlace2 = losersPoule.getPlace(2);
        expect(losersPlace2).to.not.equal(undefined);
        if (losersPlace2) {
            const qualifyRule = losersQualifyGroup.getRuleByToPlace(losersPlace2);
            expect(qualifyRule).to.instanceOf(HorizontalSingleQualifyRule);
            const losersLocation2 = losersPlace2.getStartLocation();
            if (losersLocation2) {
                expect(competitorMap.getCompetitor(losersLocation2)?.getName()).to.not.equal(undefined);
            }
        }

        const losersPlace3 = losersPoule.getPlace(3);
        expect(losersPlace3).to.not.equal(undefined);
        if (losersPlace3) {
            const qualifyRule = losersQualifyGroup.getRuleByToPlace(losersPlace3);
            expect(qualifyRule).to.instanceOf(HorizontalSingleQualifyRule);
            const losersLocation3 = losersPlace3.getStartLocation();
            if (losersLocation3) {
                expect(competitorMap.getCompetitor(losersLocation3)).to.not.equal(undefined);
            }
        }

        const losersPlace4 = losersPoule.getPlace(4);
        expect(losersPlace4).to.not.equal(undefined);
        if (losersPlace4) {
            const qualifyRule = losersQualifyGroup.getRuleByToPlace(losersPlace4);
            expect(qualifyRule).to.instanceOf(HorizontalSingleQualifyRule);
            const losersLocation4 = losersPlace4.getStartLocation();
            if (losersLocation4) {
                expect(competitorMap.getCompetitor(losersLocation4)).to.not.equal(undefined);
            }
        }

    });

    it('2 roundnumbers, [3,3,3] => W[4], not finished', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 3], createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new StartLocationMap(createTeamCompetitors(competition, structure.getRootRounds()));
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersRoundOne = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [4]);

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
        setAgainstScoreSingle(pouleOne, 1, 2, 1, 2);
        setAgainstScoreSingle(pouleOne, 1, 3, 1, 3);
        setAgainstScoreSingle(pouleOne, 2, 3, 2, 3);
        setAgainstScoreSingle(pouleTwo, 1, 2, 1, 2);
        setAgainstScoreSingle(pouleTwo, 1, 3, 1, 3);
        setAgainstScoreSingle(pouleTwo, 2, 3, 2, 4);
        setAgainstScoreSingle(pouleThree, 1, 2, 1, 5);
        setAgainstScoreSingle(pouleThree, 1, 3, 1, 3);
        // setAgainstScoreSingle(pouleThree, 2, 3, 2, 5);

        const qualifyService = new QualifyService(rootRound);
        qualifyService.setQualifiers();

        const winnersPoule = winnersRoundOne.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }

        const winnersPlace4 = winnersPoule.getPlace(4);
        expect(winnersPlace4).to.not.equal(undefined);
        if (!winnersPlace4) {
            return;
        }
        const winnersLocation4 = winnersPlace4.getStartLocation();
        if (winnersLocation4) {
            expect(competitorMap.getCompetitor(winnersLocation4)).to.not.equal(undefined);
        }
    });

    /**
    * When second place is multiple and both second places are ranked completely equal
    */
    it('same winnerslosers for second place multiple rule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3], createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new StartLocationMap(createTeamCompetitors(competition, structure.getRootRounds()));
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [3]);
        const losersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [3]);

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
        setAgainstScoreSingle(pouleOne, 3, 1, 0, 1);
        setAgainstScoreSingle(pouleOne, 2, 3, 1, 0);
        setAgainstScoreSingle(pouleTwo, 1, 2, 1, 0);
        setAgainstScoreSingle(pouleTwo, 3, 1, 0, 1);
        setAgainstScoreSingle(pouleTwo, 2, 3, 1, 0);

        const qualifyService = new QualifyService(rootRound);
        qualifyService.setQualifiers();


        const winnersPoule = winnersRound.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }
        const winnersPlace3 = winnersPoule.getPlace(3);
        expect(winnersPlace3).to.not.equal(undefined);
        if (winnersPlace3) {
            const winnersLocation3 = winnersPlace3.getStartLocation();
            if (winnersLocation3) {
                expect(competitorMap.getCompetitor(winnersLocation3)).to.not.equal(undefined);
                expect(competitorMap.getCompetitor(winnersLocation3)?.getName()).to.equal('tc 1.2');
            }
        }

        const losersPoule = losersRound.getPoule(1);
        expect(losersPoule).to.not.equal(undefined);
        if (!losersPoule) {
            return;
        }
        const losersPlace1 = losersPoule.getPlace(1);
        expect(losersPlace1).to.not.equal(undefined);
        if (losersPlace1) {
            const losersLocation1 = losersPlace1.getStartLocation();
            if (losersLocation1) {
                expect(competitorMap.getCompetitor(losersLocation1)).to.not.equal(undefined);
                expect(competitorMap.getCompetitor(losersLocation1)?.getName()).to.equal('tc 2.2');
            }
        }
    });

    /**
    * When second place is multiple and both second places are ranked completely equal
    */
    it('qualify with vertical distribution', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4, 4], createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const competitorMap = new StartLocationMap(createTeamCompetitors(competition, structure.getRootRounds()));
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [4,4,4], QualifyDistribution.Vertical);

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
        // (new StructureOutput()).toConsole(structure, console);
        
        createGames(structure.getFirstRoundNumber());
        setAgainstScoreSingle(pouleOne, 1, 2, 1, 0);
        setAgainstScoreSingle(pouleOne, 3, 4, 1, 0);
        setAgainstScoreSingle(pouleOne, 3, 1, 0, 1);
        setAgainstScoreSingle(pouleOne, 2, 4, 1, 0);
        setAgainstScoreSingle(pouleOne, 2, 3, 1, 0);
        setAgainstScoreSingle(pouleOne, 4, 1, 0, 1);

        setAgainstScoreSingle(pouleTwo, 1, 2, 2, 0);
        setAgainstScoreSingle(pouleTwo, 3, 4, 2, 0);
        setAgainstScoreSingle(pouleTwo, 3, 1, 0, 2);
        setAgainstScoreSingle(pouleTwo, 2, 4, 2, 0);
        setAgainstScoreSingle(pouleTwo, 2, 3, 2, 0);
        setAgainstScoreSingle(pouleTwo, 4, 1, 0, 2);

        setAgainstScoreSingle(pouleThree, 1, 2, 3, 0);
        setAgainstScoreSingle(pouleThree, 3, 4, 3, 0);
        setAgainstScoreSingle(pouleThree, 3, 1, 0, 3);
        setAgainstScoreSingle(pouleThree, 2, 4, 3, 0);
        setAgainstScoreSingle(pouleThree, 2, 3, 3, 0);
        setAgainstScoreSingle(pouleThree, 4, 1, 0, 3);

        const qualifyService = new QualifyService(rootRound);
        qualifyService.setQualifiers();

        // nr 4 van nrs-1-poule is nr 2 van de poule A van de vorige ronde
        const winnersPoule = winnersRound.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }
        const winnersPlace4 = winnersPoule.getPlace(4);
        expect(winnersPlace4).to.not.equal(undefined);
        if (winnersPlace4) {
            const winnersLocation4 = winnersPlace4.getStartLocation();
            if (winnersLocation4) {
                expect(winnersLocation4.getPouleNr()).to.equal(3);
                expect(winnersLocation4.getPlaceNr()).to.equal(2);
            }
        }

        // nr 41van poule-3 is nr 3 van de 3e nr 3
        const winnerPouleThree = winnersRound.getPoule(3);
        expect(winnerPouleThree).to.not.equal(undefined);
        if (!winnerPouleThree) {
            return;
        }
        const winnersPlace1 = winnerPouleThree.getPlace(1);
        expect(winnersPlace1).to.not.equal(undefined);
        if (winnersPlace1) {
            const winnersLocation1 = winnersPlace1.getStartLocation();
            if (winnersLocation1) {
                expect(winnersLocation1.getPouleNr()).to.equal(3);
                expect(winnersLocation1.getPlaceNr()).to.equal(3);
            }
        }
    });

});
