import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
    Competitor,
    QualifyGroup,
    QualifyService,
    RankingService,
    Round,
    StructureService,
} from '../../../public_api';
import { getGameMapper, getCompetitionMapper } from '../../helpers/mappers';
import { jsonBaseCompetition } from '../../data/competition';
import { setScoreSingle } from '../../helpers/setscores';
import { jsonGames5Places } from '../../data/games/5places';
import { jsonGames3Places } from '../../data/games/3places';
import { getDefaultStructureOptions } from '../../helpers/getdefaultstructureoptions';

describe('QualifyService', () => {

    it('2 roundnumbers, five places', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService(getDefaultStructureOptions());
        const structure = structureService.create(competition, 5);
        const rootRound: Round = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        const pouleOne = rootRound.getPoule(1);
        jsonGames5Places.forEach(jsonGames => getGameMapper().toObject(jsonGames, pouleOne));

        for (let nr = 1; nr <= pouleOne.getPlaces().length; nr++) {
            const competitor = new Competitor(competition.getLeague().getAssociation(), '' + nr);
            pouleOne.getPlace(nr).setCompetitor(competitor);
        }

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

        expect(winnersPoule.getPlace(1).getCompetitor()).to.not.equal(undefined);
        expect(winnersPoule.getPlace(1).getCompetitor().getName()).to.equal('1');
        expect(winnersPoule.getPlace(2).getCompetitor()).to.not.equal(undefined);
        expect(winnersPoule.getPlace(2).getCompetitor().getName()).to.equal('2');


        const loserssPoule = rootRound.getChild(QualifyGroup.LOSERS, 1).getPoule(1);

        expect(loserssPoule.getPlace(1).getCompetitor()).to.not.equal(undefined);
        expect(loserssPoule.getPlace(1).getCompetitor().getName()).to.equal('4');
        expect(loserssPoule.getPlace(2).getCompetitor()).to.not.equal(undefined);
        expect(loserssPoule.getPlace(2).getCompetitor().getName()).to.equal('5');
    });

    it('2 roundnumbers, five places, filter poule', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService(getDefaultStructureOptions());
        const structure = structureService.create(competition, 6);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        jsonGames3Places.forEach(jsonGames => getGameMapper().toObject(jsonGames, pouleOne));

        for (let nr = 1; nr <= pouleOne.getPlaces().length; nr++) {
            const competitor = new Competitor(competition.getLeague().getAssociation(), '' + nr);
            pouleOne.getPlace(nr).setCompetitor(competitor);
        }

        const pouleTwo = rootRound.getPoule(2);
        jsonGames3Places.forEach(jsonGames => getGameMapper().toObject(jsonGames, pouleTwo));

        for (let nr = 1; nr <= pouleTwo.getPlaces().length; nr++) {
            const competitor = new Competitor(competition.getLeague().getAssociation(), '' + (pouleOne.getPlaces().length + nr));
            pouleTwo.getPlace(nr).setCompetitor(competitor);
        }

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        setScoreSingle(pouleOne, 1, 2, 2, 1);
        setScoreSingle(pouleOne, 1, 3, 3, 1);
        setScoreSingle(pouleOne, 2, 3, 4, 1);

        setScoreSingle(pouleTwo, 1, 2, 2, 1);
        setScoreSingle(pouleTwo, 1, 3, 3, 1);
        setScoreSingle(pouleTwo, 2, 3, 4, 1);


        const qualifyService = new QualifyService(rootRound, RankingService.RULESSET_WC);
        qualifyService.setQualifiers(pouleOne);

        const winnersPoule = rootRound.getChild(QualifyGroup.WINNERS, 1).getPoule(1);

        expect(winnersPoule.getPlace(1).getCompetitor()).to.not.equal(undefined);
        expect(winnersPoule.getPlace(1).getCompetitor().getName()).to.equal('1');
        expect(winnersPoule.getPlace(2).getCompetitor()).to.equal(undefined);

        const loserssPoule = rootRound.getChild(QualifyGroup.LOSERS, 1).getPoule(1);

        expect(loserssPoule.getPlace(2).getCompetitor()).to.equal(undefined);
        expect(loserssPoule.getPlace(1).getCompetitor()).to.not.equal(undefined);
    });

    it('2 roundnumbers, nine places, multiple rules', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService(getDefaultStructureOptions());
        const structure = structureService.create(competition, 9);
        const rootRound: Round = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.removePoule(rootRound.getChild(QualifyGroup.WINNERS, 1));

        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);
        structureService.removePoule(rootRound.getChild(QualifyGroup.LOSERS, 1));

        const pouleOne = rootRound.getPoule(1);
        jsonGames3Places.forEach(jsonGames => getGameMapper().toObject(jsonGames, pouleOne));
        for (let nr = 1; nr <= pouleOne.getPlaces().length; nr++) {
            const competitor = new Competitor(competition.getLeague().getAssociation(), '' + nr);
            pouleOne.getPlace(nr).setCompetitor(competitor);
        }
        const pouleTwo = rootRound.getPoule(2);
        jsonGames3Places.forEach(jsonGames => getGameMapper().toObject(jsonGames, pouleTwo));
        for (let nr = 1; nr <= pouleTwo.getPlaces().length; nr++) {
            const competitor = new Competitor(competition.getLeague().getAssociation(), '' + (pouleOne.getPlaces().length + nr));
            pouleTwo.getPlace(nr).setCompetitor(competitor);
        }
        const pouleThree = rootRound.getPoule(3);
        jsonGames3Places.forEach(jsonGames => getGameMapper().toObject(jsonGames, pouleThree));
        for (let nr = 1; nr <= pouleThree.getPlaces().length; nr++) {
            const competitor = new Competitor(competition.getLeague().getAssociation(), '' + (pouleOne.getPlaces().length + pouleTwo.getPlaces().length + nr));
            pouleThree.getPlace(nr).setCompetitor(competitor);
        }

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
        expect(winnersPoule.getPlace(1).getCompetitor()).to.not.equal(undefined);
        expect(winnersPoule.getPlace(2).getFromQualifyRule().isSingle()).to.equal(true);
        expect(winnersPoule.getPlace(2).getCompetitor()).to.not.equal(undefined);
        expect(winnersPoule.getPlace(3).getFromQualifyRule().isSingle()).to.equal(true);
        expect(winnersPoule.getPlace(3).getCompetitor()).to.not.equal(undefined);
        expect(winnersPoule.getPlace(4).getFromQualifyRule().isMultiple()).to.equal(true);
        expect(winnersPoule.getPlace(4).getCompetitor().getName()).to.equal('8');

        const losersPoule = rootRound.getChild(QualifyGroup.LOSERS, 1).getPoule(1);

        expect(losersPoule.getPlace(1).getFromQualifyRule().isMultiple()).to.equal(true);
        expect(losersPoule.getPlace(1).getCompetitor().getName()).to.not.equal(undefined);
        expect(losersPoule.getPlace(2).getFromQualifyRule().isSingle()).to.equal(true);
        expect(losersPoule.getPlace(2).getCompetitor()).to.not.equal(undefined);
        expect(losersPoule.getPlace(3).getFromQualifyRule().isSingle()).to.equal(true);
        expect(losersPoule.getPlace(3).getCompetitor()).to.not.equal(undefined);
        expect(losersPoule.getPlace(4).getFromQualifyRule().isSingle()).to.equal(true);
        expect(losersPoule.getPlace(4).getCompetitor()).to.not.equal(undefined);

    });

    it('2 roundnumbers, nine places, multiple rule, not played', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService(getDefaultStructureOptions());
        const structure = structureService.create(competition, 9);
        const rootRound: Round = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.removePoule(rootRound.getChild(QualifyGroup.WINNERS, 1));

        const pouleOne = rootRound.getPoule(1);
        jsonGames3Places.forEach(jsonGames => getGameMapper().toObject(jsonGames, pouleOne));
        for (let nr = 1; nr <= pouleOne.getPlaces().length; nr++) {
            const competitor = new Competitor(competition.getLeague().getAssociation(), '' + nr);
            pouleOne.getPlace(nr).setCompetitor(competitor);
        }
        const pouleTwo = rootRound.getPoule(2);
        jsonGames3Places.forEach(jsonGames => getGameMapper().toObject(jsonGames, pouleTwo));
        for (let nr = 1; nr <= pouleTwo.getPlaces().length; nr++) {
            const competitor = new Competitor(competition.getLeague().getAssociation(), '' + (pouleOne.getPlaces().length + nr));
            pouleTwo.getPlace(nr).setCompetitor(competitor);
        }
        const pouleThree = rootRound.getPoule(3);
        jsonGames3Places.forEach(jsonGames => getGameMapper().toObject(jsonGames, pouleThree));
        for (let nr = 1; nr <= pouleThree.getPlaces().length; nr++) {
            const name = '' + (pouleOne.getPlaces().length + pouleTwo.getPlaces().length + nr);
            const competitor = new Competitor(competition.getLeague().getAssociation(), name);
            pouleThree.getPlace(nr).setCompetitor(competitor);
        }

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

        expect(winnersPoule.getPlace(4).getCompetitor()).to.equal(undefined);
    });
});
