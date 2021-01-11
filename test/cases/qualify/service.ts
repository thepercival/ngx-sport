import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
    PlaceLocationMap,
    QualifyGroup,
    QualifyService,
    RankingService,
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
        const winnersPoule = winnersRound.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }
        const winnersPlace1 = winnersPoule.getPlace(1);
        expect(winnersPlace1).to.not.equal(undefined);
        if (winnersPlace1) {
            expect(placeLocationMap.getCompetitor(winnersPlace1.getStartLocation())).to.not.equal(undefined);
            expect(placeLocationMap.getCompetitor(winnersPlace1.getStartLocation()).getName()).to.equal('tc 1.1');
        }
        const winnersPlace2 = winnersPoule.getPlace(2);
        expect(winnersPlace2).to.not.equal(undefined);
        if (winnersPlace2) {
            expect(placeLocationMap.getCompetitor(winnersPlace2.getStartLocation())).to.not.equal(undefined);
            expect(placeLocationMap.getCompetitor(winnersPlace2.getStartLocation()).getName()).to.equal('tc 1.2');
        }

        const losersRound = rootRound.getChild(QualifyGroup.LOSERS, 1);
        expect(losersRound).to.not.equal(undefined);
        if (!losersRound) {
            return;
        }

        const loserssPoule = losersRound.getPoule(1);
        expect(loserssPoule).to.not.equal(undefined);
        if (!loserssPoule) {
            return;
        }
        const losersPlace1 = loserssPoule.getPlace(1);
        expect(losersPlace1).to.not.equal(undefined);
        if (losersPlace1) {
            expect(placeLocationMap.getCompetitor(losersPlace1.getStartLocation())).to.not.equal(undefined);
            expect(placeLocationMap.getCompetitor(losersPlace1.getStartLocation()).getName()).to.equal('tc 1.4');
        }
        const losersPlace2 = loserssPoule.getPlace(2);
        expect(losersPlace2).to.not.equal(undefined);
        if (losersPlace2) {
            expect(placeLocationMap.getCompetitor(losersPlace2.getStartLocation())).to.not.equal(undefined);
            expect(placeLocationMap.getCompetitor(losersPlace2.getStartLocation()).getName()).to.equal('tc 1.5');
        }

    });

    it('2 roundnumbers, five places, filter poule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 6);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const placeLocationMap = new PlaceLocationMap(createTeamCompetitors(competition, firstRoundNumber));
        const rootRound = structure.getRootRound();

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

        const winnersRoundOne = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRoundOne).to.not.equal(undefined);
        if (!winnersRoundOne) {
            return;
        }
        const winnersPoule = winnersRoundOne.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }

        const winnersPlace1 = winnersPoule.getPlace(1);
        expect(winnersPlace1).to.not.equal(undefined);
        if (winnersPlace1) {
            expect(placeLocationMap.getCompetitor(winnersPlace1.getStartLocation())).to.not.equal(undefined);
            expect(placeLocationMap.getCompetitor(winnersPlace1.getStartLocation()).getName()).to.equal('tc 1.1');
        }

        const winnersPlace2 = winnersPoule.getPlace(2);
        expect(winnersPlace2).to.not.equal(undefined);
        if (winnersPlace2) {
            expect(winnersPlace2.getQualifiedPlace()).to.equal(undefined);
        }

        const losersRoundOne = rootRound.getChild(QualifyGroup.LOSERS, 1);
        expect(losersRoundOne).to.not.equal(undefined);
        if (!losersRoundOne) {
            return;
        }
        const losersPoule = losersRoundOne.getPoule(1);
        expect(losersPoule).to.not.equal(undefined);
        if (!losersPoule) {
            return;
        }

        const losersPlace1 = losersPoule.getPlace(1);
        expect(losersPlace1).to.not.equal(undefined);
        if (losersPlace1) {
            expect(placeLocationMap.getCompetitor(losersPlace1.getStartLocation())).to.not.equal(undefined);
        }

        const losersPlace2 = losersPoule.getPlace(2);
        expect(losersPlace2).to.not.equal(undefined);
        if (losersPlace2) {
            expect(losersPlace2.getQualifiedPlace()).to.equal(undefined);
        }
    });

    it('2 roundnumbers, nine places, multiple rules', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);
        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 9);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const placeLocationMap = new PlaceLocationMap(createTeamCompetitors(competition, firstRoundNumber));
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 4);
        let winnersRoundOne = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRoundOne).to.not.equal(undefined);
        if (!winnersRoundOne) {
            return;
        }
        structureService.removePoule(winnersRoundOne);

        structureService.addQualifiers(rootRound, QualifyGroup.LOSERS, 4);
        let losersRoundOne = rootRound.getChild(QualifyGroup.LOSERS, 1);
        expect(losersRoundOne).to.not.equal(undefined);
        if (!losersRoundOne) {
            return;
        }
        structureService.removePoule(losersRoundOne);

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
        setScoreSingle(pouleThree, 2, 3, 2, 5);

        const qualifyService = new QualifyService(rootRound, RankingService.RULESSET_WC);
        const changedPlaces = qualifyService.setQualifiers();
        expect(changedPlaces.length).to.equal(8);


        winnersRoundOne = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRoundOne).to.not.equal(undefined);
        if (!winnersRoundOne) {
            return;
        }

        const winnersPoule = winnersRoundOne.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }

        const winnersPlace1 = winnersPoule.getPlace(1);
        expect(winnersPlace1).to.not.equal(undefined);
        if (winnersPlace1) {
            const qualifyRule = winnersPlace1.getFromQualifyRule();
            expect(qualifyRule).to.not.equal(undefined);
            if (qualifyRule) {
                expect(qualifyRule.isSingle()).to.equal(true);
                expect(placeLocationMap.getCompetitor(winnersPlace1.getStartLocation())).to.not.equal(undefined);
            }
        }


        const winnersPlace2 = winnersPoule.getPlace(2);
        expect(winnersPlace2).to.not.equal(undefined);
        if (winnersPlace2) {
            const qualifyRule = winnersPlace2.getFromQualifyRule();
            expect(qualifyRule).to.not.equal(undefined);
            if (qualifyRule) {
                expect(qualifyRule.isSingle()).to.equal(true);
                expect(placeLocationMap.getCompetitor(winnersPlace2.getStartLocation())).to.not.equal(undefined);
            }
        }

        const winnersPlace3 = winnersPoule.getPlace(3);
        expect(winnersPlace3).to.not.equal(undefined);
        if (winnersPlace3) {
            const qualifyRule = winnersPlace3.getFromQualifyRule();
            expect(qualifyRule).to.not.equal(undefined);
            if (qualifyRule) {
                expect(qualifyRule.isSingle()).to.equal(true);
                expect(placeLocationMap.getCompetitor(winnersPlace3.getStartLocation())).to.not.equal(undefined);
            }
        }

        const winnersPlace4 = winnersPoule.getPlace(4);
        expect(winnersPlace4).to.not.equal(undefined);
        if (winnersPlace4) {
            const qualifyRule = winnersPlace4.getFromQualifyRule();
            expect(qualifyRule).to.not.equal(undefined);
            if (qualifyRule) {
                expect(qualifyRule.isMultiple()).to.equal(true);
                expect(placeLocationMap.getCompetitor(winnersPlace4.getStartLocation()).getName()).to.equal('tc 3.2');
            }
        }




        losersRoundOne = rootRound.getChild(QualifyGroup.LOSERS, 1);
        expect(losersRoundOne).to.not.equal(undefined);
        if (!losersRoundOne) {
            return;
        }
        const losersPoule = losersRoundOne.getPoule(1);
        expect(losersPoule).to.not.equal(undefined);
        if (!losersPoule) {
            return;
        }
        const losersPlace1 = losersPoule.getPlace(1);
        expect(losersPlace1).to.not.equal(undefined);
        if (losersPlace1) {
            const qualifyRule = losersPlace1.getFromQualifyRule();
            expect(qualifyRule).to.not.equal(undefined);
            if (qualifyRule) {
                expect(qualifyRule.isMultiple()).to.equal(true);
                expect(placeLocationMap.getCompetitor(losersPlace1.getStartLocation())).to.not.equal(undefined);
            }
        }

        const losersPlace2 = losersPoule.getPlace(2);
        expect(losersPlace2).to.not.equal(undefined);
        if (losersPlace2) {
            const qualifyRule = losersPlace2.getFromQualifyRule();
            expect(qualifyRule).to.not.equal(undefined);
            if (qualifyRule) {
                expect(qualifyRule.isSingle()).to.equal(true);
                expect(placeLocationMap.getCompetitor(losersPlace2.getStartLocation())).to.not.equal(undefined);
            }
        }

        const losersPlace3 = losersPoule.getPlace(3);
        expect(losersPlace3).to.not.equal(undefined);
        if (losersPlace3) {
            const qualifyRule = losersPlace3.getFromQualifyRule();
            expect(qualifyRule).to.not.equal(undefined);
            if (qualifyRule) {
                expect(qualifyRule.isSingle()).to.equal(true);
                expect(placeLocationMap.getCompetitor(losersPlace3.getStartLocation())).to.not.equal(undefined);
            }
        }

        const losersPlace4 = losersPoule.getPlace(4);
        expect(losersPlace4).to.not.equal(undefined);
        if (losersPlace4) {
            const qualifyRule = losersPlace4.getFromQualifyRule();
            expect(qualifyRule).to.not.equal(undefined);
            if (qualifyRule) {
                expect(qualifyRule.isSingle()).to.equal(true);
                expect(placeLocationMap.getCompetitor(losersPlace4.getStartLocation())).to.not.equal(undefined);
            }
        }

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
        const winnersRoundOne = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRoundOne).to.not.equal(undefined);
        if (!winnersRoundOne) {
            return;
        }
        structureService.removePoule(winnersRoundOne);

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

        const winnersRoundOne2 = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRoundOne2).to.not.equal(undefined);
        if (!winnersRoundOne2) {
            return;
        }

        const winnersPoule = winnersRoundOne2.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }

        const winnersPlace4 = winnersPoule.getPlace(4);
        expect(winnersPlace4).to.not.equal(undefined);
        if (!winnersPlace4) {
            return;
        }
        expect(placeLocationMap.getCompetitor(winnersPlace4.getStartLocation())).to.equal(undefined);
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
        setScoreSingle(pouleOne, 1, 2, 1, 0);
        setScoreSingle(pouleOne, 3, 1, 0, 1);
        setScoreSingle(pouleOne, 2, 3, 1, 0);
        setScoreSingle(pouleTwo, 1, 2, 1, 0);
        setScoreSingle(pouleTwo, 3, 1, 0, 1);
        setScoreSingle(pouleTwo, 2, 3, 1, 0);

        const qualifyService = new QualifyService(rootRound, RankingService.RULESSET_WC);
        qualifyService.setQualifiers();


        const winnersRoundOne = rootRound.getChild(QualifyGroup.WINNERS, 1);
        expect(winnersRoundOne).to.not.equal(undefined);
        if (!winnersRoundOne) {
            return;
        }
        const winnersPoule = winnersRoundOne.getPoule(1);
        expect(winnersPoule).to.not.equal(undefined);
        if (!winnersPoule) {
            return;
        }
        const winnersPlace3 = winnersPoule.getPlace(3);
        expect(winnersPlace3).to.not.equal(undefined);
        if (winnersPlace3) {
            expect(placeLocationMap.getCompetitor(winnersPlace3.getStartLocation())).to.not.equal(undefined);
            expect(placeLocationMap.getCompetitor(winnersPlace3.getStartLocation()).getName()).to.equal('tc 1.2');
        }

        const losersRoundOne = rootRound.getChild(QualifyGroup.LOSERS, 1);
        expect(losersRoundOne).to.not.equal(undefined);
        if (!losersRoundOne) {
            return;
        }
        const losersPoule = losersRoundOne.getPoule(1);
        expect(losersPoule).to.not.equal(undefined);
        if (!losersPoule) {
            return;
        }
        const losersPlace1 = losersPoule.getPlace(1);
        expect(losersPlace1).to.not.equal(undefined);
        if (losersPlace1) {
            expect(placeLocationMap.getCompetitor(losersPlace1.getStartLocation())).to.not.equal(undefined);
            expect(placeLocationMap.getCompetitor(losersPlace1.getStartLocation()).getName()).to.equal('tc 2.2');
        }
    });
});
