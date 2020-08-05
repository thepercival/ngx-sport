import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getCompetitionMapper } from '../../../helpers/mappers';
import { jsonBaseCompetition } from '../../../data/competition';
import { setScoreSingle } from '../../../helpers/setscores';
import { StructureService } from '../../../../src/structure/service';
import { Round } from '../../../../src/round';
import { Competitor } from '../../../../src/competitor';
import { EndRankingService } from '../../../../src/ranking/end/service';
import { RankingService } from '../../../../src/ranking/service';
import { QualifyGroup } from '../../../../src/qualify/group';
import { QualifyService } from '../../../../src/qualify/service';
import { createGames } from '../../../helpers/gamescreator';

describe('EndRankingService', () => {

    it('one poule of three places', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 3);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);
        for (let nr = 1; nr <= pouleOne.getPlaces().length; nr++) {
            const competitor = new Competitor(competition.getLeague().getAssociation(), '' + nr);
            pouleOne.getPlace(nr).setCompetitor(competitor);
        }
        createGames(structure.getFirstRoundNumber());
        setScoreSingle(pouleOne, 1, 2, 2, 1);
        setScoreSingle(pouleOne, 1, 3, 3, 1);
        setScoreSingle(pouleOne, 2, 3, 3, 2);

        const rankingService = new EndRankingService(structure, RankingService.RULESSET_WC);
        const items = rankingService.getItems();

        for (let rank = 1; rank <= items.length; rank++) {
            expect(items[rank - 1].getName()).to.equal('' + rank);
            expect(items[rank - 1].getUniqueRank()).to.equal(rank);
        }
    });

    it('one poule of three places, with no competitor', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 3);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);

        const competitor1 = new Competitor(competition.getLeague().getAssociation(), '1');
        const competitor2 = new Competitor(competition.getLeague().getAssociation(), '2');
        pouleOne.getPlace(1).setCompetitor(competitor1);
        pouleOne.getPlace(2).setCompetitor(competitor2);
        createGames(structure.getFirstRoundNumber());
        setScoreSingle(pouleOne, 1, 2, 2, 1);
        setScoreSingle(pouleOne, 1, 3, 3, 1);
        setScoreSingle(pouleOne, 2, 3, 3, 2);

        const rankingService = new EndRankingService(structure, RankingService.RULESSET_WC);
        const items = rankingService.getItems();

        expect(items[2].getName()).to.equal('onbekend');
    });

    it('one poule of three places, not played', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 3);
        const rootRound: Round = structure.getRootRound();

        const pouleOne = rootRound.getPoule(1);

        for (let nr = 1; nr <= pouleOne.getPlaces().length; nr++) {
            const competitor = new Competitor(competition.getLeague().getAssociation(), '' + nr);
            pouleOne.getPlace(nr).setCompetitor(competitor);
        }
        createGames(structure.getFirstRoundNumber());
        setScoreSingle(pouleOne, 1, 2, 2, 1);
        setScoreSingle(pouleOne, 1, 3, 3, 1);
        // setScoreSingle(pouleOne, 2, 3, 3, 2);

        const rankingService = new EndRankingService(structure, RankingService.RULESSET_WC);
        const items = rankingService.getItems();

        for (let rank = 1; rank <= items.length; rank++) {
            expect(items[rank - 1].getName()).to.equal('nog onbekend');
        }
    });

    it('2 roundnumbers, five places', () => {
        const competition = getCompetitionMapper().toObject(jsonBaseCompetition);

        const structureService = new StructureService([]);
        const structure = structureService.create(competition, 5);
        const rootRound: Round = structure.getRootRound();

        structureService.addQualifier(rootRound, QualifyGroup.WINNERS);
        structureService.addQualifier(rootRound, QualifyGroup.LOSERS);

        const pouleOne = rootRound.getPoule(1);
        for (let nr = 1; nr <= pouleOne.getPlaces().length; nr++) {
            const competitor = new Competitor(competition.getLeague().getAssociation(), '' + nr);
            pouleOne.getPlace(nr).setCompetitor(competitor);
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

        const winnersPoule = rootRound.getChild(QualifyGroup.WINNERS, 1).getPoule(1);
        const loserssPoule = rootRound.getChild(QualifyGroup.LOSERS, 1).getPoule(1);
        createGames(structure.getFirstRoundNumber().getNext());
        setScoreSingle(winnersPoule, 1, 2, 2, 1);
        setScoreSingle(loserssPoule, 1, 2, 2, 1);

        const qualifyService = new QualifyService(rootRound, RankingService.RULESSET_WC);
        qualifyService.setQualifiers();

        const rankingService = new EndRankingService(structure, RankingService.RULESSET_WC);
        const items = rankingService.getItems();

        for (let rank = 1; rank <= items.length; rank++) {
            expect(items[rank - 1].getName()).to.equal('' + rank);
        }
    });
});
