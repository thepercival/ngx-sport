import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PlaceRanges } from '../../../src/structure/placeRanges';
import { SingleSportVariant } from '../../../src/sport/variant/single';
import { Sport } from '../../../src/sport';
import { GameMode } from '../../../src/planning/gameMode';
import { BalancedPouleStructure } from '../../../src/poule/structure/balanced';
import { AgainstSportVariant } from '../../../public_api';
import { AllInOneGameSportVariant } from '../../../src/sport/variant/all';
import { getCompetitionSportService } from '../../helpers/singletonCreator';

describe('PlaceRanges', () => {

    it('singleSport - nrOfGamePlaces - valid', () => {
        const dummySport = new Sport('dummy', false, GameMode.Against, 1);
        const nrOfGamePlaces = 3;
        const singleSportVariant = new SingleSportVariant(dummySport, nrOfGamePlaces, 3);

        const minNrOfPlacesPerPoule = getCompetitionSportService().getMinNrOfPlacesPerPoule([singleSportVariant]);
        const maxNrOfPlacesPerPoule = 2;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 3;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, undefined,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, undefined
        );
        expect(function () {
            const structure = new BalancedPouleStructure(3);
            placeRanges.validate(structure.getNrOfPlaces(), structure.getNrOfPoules());
        }).to.not.throw();
    });

    it('singleSport - nrOfGamePlaces - invalid', () => {
        const dummySport = new Sport('dummy', false, GameMode.Against, 1);
        const nrOfGamePlaces = 3;
        const singleSportVariant = new SingleSportVariant(dummySport, nrOfGamePlaces, 1);

        const minNrOfPlacesPerPoule = getCompetitionSportService().getMinNrOfPlacesPerPoule([singleSportVariant]);
        const maxNrOfPlacesPerPoule = 2;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 2;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, undefined,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, undefined
        );

        expect(function () {
            const structure = new BalancedPouleStructure(2);
            placeRanges.validate(structure.getNrOfPlaces(), structure.getNrOfPoules());
        }).to.throw();
    });

    it('againstSport - nrOfGamePlaces - valid', () => {
        const dummySport = new Sport('dummy', false, GameMode.Against, 1);
        const nrOfSidePlaces = 1;
        const againstSportVariant = new AgainstSportVariant(dummySport, nrOfSidePlaces, nrOfSidePlaces, 1, 0);

        const minNrOfPlacesPerPoule = getCompetitionSportService().getMinNrOfPlacesPerPoule([againstSportVariant]);
        const maxNrOfPlacesPerPoule = 2;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 4;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, undefined,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, undefined
        );

        expect(function () {
            const structure = new BalancedPouleStructure(2, 2);
            placeRanges.validate(structure.getNrOfPlaces(), structure.getNrOfPoules());
        }).to.not.throw();
    });

    it('againstSport - nrOfGamePlaces - invalid', () => {
        const dummySport = new Sport('dummy', false, GameMode.Against, 1);
        const nrOfSidePlaces = 2;
        const againstSportVariant = new AgainstSportVariant(dummySport, nrOfSidePlaces, nrOfSidePlaces, 0, 1);

        const minNrOfPlacesPerPoule = getCompetitionSportService().getMinNrOfPlacesPerPoule([againstSportVariant]);
        const maxNrOfPlacesPerPoule = 3;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 10;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, undefined,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, undefined
        );
        expect(function () {
            const structure = new BalancedPouleStructure(3);
            placeRanges.validate(structure.getNrOfPlaces(), structure.getNrOfPoules());
        }).to.throw();
    });

    it('againstSport - nrOfGamePlaces - valid 2', () => {
        const dummySport = new Sport('dummy', false, GameMode.Against, 1);
        const nrOfSidePlaces = 2;
        const againstSportVariant = new AgainstSportVariant(dummySport, nrOfSidePlaces, nrOfSidePlaces, 0, 1);

        const minNrOfPlacesPerPoule = getCompetitionSportService().getMinNrOfPlacesPerPoule([againstSportVariant]);
        const maxNrOfPlacesPerPoule = 4;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 10;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, undefined,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, undefined
        );
        expect(function () {
            const structure = new BalancedPouleStructure(4);
            placeRanges.validate(structure.getNrOfPlaces(), structure.getNrOfPoules());
        }).to.not.throw();
    });

    it('allInOneGameSport - nrOfGamePlaces - valid', () => {
        const dummySport = new Sport('dummy', false, GameMode.Against, 1);
        const allInOneGameSportVariant = new AllInOneGameSportVariant(dummySport, 1);

        const minNrOfPlacesPerPoule = getCompetitionSportService().getMinNrOfPlacesPerPoule([allInOneGameSportVariant]);
        const maxNrOfPlacesPerPoule = 2;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 10;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, undefined,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, undefined
        );
        expect(function () {
            const structure = new BalancedPouleStructure(2);
            placeRanges.validate(structure.getNrOfPlaces(), structure.getNrOfPoules());
        }).to.not.throw();
    });

    it('MinNrOfPlacesPerPoule invalid', () => {
        const dummySport = new Sport('dummy', false, GameMode.Against, 1);
        const allInOneGameSportVariant = new AllInOneGameSportVariant(dummySport, 1);

        const minNrOfPlacesPerPoule = getCompetitionSportService().getMinNrOfPlacesPerPoule([allInOneGameSportVariant]);
        const maxNrOfPlacesPerPoule = 1;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 10;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, undefined,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, undefined
        );
        expect(function () {
            const structure = new BalancedPouleStructure(1);
            placeRanges.validate(structure.getNrOfPlaces(), structure.getNrOfPoules());
        }).to.throw();
    });

    it('Large per poule/round valid', () => {
        const dummySport = new Sport('dummy', false, GameMode.Against, 1);
        const allInOneGameSportVariant = new AllInOneGameSportVariant(dummySport, 1);

        const minNrOfPlacesPerPoule = getCompetitionSportService().getMinNrOfPlacesPerPoule([allInOneGameSportVariant]);
        const maxNrOfPlacesPerPoule = 5;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 10;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, 5,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, 20
        );

        expect(function () {
            const structure = new BalancedPouleStructure(5, 5, 5);
            placeRanges.validate(structure.getNrOfPlaces(), structure.getNrOfPoules());
        }).to.not.throw();
    });

    it('Large per poule invalid', () => {
        const dummySport = new Sport('dummy', false, GameMode.Against, 1);
        const allInOneGameSportVariant = new AllInOneGameSportVariant(dummySport, 1);

        const minNrOfPlacesPerPoule = getCompetitionSportService().getMinNrOfPlacesPerPoule([allInOneGameSportVariant]);
        const maxNrOfPlacesPerPoule = 5;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 10;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, 5,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, 20
        );

        expect(function () {
            const structure = new BalancedPouleStructure(6, 6, 6);
            placeRanges.validate(structure.getNrOfPlaces(), structure.getNrOfPoules());
        }).to.throw();
    });

    it('Large per round invalid', () => {
        const dummySport = new Sport('dummy', false, GameMode.Against, 1);
        const allInOneGameSportVariant = new AllInOneGameSportVariant(dummySport, 1);

        const minNrOfPlacesPerPoule = getCompetitionSportService().getMinNrOfPlacesPerPoule([allInOneGameSportVariant]);
        const maxNrOfPlacesPerPoule = 5;
        const minNrOfPlacesPerRound = minNrOfPlacesPerPoule;
        const maxNrOfPlacesPerRound = 10;
        const placeRanges = new PlaceRanges(
            minNrOfPlacesPerPoule, maxNrOfPlacesPerPoule, 5,
            minNrOfPlacesPerRound, maxNrOfPlacesPerRound, 20
        );

        expect(function () {
            const structure = new BalancedPouleStructure(5, 5, 5, 5, 5);
            placeRanges.validate(structure.getNrOfPlaces(), structure.getNrOfPoules());
        }).to.throw();
    });
});
