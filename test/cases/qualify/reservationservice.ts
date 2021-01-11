import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper } from '../../helpers/mappers';
import { jsonBaseCompetition } from '../../data/competition';
import { QualifyGroup, Round } from '../../../src/qualify/group';
import { StructureService } from '../../../src/structure/service';
import { setScoreSingle } from '../../helpers/setscores';
import { QualifyService } from '../../../src/qualify/service';
import { RankingService } from '../../../src/ranking/service';
import { Competitor } from '../../../src/competitor';
import { QualifyReservationService } from '../../../src/qualify/reservationservice';
import { createGames } from '../../helpers/gamescreator';
import { createTeamCompetitors } from '../../helpers/teamcompetitorscreator';
import { PlaceLocationMap } from '../../../src/place/location/map';

describe('QualifyReservationService', () => {

    it('free and reserve', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 5);
        const rootRound: Round = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        const pouleOne = rootRound.getPoule(1);
        expect(pouleOne).to.not.equal(undefined);
        if (!pouleOne) {
            return;
        }

        createGames(structure.getFirstRoundNumber());

        setScoreSingle(pouleOne, 1, 2, 2, 1);
        setScoreSingle(pouleOne, 1, 3, 3, 1);
        setScoreSingle(pouleOne, 1, 4, 4, 1);
        setScoreSingle(pouleOne, 1, 5, 5, 1);
        setScoreSingle(pouleOne, 2, 3, 3, 2);
        setScoreSingle(pouleOne, 2, 4, 4, 2);
        setScoreSingle(pouleOne, 2, 5, 5, 2);
        setScoreSingle(pouleOne, 3, 4, 4, 3);
        setScoreSingle(pouleOne, 3, 5, 5, 3);
        setScoreSingle(pouleOne, 4, 5, 5, 4);

        const qualifyService = new QualifyService(rootRound, RankingService.RULESSET_WC);
        qualifyService.setQualifiers();

        const winnersRound = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRound).to.not.equal(undefined);
        if (!winnersRound) {
            return;
        }
        const resService = new QualifyReservationService(winnersRound);

        expect(resService.isFree(1, pouleOne)).to.equal(true);
        resService.reserve(1, pouleOne);
        expect(resService.isFree(1, pouleOne)).to.equal(false);
    });

    // getFreeAndLeastAvailabe(toPouleNumber: number, fromRound: Round, fromPlaceLocations: PlaceLocation[]): PlaceLocation {

    it('getFreeAndLeastAvailabe', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 12, 4);
        const rootRound: Round = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        let winnersRound = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRound).to.not.equal(undefined);
        if (!winnersRound) {
            return;
        }
        structureService.addPoule(winnersRound);

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

        setScoreSingle(pouleOne, 1, 2, 1, 2);
        setScoreSingle(pouleOne, 1, 3, 1, 3);
        setScoreSingle(pouleOne, 2, 3, 2, 3);
        setScoreSingle(pouleTwo, 1, 2, 1, 2);
        setScoreSingle(pouleTwo, 1, 3, 1, 3);
        setScoreSingle(pouleTwo, 2, 3, 2, 4);
        setScoreSingle(pouleThree, 1, 2, 1, 5);
        setScoreSingle(pouleThree, 1, 3, 1, 3);
        setScoreSingle(pouleThree, 2, 3, 2, 5);
        setScoreSingle(pouleFour, 1, 2, 1, 2);
        setScoreSingle(pouleFour, 1, 3, 1, 3);
        setScoreSingle(pouleFour, 2, 3, 2, 3);

        const qualifyService = new QualifyService(rootRound, RankingService.RULESSET_WC);
        qualifyService.setQualifiers();

        winnersRound = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRound).to.not.equal(undefined);
        if (!winnersRound) {
            return;
        }
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


        const fromPlaceLocations = rootRound.getHorizontalPoules(QualifyGroup.WINNERS)[0].getPlaces().map(place => {
            return place;
        });

        // none available
        const placeLocationOne = resService.getFreeAndLeastAvailabe(1, rootRound, fromPlaceLocations);
        expect(placeLocationOne.getPouleNr()).to.equal(pouleOne.getNumber());

        // two available, three least available
        const placeLocationThree = resService.getFreeAndLeastAvailabe(3, rootRound, fromPlaceLocations);
        expect(placeLocationThree.getPouleNr()).to.equal(pouleTwo.getNumber());

    });

    it('2 roundnumbers, nine places, multiple rule, not played', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 9);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const placeLocationMap = new PlaceLocationMap(createTeamCompetitors(competition, firstRoundNumber));
        const rootRound = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        let winnersRound = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRound).to.not.equal(undefined);
        if (!winnersRound) {
            return;
        }
        structureService.removePoule(winnersRound);

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

        setScoreSingle(pouleOne, 1, 2, 1, 2);
        setScoreSingle(pouleOne, 1, 3, 1, 3);
        setScoreSingle(pouleOne, 2, 3, 2, 3);
        setScoreSingle(pouleTwo, 1, 2, 1, 2);
        setScoreSingle(pouleTwo, 1, 3, 1, 3);
        setScoreSingle(pouleTwo, 2, 3, 2, 4);
        setScoreSingle(pouleThree, 1, 2, 1, 5);
        setScoreSingle(pouleThree, 1, 3, 1, 3);
        // setScoreSingle(pouleThree, 2, 3, 2, 5);

        const qualifyService = new QualifyService(rootRound, RankingService.RULESSET_WC);
        qualifyService.setQualifiers();

        winnersRound = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRound).to.not.equal(undefined);
        if (!winnersRound) {
            return;
        }

        winnersRound = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRound).to.not.equal(undefined);
        if (!winnersRound) {
            return;
        }

        const winnersPoule = winnersRound.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }
        const winnersPlace = winnersPoule.getPlace(4);
        expect(winnersPlace).to.not.equal(undefined);
        if (!winnersPlace) {
            return;
        }
        expect(placeLocationMap.getCompetitor(winnersPlace)).to.equal(undefined);
    });
});
