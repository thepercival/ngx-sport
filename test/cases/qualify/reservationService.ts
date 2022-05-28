import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper, getStructureEditor } from '../../helpers/singletonCreator';
import { jsonBaseCompetition } from '../../data/competition';
import { setAgainstScoreSingle } from '../../helpers/setscores';
import { createGames } from '../../helpers/gamescreator';
import { createTeamCompetitors } from '../../helpers/teamcompetitorscreator';
import { QualifyReservationService, QualifyService, QualifyTarget, Round, StartLocationMap } from '../../../public-api';
import { createPlanningConfigNoTime } from '../../helpers/planningConfigCreator';
import { StructureOutput } from '../../helpers/structureOutput';

describe('QualifyReservationService', () => {

    it('free and reserve', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [5], createPlanningConfigNoTime());
        const rootRound: Round = structure.getSingleCategory().getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2]);
        structureEditor.addChildRound(rootRound, QualifyTarget.Losers, [2]);

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

        const resService = new QualifyReservationService(winnersRound);

        expect(resService.isFree(1, pouleOne)).to.equal(true);
        resService.reserve(1, pouleOne);
        expect(resService.isFree(1, pouleOne)).to.equal(false);
    });

    // getFreeAndLeastAvailabe(toPouleNumber: number, fromRound: Round, fromPlaceLocations: PlaceLocation[]): PlaceLocation {

    it('getFreeAndLeastAvailabe [3,3,3,3] => W[2,2,2]', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 3, 3], createPlanningConfigNoTime());
        const rootRound: Round = structure.getSingleCategory().getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [2, 2, 2]);
        // (new StructureOutput()).toConsole(structure, console);

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
        const pouleFour = rootRound.getPoule(4);
        expect(pouleFour).to.not.equal(undefined);
        if (!pouleFour) {
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
        setAgainstScoreSingle(pouleFour, 1, 2, 1, 2);
        setAgainstScoreSingle(pouleFour, 1, 3, 1, 3);
        setAgainstScoreSingle(pouleFour, 2, 3, 2, 3);
        // A 3, 2, 1, B 3, 2, 1, C 3, 2, 1, D 3, 2, 1
        // SECOND PLACE C2, A2/D2, B2

        const qualifyService = new QualifyService(rootRound);
        qualifyService.setQualifiers();

        const resService = new QualifyReservationService(winnersRound);

        resService.reserve(1, pouleOne);
        resService.reserve(2, pouleOne);
        resService.reserve(3, pouleOne);

        resService.reserve(1, pouleTwo);
        resService.reserve(2, pouleTwo);

        resService.reserve(1, pouleThree);
        resService.reserve(1, pouleThree);

        resService.reserve(1, pouleFour);
        resService.reserve(3, pouleFour);

        const firstWinnersHorPoule = rootRound.getHorizontalPoule(QualifyTarget.Winners, 1);
        expect(firstWinnersHorPoule).to.not.equal(undefined);
        if (firstWinnersHorPoule === undefined) {
            return;
        }
        const fromPlaceLocations = firstWinnersHorPoule.getPlaces().map(place => {
            return place;
        });
        // (new StructureOutput()).toConsole(structure, console);
        // none available
        const placeLocationOne = resService.getFreeAndLeastAvailabe(1, rootRound, fromPlaceLocations);
        expect(placeLocationOne.getPouleNr()).to.equal(pouleOne.getNumber());

        // two available, three least available
        const placeLocationThree = resService.getFreeAndLeastAvailabe(3, rootRound, fromPlaceLocations);
        expect(placeLocationThree.getPouleNr()).to.equal(pouleTwo.getNumber());

    });

    it('2 roundnumbers, [3,3,3] => W[4], not finished', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureEditor = getStructureEditor();
        const structure = structureEditor.create(competition, [3, 3, 3], createPlanningConfigNoTime());
        const firstRoundNumber = structure.getFirstRoundNumber();
        const startLocationMap = new StartLocationMap(createTeamCompetitors(competition, firstRoundNumber));
        const rootRound = structure.getSingleCategory().getRootRound();

        const winnersRound = structureEditor.addChildRound(rootRound, QualifyTarget.Winners, [4]);

        const pouleOne = rootRound.getPoule(1);
        const pouleTwo = rootRound.getPoule(2);
        const pouleThree = rootRound.getPoule(3);

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
        const winnersPlace = winnersRound.getPoule(1).getPlace(4);
        // (new StructureOutput()).toConsole(structure, console);
        expect(winnersPlace.getQualifiedPlace()).to.equal(undefined);
    });
});
