import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Competitor } from '../../src/competitor';
import { NameService } from '../../src/nameservice';
import { PlanningService } from '../../src/planning/service';
import { QualifyGroup } from '../../src/qualify/group';
import { Referee } from '../../src/referee';
import { StructureService } from '../../src/structure/service';
import { getMapper } from '../createmapper';
import { jsonCompetition } from '../data/competition';

describe('NameService', () => {

    it('winnerslosers description', () => {

        const nameService = new NameService();

        expect(nameService.getWinnersLosersDescription(QualifyGroup.WINNERS)).to.equal('winnaar');
        expect(nameService.getWinnersLosersDescription(QualifyGroup.LOSERS)).to.equal('verliezer');
        expect(nameService.getWinnersLosersDescription(QualifyGroup.WINNERS, true)).to.equal('winnaars');
        expect(nameService.getWinnersLosersDescription(QualifyGroup.LOSERS, true)).to.equal('verliezers');
        expect(nameService.getWinnersLosersDescription(QualifyGroup.DROPOUTS)).to.equal('');
    });

    it('roundnumber name', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 8, 3);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const rootRound = structure.getRootRound();

        for (let i = 1; i < 4; i++) { structureService.addQualifier(rootRound, QualifyGroup.WINNERS); }
        for (let i = 1; i < 4; i++) { structureService.addQualifier(rootRound, QualifyGroup.LOSERS); }

        const secondRoundNumberName = nameService.getRoundNumberName(firstRoundNumber.getNext());
        // all equal
        expect(secondRoundNumberName).to.equal('finale');

        const losersChildRound = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS).getChildRound();

        structureService.addQualifier(losersChildRound, QualifyGroup.LOSERS);
        // not all equal
        const newSecondRoundNumberName = nameService.getRoundNumberName(firstRoundNumber.getNext());
        expect(newSecondRoundNumberName).to.equal('2<sup>de</sup> ronde');
    });

    it('round name, roundAndParentsNeedsRanking no ranking', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        // root needs no ranking, unequal depth
        {
            const structureService = new StructureService();
            const structure = structureService.create(competition, 4, 2);
            const rootRound = structure.getRootRound();

            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

            expect(nameService.getRoundName(rootRound)).to.equal('1<sup>ste</sup> ronde');

            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

            expect(nameService.getRoundName(rootRound)).to.equal('&frac12; finale');
        }

        // root needs ranking
        {
            const structureService2 = new StructureService();
            const structure2 = structureService2.create(competition, 16, 4);
            const rootRound2 = structure2.getRootRound();

            expect(nameService.getRoundName(rootRound2)).to.equal('1<sup>ste</sup> ronde');

            // child needs ranking
            structureService2.addQualifier(rootRound2, QualifyGroup.WINNERS);
            structureService2.addQualifier(rootRound2, QualifyGroup.WINNERS);

            expect(nameService.getRoundName(rootRound2.getChild(QualifyGroup.WINNERS, 1))).to.equal('2<sup>de</sup> ronde');
        }

    });

    it('round name, htmlFractialNumber', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);



        // root needs ranking, depth 2
        {
            const structureService = new StructureService();
            const structure = structureService.create(competition, 16, 8);
            const rootRound = structure.getRootRound();

            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

            const winnersChildRound = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS).getChildRound();

            structureService.addQualifier(winnersChildRound, QualifyGroup.WINNERS);
            structureService.addQualifier(winnersChildRound, QualifyGroup.WINNERS);
            structureService.addQualifier(winnersChildRound, QualifyGroup.WINNERS);

            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

            const losersChildRound = rootRound.getBorderQualifyGroup(QualifyGroup.LOSERS).getChildRound();

            structureService.addQualifier(losersChildRound, QualifyGroup.LOSERS);
            structureService.addQualifier(losersChildRound, QualifyGroup.LOSERS);
            structureService.addQualifier(losersChildRound, QualifyGroup.LOSERS);

            expect(nameService.getRoundName(rootRound)).to.equal('&frac14; finale');

            const doubleWinnersChildRound = winnersChildRound.getBorderQualifyGroup(QualifyGroup.WINNERS).getChildRound();
            structureService.addQualifier(doubleWinnersChildRound, QualifyGroup.WINNERS);

            const doubleLosersChildRound = losersChildRound.getBorderQualifyGroup(QualifyGroup.LOSERS).getChildRound();
            structureService.addQualifier(doubleLosersChildRound, QualifyGroup.LOSERS);

            const number = 8;
            expect(nameService.getRoundName(rootRound)).to.equal(
                '<span style="font-size: 80%"><sup>1</sup>&frasl;<sub>' + number + '</sub></span> finale'
            );

            const losersFinal = doubleLosersChildRound.getBorderQualifyGroup(QualifyGroup.LOSERS).getChildRound();
            expect(nameService.getRoundName(losersFinal)).to.equal('15<sup>de</sup>' + '/' + '16<sup>de</sup>' + ' plaats');
        }
    });

    it('poule name', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        // basics
        {
            const structureService = new StructureService();
            const structure = structureService.create(competition, 89, 30);
            const rootRound = structure.getRootRound();

            expect(nameService.getPouleName(rootRound.getPoule(1), false)).to.equal('A');
            expect(nameService.getPouleName(rootRound.getPoule(1), true)).to.equal('poule A');

            expect(nameService.getPouleName(rootRound.getPoule(27), false)).to.equal('AA');
            expect(nameService.getPouleName(rootRound.getPoule(27), true)).to.equal('poule AA');

            expect(nameService.getPouleName(rootRound.getPoule(30), false)).to.equal('AD');
            expect(nameService.getPouleName(rootRound.getPoule(30), true)).to.equal('wed. AD');
        }
    });

    it('place name', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        // basics
        {
            const structureService = new StructureService();
            const structure = structureService.create(competition, 3);
            const rootRound = structure.getRootRound();

            const firstPlace = rootRound.getFirstPlace(QualifyGroup.WINNERS);
            const competitor = new Competitor(competition.getLeague().getAssociation(), 'competitor 1');
            firstPlace.setCompetitor(competitor);

            expect(nameService.getPlaceName(firstPlace, false, false)).to.equal('A1');
            expect(nameService.getPlaceName(firstPlace, true, false)).to.equal('competitor 1');
            expect(nameService.getPlaceName(firstPlace, false, true)).to.equal('poule A nr. 1');
            expect(nameService.getPlaceName(firstPlace, true, true)).to.equal('competitor 1');

            const lastPlace = rootRound.getFirstPlace(QualifyGroup.LOSERS);

            expect(nameService.getPlaceName(lastPlace)).to.equal('A3');
            expect(nameService.getPlaceName(lastPlace, true, false)).to.equal('A3');
            expect(nameService.getPlaceName(lastPlace, false, true)).to.equal('poule A nr. 3');
            expect(nameService.getPlaceName(lastPlace, true, true)).to.equal('poule A nr. 3');
        }
    });

    it('place fromname', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        // basics
        {
            const structureService = new StructureService();
            const structure = structureService.create(competition, 9, 3);
            const rootRound = structure.getRootRound();

            const firstPlace = rootRound.getFirstPlace(QualifyGroup.WINNERS);
            const competitor = new Competitor(competition.getLeague().getAssociation(), 'competitor 1');
            firstPlace.setCompetitor(competitor);

            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

            expect(nameService.getPlaceFromName(firstPlace, false, false)).to.equal('A1');
            expect(nameService.getPlaceFromName(firstPlace, true, false)).to.equal('competitor 1');
            expect(nameService.getPlaceFromName(firstPlace, false, true)).to.equal('poule A nr. 1');
            expect(nameService.getPlaceFromName(firstPlace, true, true)).to.equal('competitor 1');

            const lastPlace = rootRound.getFirstPlace(QualifyGroup.LOSERS);

            expect(nameService.getPlaceFromName(lastPlace, false, false)).to.equal('C3');
            expect(nameService.getPlaceFromName(lastPlace, true, false)).to.equal('C3');
            expect(nameService.getPlaceFromName(lastPlace, false, true)).to.equal('poule C nr. 3');
            expect(nameService.getPlaceFromName(lastPlace, true, true)).to.equal('poule C nr. 3');

            const winnersChildRound = rootRound.getBorderQualifyGroup(QualifyGroup.WINNERS).getChildRound();
            const winnersLastPlace = winnersChildRound.getPoule(1).getPlace(2);

            expect(nameService.getPlaceFromName(winnersLastPlace, false, false)).to.equal('?2');
            expect(nameService.getPlaceFromName(winnersLastPlace, false, true)).to.equal('beste nummer 2');

            const winnersFirstPlace = winnersChildRound.getPoule(1).getPlace(1);

            expect(nameService.getPlaceFromName(winnersFirstPlace, false, false)).to.equal('A1');
            expect(nameService.getPlaceFromName(winnersFirstPlace, false, true)).to.equal('poule A nr. 1');

            structureService.addQualifier(winnersChildRound, QualifyGroup.WINNERS);
            const doubleWinnersChildRound = winnersChildRound.getBorderQualifyGroup(QualifyGroup.WINNERS).getChildRound();

            const doubleWinnersFirstPlace = doubleWinnersChildRound.getPoule(1).getPlace(1);

            expect(nameService.getPlaceFromName(doubleWinnersFirstPlace, false, false)).to.equal('D1');
            expect(nameService.getPlaceFromName(doubleWinnersFirstPlace, false, true)).to.equal('winnaar D');

            structureService.addQualifier(winnersChildRound, QualifyGroup.LOSERS);
            const winnersLosersChildRound = winnersChildRound.getBorderQualifyGroup(QualifyGroup.LOSERS).getChildRound();

            const winnersLosersFirstPlace = winnersLosersChildRound.getPoule(1).getPlace(1);

            expect(nameService.getPlaceFromName(winnersLosersFirstPlace, false)).to.equal('D2');
            expect(nameService.getPlaceFromName(winnersLosersFirstPlace, false, true)).to.equal('verliezer D');
        }
    });

    it('places fromname', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        // basics
        {
            const structureService = new StructureService();
            const structure = structureService.create(competition, 3, 1);
            const rootRound = structure.getRootRound();

            const firstPlace = rootRound.getFirstPlace(QualifyGroup.WINNERS);
            const competitor = new Competitor(competition.getLeague().getAssociation(), 'competitor 1');
            firstPlace.setCompetitor(competitor);

            const planningService = new PlanningService(competition);
            planningService.create(rootRound.getNumber());

            const game = rootRound.getGames()[0];
            const gamePlaces = game.getPlaces();

            expect(nameService.getPlacesFromName(gamePlaces, false, false)).to.equal('A2 & A3');
        }
    });

    it('horizontalpoule name', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        // basics
        {
            const structureService = new StructureService();
            const structure = structureService.create(competition, 12, 3);
            const rootRound = structure.getRootRound();

            const firstWinnersHorPoule = rootRound.getHorizontalPoules(QualifyGroup.WINNERS)[0];
            expect(nameService.getHorizontalPouleName(firstWinnersHorPoule)).to.equal('nummers 1');

            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

            const firstWinnersHorPoule2 = rootRound.getHorizontalPoules(QualifyGroup.WINNERS)[0];
            expect(nameService.getHorizontalPouleName(firstWinnersHorPoule2)).to.equal('2 beste nummers 1');

            const firstLosersHorPoule = rootRound.getHorizontalPoules(QualifyGroup.LOSERS)[0];
            expect(nameService.getHorizontalPouleName(firstLosersHorPoule)).to.equal('2 slechtste nummers laatste');

            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);

            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

            const firstWinnersHorPoule3 = rootRound.getHorizontalPoules(QualifyGroup.WINNERS)[0];
            expect(nameService.getHorizontalPouleName(firstWinnersHorPoule3)).to.equal('nummers 1');

            const firstLosersHorPoule3 = rootRound.getHorizontalPoules(QualifyGroup.LOSERS)[0];
            expect(nameService.getHorizontalPouleName(firstLosersHorPoule3)).to.equal('nummers laatste');

            const secondWinnersHorPoule = rootRound.getHorizontalPoules(QualifyGroup.WINNERS)[1];
            expect(nameService.getHorizontalPouleName(secondWinnersHorPoule)).to.equal('beste nummer 2');

            const secondLosersHorPoule = rootRound.getHorizontalPoules(QualifyGroup.LOSERS)[1];
            expect(nameService.getHorizontalPouleName(secondLosersHorPoule)).to.equal('slechtste 1 na laatst');


            structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
            const secondWinnersHorPoule2 = rootRound.getHorizontalPoules(QualifyGroup.WINNERS)[1];
            expect(nameService.getHorizontalPouleName(secondWinnersHorPoule2)).to.equal('2 beste nummers 2');

            structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
            const secondLosersHorPoule2 = rootRound.getHorizontalPoules(QualifyGroup.LOSERS)[1];
            expect(nameService.getHorizontalPouleName(secondLosersHorPoule2)).to.equal('2 slechtste nummers 1 na laatst');
        }
    });

    it('referee name', () => {

        const nameService = new NameService();

        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        // basics
        {
            const structureService = new StructureService();
            const structure = structureService.create(competition, 3, 1);
            const rootRound = structure.getRootRound();

            const firstPlace = rootRound.getFirstPlace(QualifyGroup.WINNERS);
            const competitor = new Competitor(competition.getLeague().getAssociation(), 'competitor 1');
            firstPlace.setCompetitor(competitor);

            const referee = new Referee(competition, 'CDK');
            referee.setName('Co Du');

            const planningService = new PlanningService(competition);
            planningService.create(rootRound.getNumber());

            const game = rootRound.getGames()[0];

            expect(nameService.getRefereeName(game)).to.equal('CDK');
            expect(nameService.getRefereeName(game, false)).to.equal('CDK');
            expect(nameService.getRefereeName(game, true)).to.equal('Co Du');

            rootRound.getNumber().getConfig().setSelfReferee(true);
            planningService.create(rootRound.getNumber());

            const gameSelf = rootRound.getGames()[0];

            expect(nameService.getRefereeName(gameSelf)).to.equal('competitor 1');
            expect(nameService.getRefereeName(gameSelf, false)).to.equal('competitor 1');
            expect(nameService.getRefereeName(gameSelf, true)).to.equal('competitor 1');

            const gameSelfLast = rootRound.getGames()[2];

            expect(nameService.getRefereeName(gameSelfLast)).to.equal('A2');
            expect(nameService.getRefereeName(gameSelfLast, false)).to.equal('A2');
            expect(nameService.getRefereeName(gameSelfLast, true)).to.equal('poule A nr. 2');

            const gameSelfMiddle = rootRound.getGames()[1];
            gameSelfMiddle.setRefereePlace(undefined);

            expect(nameService.getRefereeName(gameSelfMiddle)).to.equal('');
            expect(nameService.getRefereeName(gameSelfMiddle, false)).to.equal('');
            expect(nameService.getRefereeName(gameSelfMiddle, true)).to.equal('');
        }
    });


});
