import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
    NameService,
    PlaceLocationMap,
    QualifyGroup,
    QualifyService,
    RankingService,
    Round,
    StructureService,
} from '../../../public_api';
import { getCompetitionMapper } from '../../helpers/mappers';
import { jsonBaseCompetition } from '../../data/competition';
import { setScoreSingle } from '../../helpers/setscores';
import { createGames } from '../../helpers/gamescreator';
import { createTeamCompetitors } from '../../helpers/teamcompetitorscreator';

describe('QualifyService', () => {

    it('2 roundnumbers, five places', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 5);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const placeLocationMap = new PlaceLocationMap(createTeamCompetitors(competition, firstRoundNumber));
        const rootRound = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        const pouleOne = rootRound.getPoule(1);

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

        const winnersPoule = rootRound.getChild(QualifyGroup.WINNERS, 1).getPoule(1);

        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(1).getStartLocation())).to.not.equal(undefined);
        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(1).getStartLocation()).getName()).to.equal('tc 1.1');
        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(2).getStartLocation())).to.not.equal(undefined);
        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(2).getStartLocation()).getName()).to.equal('tc 1.2');


        const loserssPoule = rootRound.getChild(QualifyGroup.LOSERS, 1).getPoule(1);

        expect(placeLocationMap.getCompetitor(loserssPoule.getPlace(1).getStartLocation())).to.not.equal(undefined);
        expect(placeLocationMap.getCompetitor(loserssPoule.getPlace(1).getStartLocation()).getName()).to.equal('tc 1.4');
        expect(placeLocationMap.getCompetitor(loserssPoule.getPlace(2).getStartLocation())).to.not.equal(undefined);
        expect(placeLocationMap.getCompetitor(loserssPoule.getPlace(2).getStartLocation()).getName()).to.equal('tc 1.5');
    });

    it('2 roundnumbers, five places, filter poule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 6);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const placeLocationMap = new PlaceLocationMap(createTeamCompetitors(competition, firstRoundNumber));
        const rootRound = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        const pouleTwo = rootRound.getPoule(2);

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        createGames(structure.getFirstRoundNumber());

        setScoreSingle(pouleOne, 1, 2, 2, 1);
        setScoreSingle(pouleOne, 1, 3, 3, 1);
        setScoreSingle(pouleOne, 2, 3, 4, 1);

        setScoreSingle(pouleTwo, 1, 2, 2, 1);
        setScoreSingle(pouleTwo, 1, 3, 3, 1);
        setScoreSingle(pouleTwo, 2, 3, 4, 1);


        const qualifyService = new QualifyService(rootRound, RankingService.RULESSET_WC);
        qualifyService.setQualifiers(pouleOne);

        const winnersPoule = rootRound.getChild(QualifyGroup.WINNERS, 1).getPoule(1);

        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(1).getStartLocation())).to.not.equal(undefined);
        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(1).getStartLocation()).getName()).to.equal('tc 1.1');
        expect(winnersPoule.getPlace(2).getQualifiedPlace()).to.equal(undefined);

        const loserssPoule = rootRound.getChild(QualifyGroup.LOSERS, 1).getPoule(1);

        expect(loserssPoule.getPlace(2).getQualifiedPlace()).to.equal(undefined);
        expect(placeLocationMap.getCompetitor(loserssPoule.getPlace(1).getStartLocation())).to.not.equal(undefined);
    });

    it('2 roundnumbers, nine places, multiple rules', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 9);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const placeLocationMap = new PlaceLocationMap(createTeamCompetitors(competition, firstRoundNumber));
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 4);
        structureService.removePoule(rootRound.getChild(QualifyGroup.WINNERS, 1));

        structureService.addQualifiers(rootRound, QualifyGroup.LOSERS, 4);
        structureService.removePoule(rootRound.getChild(QualifyGroup.LOSERS, 1));

        const pouleOne = rootRound.getPoule(1);
        const pouleTwo = rootRound.getPoule(2);
        const pouleThree = rootRound.getPoule(3);

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

        const qualifyService = new QualifyService(rootRound, RankingService.RULESSET_WC);
        const changedPlaces = qualifyService.setQualifiers();
        expect(changedPlaces.length).to.equal(8);

        const winnersPoule = rootRound.getChild(QualifyGroup.WINNERS, 1).getPoule(1);

        expect(winnersPoule.getPlace(1).getFromQualifyRule().isSingle()).to.equal(true);
        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(1).getStartLocation())).to.not.equal(undefined);
        expect(winnersPoule.getPlace(2).getFromQualifyRule().isSingle()).to.equal(true);
        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(2).getStartLocation())).to.not.equal(undefined);
        expect(winnersPoule.getPlace(3).getFromQualifyRule().isSingle()).to.equal(true);
        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(3).getStartLocation())).to.not.equal(undefined);
        expect(winnersPoule.getPlace(4).getFromQualifyRule().isMultiple()).to.equal(true);
        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(4).getStartLocation()).getName()).to.equal('tc 3.2');

        const losersPoule = rootRound.getChild(QualifyGroup.LOSERS, 1).getPoule(1);

        expect(losersPoule.getPlace(1).getFromQualifyRule().isMultiple()).to.equal(true);
        expect(placeLocationMap.getCompetitor(losersPoule.getPlace(1).getStartLocation()).getName()).to.not.equal(undefined);
        expect(losersPoule.getPlace(2).getFromQualifyRule().isSingle()).to.equal(true);
        expect(placeLocationMap.getCompetitor(losersPoule.getPlace(2).getStartLocation())).to.not.equal(undefined);
        expect(losersPoule.getPlace(3).getFromQualifyRule().isSingle()).to.equal(true);
        expect(placeLocationMap.getCompetitor(losersPoule.getPlace(3).getStartLocation())).to.not.equal(undefined);
        expect(losersPoule.getPlace(4).getFromQualifyRule().isSingle()).to.equal(true);
        expect(placeLocationMap.getCompetitor(losersPoule.getPlace(4).getStartLocation())).to.not.equal(undefined);

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
        structureService.removePoule(rootRound.getChild(QualifyGroup.WINNERS, 1));

        const pouleOne = rootRound.getPoule(1);
        const pouleTwo = rootRound.getPoule(2);
        const pouleThree = rootRound.getPoule(3);

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

        const winnersPoule = rootRound.getChild(QualifyGroup.WINNERS, 1).getPoule(1);

        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(4).getStartLocation())).to.equal(undefined);
    });

    /**
    * When second place is multiple and both second places are ranked completely equal
    */
    it('same winnerslosers for second place multiple rule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 6, 2);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const placeLocationMap = new PlaceLocationMap(createTeamCompetitors(competition, firstRoundNumber));
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 3);
        structureService.addQualifiers(rootRound, QualifyGroup.LOSERS, 3);

        const pouleOne = rootRound.getPoule(1);
        const pouleTwo = rootRound.getPoule(2);

        createGames(structure.getFirstRoundNumber());
        setScoreSingle(pouleOne, 1, 2, 1, 0);
        setScoreSingle(pouleOne, 3, 1, 0, 1);
        setScoreSingle(pouleOne, 2, 3, 1, 0);
        setScoreSingle(pouleTwo, 1, 2, 1, 0);
        setScoreSingle(pouleTwo, 3, 1, 0, 1);
        setScoreSingle(pouleTwo, 2, 3, 1, 0);

        const qualifyService = new QualifyService(rootRound, RankingService.RULESSET_WC);
        qualifyService.setQualifiers();

        const winnersPoule = rootRound.getChild(QualifyGroup.WINNERS, 1).getPoule(1);

        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(3).getStartLocation())).to.not.equal(undefined);
        expect(placeLocationMap.getCompetitor(winnersPoule.getPlace(3).getStartLocation()).getName()).to.equal('tc 1.2');

        const losersPoule = rootRound.getChild(QualifyGroup.LOSERS, 1).getPoule(1);
        expect(placeLocationMap.getCompetitor(losersPoule.getPlace(1).getStartLocation())).to.not.equal(undefined);
        expect(placeLocationMap.getCompetitor(losersPoule.getPlace(1).getStartLocation()).getName()).to.equal('tc 2.2');
    });
});
