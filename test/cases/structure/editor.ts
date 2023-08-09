import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BalancedPouleStructure, SingleQualifyRule, QualifyTarget, CompetitionSportGetter } from '../../../public-api';
import { getCompetitionMapper, getStructureEditor } from '../../helpers/singletonCreator';
import { jsonBaseCompetition } from '../../data/competition';
import { createPlanningConfigNoTime } from '../../helpers/planningConfigCreator';
import { StructureOutput } from '../../helpers/structureOutput';
import { PlaceRanges } from '../../../src/structure/placeRanges';

describe('StructureEditor', () => {

    it('addChildRound [4,4,4,4]=>[W(2)]', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4, 4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();
        const firstRoundNumber = structure.getFirstRoundNumber();

        expect(rootRound.getNumber()).to.equal(firstRoundNumber);
        expect(structure.getLastRoundNumber()).to.equal(firstRoundNumber);

        structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);

        expect(rootRound.getNumber().getNext()).to.equal(structure.getLastRoundNumber());

        expect(structure.getRoundNumbers().length).to.equal(2);

        expect(structure.getRoundNumber(1)).to.equal(firstRoundNumber);
        expect(structure.getRoundNumber(2)).to.equal(firstRoundNumber.getNext());
        expect(structure.getRoundNumber(3)).to.equal(undefined);
        expect(structure.getRoundNumber(0)).to.equal(undefined);

        // (new StructureOutput()).toConsole(structure, console);
    });

    it('addPlaceToRootRound when losersChildRound is present', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4, 4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();
        const firstRoundNumber = structure.getFirstRoundNumber();

        expect(rootRound.getNumber()).to.equal(firstRoundNumber);
        expect(structure.getLastRoundNumber()).to.equal(firstRoundNumber);

        const childRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2, 2]);

        structureEditor.addPlaceToRootRound(rootRound);

        //(new StructureOutput()).toConsole(structure, console);

        const qualifyGroup = childRound.getParentQualifyGroup();
        if (qualifyGroup === undefined) {
            expect(qualifyGroup).to.not.equal(undefined);
            return;
        }
        const fromPlace = qualifyGroup.getFromPlace(childRound.getPoule(1).getPlace(1));

        expect(fromPlace?.getPouleNr()).to.equal(3);
        expect(fromPlace?.getPlaceNr()).to.equal(4);

        expect(rootRound.getNrOfPlaces()).to.equal(17);
    });

    it('removePlaceFromRootRound when losersChildRound is present with enough places', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4, 4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();
        const firstRoundNumber = structure.getFirstRoundNumber();

        expect(rootRound.getNumber()).to.equal(firstRoundNumber);
        expect(structure.getLastRoundNumber()).to.equal(firstRoundNumber);

        const childRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2, 2]);

        // (new StructureOutput()).toConsole(structure, console);

        structureEditor.removePlaceFromRootRound(rootRound);

        // (new StructureOutput()).toConsole(structure, console);

        const qualifyGroup = childRound.getParentQualifyGroup();
        if (qualifyGroup === undefined) {
            expect(qualifyGroup).to.not.equal(undefined);
            return;
        }
        const fromPlace = qualifyGroup.getFromPlace(childRound.getPoule(1).getPlace(1));

        expect(fromPlace?.getPouleNr()).to.equal(1);
        expect(fromPlace?.getPlaceNr()).to.equal(4);

        expect(rootRound.getNrOfPlaces()).to.equal(15);
    });

    it('removePlaceFromRootRound when all places are qualified', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();
        const firstRoundNumber = structure.getFirstRoundNumber();

        expect(rootRound.getNumber()).to.equal(firstRoundNumber);
        expect(structure.getLastRoundNumber()).to.equal(firstRoundNumber);

        const winnersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [4]);
        const losersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [4]);

        // (new StructureOutput()).toConsole(structure, console);

        expect(function () {
            structureEditor.removePlaceFromRootRound(rootRound);
        }).to.throw();
    });

    it('addPouleToRootRound 3,2', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 2], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();
        const firstRoundNumber = structure.getFirstRoundNumber();

        structureEditor.addPouleToRootRound(rootRound);
        //(new StructureOutput()).toConsole(structure, console);

        expect(rootRound.getLastPoule().getNumber()).to.equal(3);
        expect(rootRound.getLastPoule().getPlaces().length).to.equal(2);
        expect(rootRound.getNrOfPlaces()).to.equal(7);
    });

    it('addPouleToRootRound 4,3 with childplaces', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 3], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [3]);
        const losersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [3]);

        structureEditor.addPouleToRootRound(rootRound);
        //(new StructureOutput()).toConsole(structure, console);

        const qualifyGroup = losersChildRound.getParentQualifyGroup();
        if (qualifyGroup === undefined) {
            expect(qualifyGroup).to.not.equal(undefined);
            return;
        }
        const fromPlace = qualifyGroup.getFromPlace(losersChildRound.getPoule(1).getPlace(1));
        expect(fromPlace?.getPouleNr()).to.equal(2);
        expect(fromPlace?.getPlaceNr()).to.equal(3);
    });

    it('addPouleToRootRoundWithSecondsRoundNoCrossFinals', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const firstPlacesRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const secondPlacesRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);

        // (new StructureOutput()).toConsole(structure, console);
        // console.log('');

        structureEditor.addPouleToRootRound(rootRound);

        // (new StructureOutput()).toConsole(structure, console);

        const firstPlaces = firstPlacesRound.getPoule(1).getPlaces();
        expect(firstPlaces.length).to.equal(3);

        const secondPlaces = secondPlacesRound.getPoule(1).getPlaces();
        expect(secondPlaces.length).to.equal(3);
    });

    it('addPouleToRootRoundWithSecondsRoundNoCrossFinalsWithLosers', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const lastPlacesRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);
        const secondLastPlacesRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);

        // (new StructureOutput()).toConsole(structure, console);
        //console.log('');

        structureEditor.addPouleToRootRound(rootRound);

        //(new StructureOutput()).toConsole(structure, console);

        const lastPlaces = lastPlacesRound.getPoule(1).getPlaces();
        expect(lastPlaces.length).to.equal(3);

        const secondLastPlaces = secondLastPlacesRound.getPoule(1).getPlaces();
        expect(secondLastPlaces.length).to.equal(3);
    });

    it('incrementNrOfPoulesWithThirdRoundsNoCrossFinals', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [5, 5], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [4, 3]);

        structureEditor.addChildRound(winnersRound, QualifyTarget.Winners, [2]);
        structureEditor.addChildRound(winnersRound, QualifyTarget.Winners, [2]);
        structureEditor.addChildRound(winnersRound, QualifyTarget.Winners, [2]);

        // (new StructureOutput()).toConsole(structure, console);
        // console.log('');

        structureEditor.incrementNrOfPoules(winnersRound);

        // (new StructureOutput()).toConsole(structure, console);

        const firstQualifyGroup = winnersRound.getQualifyGroups()[0];
        expect(firstQualifyGroup).to.not.be.undefined;
        expect(firstQualifyGroup.getNrOfToPlaces()).to.equal(3);

        const lastQualifyGroup = winnersRound.getQualifyGroups()[winnersRound.getQualifyGroups().length - 1];
        expect(lastQualifyGroup).to.not.be.undefined;
        expect(lastQualifyGroup.getNrOfToPlaces()).to.equal(3);
    });

    it('addQualifierWithThirdRoundsNoCrossFinals', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [6, 6, 6, 6], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [4, 4, 3, 3]);

        structureEditor.addChildRound(winnersRound, QualifyTarget.Winners, [4]);
        structureEditor.addChildRound(winnersRound, QualifyTarget.Winners, [4]);

        // (new StructureOutput()).toConsole(structure, console);
        // console.log('');

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 1, 3);

        // (new StructureOutput()).toConsole(structure, console);

        const firstQualifyGroup = winnersRound.getQualifyGroups()[0];
        expect(firstQualifyGroup).to.not.be.undefined;
        expect(firstQualifyGroup.getNrOfToPlaces()).to.equal(5);

        const lastQualifyGroup = winnersRound.getQualifyGroups()[winnersRound.getQualifyGroups().length - 1];
        expect(lastQualifyGroup).to.not.be.undefined;
        expect(lastQualifyGroup.getNrOfToPlaces()).to.equal(5);
    });


    it('removePouleFromRootRound 4', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        expect(function () {
            structureEditor.removePouleFromRootRound(rootRound);
        }).to.throw();
    });

    it('removePouleFromRootRound with too much places to next round', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 3, 3], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [5, 5]);
        expect(function () {
            structureEditor.removePouleFromRootRound(rootRound);
        }).to.throw();
    });

    it('removePouleFromRootRound with childRounds', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 3], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [3]);
        structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [3]);

        structureEditor.removePouleFromRootRound(rootRound);
        // (new StructureOutput()).toConsole(structure, console);

        expect(rootRound.getChildren().length).to.equal(2);
    });

    it('remove poule from rootRound with second-round-no-cross-finals', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 3, 3, 3, 3], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const firstPlacesRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [3, 3]);
        const secondPlacesRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [3, 3]);

        structureEditor.addChildRound(firstPlacesRound, QualifyTarget.Winners, [2]);
        structureEditor.addChildRound(firstPlacesRound, QualifyTarget.Winners, [2]);

        // (new StructureOutput()).toConsole(structure, console);
        structureEditor.removePouleFromRootRound(rootRound);
        // (new StructureOutput()).toConsole(structure, console);

        expect(firstPlacesRound.getQualifyGroups(QualifyTarget.Winners).length).to.equal(2);
        expect(firstPlacesRound.getPoule(1).getPlaces().length).to.equal(3);
        expect(firstPlacesRound.getPoule(2).getPlaces().length).to.equal(2);

        expect(secondPlacesRound.getPoule(1).getPlaces().length).to.equal(3);
        expect(secondPlacesRound.getPoule(2).getPlaces().length).to.equal(2);
    });

    it('remove poule from rootRound than remove last roundnumber', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const firstPlacesRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [3]);
        const secondPlacesRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [3]);

        structureEditor.addChildRound(firstPlacesRound, QualifyTarget.Winners, [2]);
        structureEditor.addChildRound(secondPlacesRound, QualifyTarget.Winners, [2]);

        // (new StructureOutput()).toConsole(structure, console);
        structureEditor.removePouleFromRootRound(rootRound);
        // (new StructureOutput()).toConsole(structure, console);

        expect(firstPlacesRound.getChildren().length).to.equal(0);
        expect(secondPlacesRound.getChildren().length).to.equal(0);
    });

    it('incrementNrOfPoules too little placesperpoule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const minNrOfPlacesPerPoule = (new CompetitionSportGetter()).getMinNrOfPlacesPerPoule(competition.getSportVariants());
        const maxNrOfPlacesPerPoule = 2;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 100;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, undefined,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, undefined
        );

        const structureEditor = getStructureEditor(placeRanges);
        const structure = structureEditor.create(competition, [3, 2], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        expect(function () {
            structureEditor.incrementNrOfPoules(rootRound);
        }).to.throw();
    });

    it('incrementNrOfPoules middleRound', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [5, 5], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersChildRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [3, 3]);

        structureEditor.addChildRound(winnersChildRound, QualifyTarget.Winners, [4]);

        // (new StructureOutput()).toConsole(structure, console);
        structureEditor.incrementNrOfPoules(winnersChildRound);
        // (new StructureOutput()).toConsole(structure, console);

        expect(winnersChildRound.getNrOfPlaces()).to.equal(6);
    });

    it('decrementNrOfPoules too little poules', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        expect(function () {
            structureEditor.decrementNrOfPoules(rootRound);
        }).to.throw();
    });

    it('decrementNrOfPoules', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 2], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        structureEditor.decrementNrOfPoules(rootRound);
        // (new StructureOutput()).toConsole(structure, console);

        expect(rootRound.getPoules().length).to.equal(2);
        expect(rootRound.getFirstPoule().getPlaces().length).to.equal(4);
        expect(rootRound.getLastPoule().getPlaces().length).to.equal(4);
    });

    it('addQualifiers new Round too little qualifiers', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        // (new StructureOutput()).toConsole(structure, console);
        expect(function () {
            structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 1);
        }).to.throw();
        // (new StructureOutput()).toConsole(structure, console);
    });

    it('addQualifiers out of range', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const minNrOfPlacesPerPoule = (new CompetitionSportGetter()).getMinNrOfPlacesPerPoule(competition.getSportVariants());
        const maxNrOfPlacesPerPoule = 4;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 6;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, undefined,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, undefined
        );
        // const placeRanges = new PlaceRanges(competition.getSportVariants(), 2, 6, 4);

        const structureEditor = getStructureEditor(placeRanges);
        const structure = structureEditor.create(competition, [3, 3], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [4]);
        // (new StructureOutput()).toConsole(structure, console);
        expect(function () {
            structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 1);
        }).to.throw();
        // (new StructureOutput()).toConsole(structure, console);
    });

    it('addQualifiers new Round', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        structureEditor.addQualifiers(rootRound, QualifyTarget.Winners, 2);
        // (new StructureOutput()).toConsole(structure, console);

        const winnersChildRound = rootRound.getChild(QualifyTarget.Winners, 1);
        expect(winnersChildRound).to.not.be.undefined;
        expect(winnersChildRound?.getNrOfPlaces()).to.equal(2);
    });

    it('removeQualifiers 3 levels deep', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4, 4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const quarterFinals = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2, 2, 2, 2]);
        const semiFinals = structureEditor.addChildRound(quarterFinals, QualifyTarget.Winners, [2, 2]);
        const final = structureEditor.addChildRound(semiFinals, QualifyTarget.Winners, [2]);

        // (new StructureOutput()).toConsole(structure, console);
        structureEditor.removeQualifier(rootRound, QualifyTarget.Winners);
        // (new StructureOutput()).toConsole(structure, console);
        structureEditor.removeQualifier(rootRound, QualifyTarget.Winners);
        // (new StructureOutput()).toConsole(structure, console);
        structureEditor.removeQualifier(rootRound, QualifyTarget.Winners);
        // (new StructureOutput()).toConsole(structure, console);
        structureEditor.removeQualifier(rootRound, QualifyTarget.Winners);
        //(new StructureOutput()).toConsole(structure, console);
        structureEditor.removeQualifier(rootRound, QualifyTarget.Winners);
        // (new StructureOutput()).toConsole(structure, console);

        const newSemiFinals = rootRound.getChild(QualifyTarget.Winners, 1);
        expect(newSemiFinals).to.not.equal(undefined);
        if (newSemiFinals === undefined) {
            return;
        }
        const newFinal = newSemiFinals.getChild(QualifyTarget.Winners, 1);
        expect(newFinal).to.not.equal(undefined);
        if (newFinal === undefined) {
            return;
        }

        expect(newSemiFinals.getNrOfPlaces()).to.equal(3);
        expect(newFinal.getNrOfPlaces()).to.equal(2);
    });

    it('removeQualifiers empty NextRoundNumber', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4, 4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();
        const firstRoundNumber = structure.getFirstRoundNumber();

        expect(rootRound.getNumber()).to.equal(firstRoundNumber);
        expect(structure.getLastRoundNumber()).to.equal(firstRoundNumber);

        // (new StructureOutput()).toConsole(structure, console);
        structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        // (new StructureOutput()).toConsole(structure, console);
        structureEditor.removeQualifier(rootRound, QualifyTarget.Winners);
        // (new StructureOutput()).toConsole(structure, console);

        expect(rootRound.getQualifyGroups(QualifyTarget.Winners).length).to.equal(0);
        expect(structure.getRoundNumbers().length).to.equal(1);

        expect(structure.getRoundNumber(2)).to.equal(undefined);
        expect(structure.getFirstRoundNumber().getNext()).to.equal(undefined);
    });

    it('splitQualifyGroupFrom too few places per poule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [6], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const firstSix = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [3]);

        const qualifyGroup = firstSix.getParentQualifyGroup();
        expect(qualifyGroup).to.not.equal(undefined);
        if (qualifyGroup === undefined) {
            return;
        }
        const firstSingleQualifyRule = qualifyGroup.getFirstSingleRule();
        expect(firstSingleQualifyRule).to.not.equal(undefined);
        if (firstSingleQualifyRule === undefined) {
            return;
        }
        // (new StructureOutput()).toConsole(structure, console);
        expect(function () {
            structureEditor.splitQualifyGroupFrom(qualifyGroup, firstSingleQualifyRule);
        }).to.throw();
    });

    it('splitQualifyGroupFrom keep nrOfPoulePlaces', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 3, 3, 3, 3], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const firstSix = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [6, 6]);

        const qualifyGroup = firstSix.getParentQualifyGroup();
        expect(qualifyGroup).to.not.equal(undefined);
        if (qualifyGroup === undefined) {
            return;
        }
        const firstSingleQualifyRule = qualifyGroup.getFirstSingleRule();
        expect(firstSingleQualifyRule).to.not.equal(undefined);
        if (firstSingleQualifyRule === undefined) {
            return;
        }
        // (new StructureOutput()).toConsole(structure, console);
        structureEditor.splitQualifyGroupFrom(qualifyGroup, firstSingleQualifyRule);
        // (new StructureOutput()).toConsole(structure, console);
    });

    it('isQualifyGroupSplittableAt no', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [8], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const nextRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [3]);
        const qualifyGroup = nextRound.getParentQualifyGroup();
        expect(qualifyGroup).to.not.equal(undefined);
        if (qualifyGroup === undefined) {
            return;
        }
        let singleRule: SingleQualifyRule | undefined = qualifyGroup.getFirstSingleRule();
        while (singleRule !== undefined) {
            expect(structureEditor.isQualifyGroupSplittableAt(singleRule)).to.equal(false);
            singleRule = singleRule.getNext();
        }
    });

    it('isQualifyGroupSplittableAt no multiple', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [3]);
        const losersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [3]);
        // (new StructureOutput()).toConsole(structure, console);

        const winnersQualifyGroup = winnersRound.getParentQualifyGroup();
        const losersQualifyGroup = losersRound.getParentQualifyGroup();
        expect(winnersQualifyGroup).to.not.equal(undefined);
        expect(losersQualifyGroup).to.not.equal(undefined);
        if (winnersQualifyGroup === undefined || losersQualifyGroup === undefined) {
            return;
        }

        let firstWinnersSingleRule: SingleQualifyRule | undefined = winnersQualifyGroup.getFirstSingleRule();
        if (firstWinnersSingleRule !== undefined) {
            expect(structureEditor.isQualifyGroupSplittableAt(firstWinnersSingleRule)).to.equal(false);
        }
        let firstLosersSingleRule: SingleQualifyRule | undefined = losersQualifyGroup.getFirstSingleRule();
        if (firstLosersSingleRule !== undefined) {
            expect(structureEditor.isQualifyGroupSplittableAt(firstLosersSingleRule)).to.equal(false);
        }
    });

    it('isQualifyGroupSplittableAt yes', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const nextRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [4]);
        // (new StructureOutput()).toConsole(structure, console);

        const qualifyGroup = nextRound.getParentQualifyGroup();
        expect(qualifyGroup).to.not.equal(undefined);
        if (qualifyGroup === undefined) {
            return;
        }

        let singleRule: SingleQualifyRule | undefined = qualifyGroup.getFirstSingleRule();
        expect(singleRule).to.not.equal(undefined);
        if (singleRule === undefined) {
            return;
        }
        expect(structureEditor.isQualifyGroupSplittableAt(singleRule)).to.equal(true);
    });

    it('areQualifyGroupsMergable', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const firstSecond = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const thirdFourth = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const fifthSixth = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const losersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);

        const firstSecondQualifyGroup = firstSecond.getParentQualifyGroup();
        const thirdFourthQualifyGroup = thirdFourth.getParentQualifyGroup();
        const fifthSixthQualifyGroup = fifthSixth.getParentQualifyGroup();
        const losersQualifyGroup = losersRound.getParentQualifyGroup();
        expect(firstSecondQualifyGroup).to.not.equal(undefined);
        expect(thirdFourthQualifyGroup).to.not.equal(undefined);
        expect(fifthSixthQualifyGroup).to.not.equal(undefined);
        expect(losersQualifyGroup).to.not.equal(undefined);
        if (firstSecondQualifyGroup === undefined
            || thirdFourthQualifyGroup === undefined
            || fifthSixthQualifyGroup === undefined
            || losersQualifyGroup === undefined) {
            return;
        }
        expect(structureEditor.areQualifyGroupsMergable(firstSecondQualifyGroup, thirdFourthQualifyGroup)).to.equal(true);
        expect(structureEditor.areQualifyGroupsMergable(thirdFourthQualifyGroup, fifthSixthQualifyGroup)).to.equal(true);
        expect(structureEditor.areQualifyGroupsMergable(firstSecondQualifyGroup, fifthSixthQualifyGroup)).to.equal(false);
        expect(structureEditor.areQualifyGroupsMergable(losersQualifyGroup, thirdFourthQualifyGroup)).to.equal(false);
    });

    it('mergeQualifyGroups W1/2 W3/4', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [5, 5], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const firstSecond = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const thirdFourth = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const fifthSixth = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const worstLlosersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);
        const losersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);

        const firstSecondQualifyGroup = firstSecond.getParentQualifyGroup();
        const thirdFourthQualifyGroup = thirdFourth.getParentQualifyGroup();
        expect(firstSecondQualifyGroup).to.not.equal(undefined);
        expect(thirdFourthQualifyGroup).to.not.equal(undefined);
        if (firstSecondQualifyGroup === undefined || thirdFourthQualifyGroup === undefined) {
            return;
        }
        structureEditor.mergeQualifyGroups(firstSecondQualifyGroup, thirdFourthQualifyGroup);
        expect(firstSecond.getNrOfPlaces()).to.equal(4);
    });

    it('mergeQualifyGroups W3/4 W5/6', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [5, 5], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const firstSecond = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const thirdFourth = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const fifthSixth = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const worstLlosersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);
        const losersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);

        const thirdFourthQualifyGroup = thirdFourth.getParentQualifyGroup();
        const fifthSixthQualifyGroup = fifthSixth.getParentQualifyGroup();
        expect(thirdFourthQualifyGroup).to.not.equal(undefined);
        expect(fifthSixthQualifyGroup).to.not.equal(undefined);
        if (thirdFourthQualifyGroup === undefined || fifthSixthQualifyGroup === undefined) {
            return;
        }
        structureEditor.mergeQualifyGroups(thirdFourthQualifyGroup, fifthSixthQualifyGroup);
        // (new StructureOutput()).toConsole(structure, console);
        expect(thirdFourth.getNrOfPlaces()).to.equal(4);
    });

    it('mergeQualifyGroups L1/2 L3/4', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [5, 5], createPlanningConfigNoTime());
        const rootRound = structure.getSingleCategory().getRootRound();

        const firstSecond = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const thirdFourth = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const fifthSixth = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        const worstLosersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);
        const losersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);

        const worstLosersQualifyGroup = worstLosersRound.getParentQualifyGroup();
        const losersQualifyGroup = losersRound.getParentQualifyGroup();

        expect(worstLosersQualifyGroup).to.not.equal(undefined);
        expect(losersQualifyGroup).to.not.equal(undefined);
        if (worstLosersQualifyGroup === undefined || losersQualifyGroup === undefined) {
            return;
        }
        structureEditor.mergeQualifyGroups(worstLosersQualifyGroup, losersQualifyGroup);
        expect(worstLosersRound.getNrOfPlaces()).to.equal(4);
    });


    // it('allPoulesHaveGames', () => {
    //     const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

    //     const structureEditor = getStructureEditor();
    //     const structure = structureEditor.create(competition, [4, 4, 4, 4], createPlanningConfigNoTime());
    //     expect(structure.allPoulesHaveGames()).to.equal(false);
    //     const rootRound = structure.getSingleCategory().getRootRound();
    //     structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
    //     structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);
    //     expect(structure.allPoulesHaveGames()).to.equal(false);
    //     // structure.getFirstRoundNumber().setHasPlanning(true);
    //     // expect(structure.hasPlanning()).to.equal(false);
    // });

    it('addCategory', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [4, 4], createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const category1 = structure.getSingleCategory();
        expect(firstRoundNumber.getGameAmountConfigs().length).to.equal(1);

        const category2 = structureEditor.addCategory('j78', 2, firstRoundNumber, new BalancedPouleStructure(...[5]));
        structure.getCategories().push(category2);

        expect(firstRoundNumber.getGameAmountConfigs().length).to.equal(1);
        expect(category2.getRootRound().getAgainstQualifyConfigs().length).to.equal(1);
        expect(category2.getRootRound().getScoreConfigs().length).to.equal(1);

        structureEditor.addChildRound(category1.getRootRound(), QualifyTarget.Winners, [2]);
        structureEditor.addChildRound(category1.getRootRound(), QualifyTarget.Winners, [2]);

        const lastPlaceRound = structureEditor.addChildRound(category2.getRootRound(), QualifyTarget.Losers, [3]);
        structureEditor.addChildRound(category2.getRootRound(), QualifyTarget.Losers, [2]);

        const lastPlaceChildRound = structureEditor.addChildRound(lastPlaceRound, QualifyTarget.Losers, [2]);
        // (new StructureOutput()).toConsole(structure, console);

        expect(lastPlaceChildRound.getPoule(1).getStructureLocation()).to.equal('2.1L1L1.1');
    });

});
