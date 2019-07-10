import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Game, PlanningService, StructureService, Field, NameService } from '../../../public_api';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';

describe('Planning/Service', () => {

    it('game creation default', () => {
        // const competitionMapper = getMapper('competition');
        // const competition = competitionMapper.toObject(jsonCompetition);

        // const structureService = new StructureService();
        // const structure = structureService.create(competition, 9, 3);
        // const rootRound = structure.getRootRound();

        // const planningService = new PlanningService(competition);
        // planningService.create(rootRound.getNumber());

        // expect(rootRound.getGames().length).to.equal(9);
    });

    /**
     * with one poule referee can be from same poule
     */
    it('self referee 1 poule of 3', () => {
        // const competitionMapper = getMapper('competition');
        // const competition = competitionMapper.toObject(jsonCompetition);
        // const field2 = new Field( competition, 2 ); field2.setSport(competition.getFirstSportConfig().getSport());

        // const structureService = new StructureService();
        // const structure = structureService.create(competition, 3, 1);
        // const rootRound = structure.getRootRound();
        // rootRound.getNumber().getPlanningConfig().setSelfReferee(true);

        // const planningService = new PlanningService(competition);
        // planningService.create(rootRound.getNumber());

        // const games = planningService.getGamesForRoundNumber( rootRound.getNumber(), Game.ORDER_RESOURCEBATCH );

        // expect(games.length).to.equal(3);
        // const firstGame = games.shift();
        // expect(firstGame.getResourceBatch()).to.equal(1);
        // expect(firstGame.getRefereePlace()).to.equal(firstGame.getPoule().getPlace(1));
        // expect(games.shift().getResourceBatch()).to.equal(2);
        // expect(games.shift().getResourceBatch()).to.equal(3);
    });

    /**
     * games should be ordered by roundnumber, subnumber because if sorted by poule
     * the planning is not optimized.
     * If all competitors of poule A play first and there are still fields free
     * than they cannot be referee. This will be most bad when there are two poules.
     */
    it('self referee 2 poules 12 competitors, 4 fields', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);
        const field2 = new Field( competition, 2 ); field2.setSport(competition.getFirstSportConfig().getSport());
        const field3 = new Field( competition, 3 ); field3.setSport(competition.getFirstSportConfig().getSport());
        const field4 = new Field( competition, 4 ); field4.setSport(competition.getFirstSportConfig().getSport());

        const structureService = new StructureService();
        const structure = structureService.create(competition, 12, 2);
        const rootRound = structure.getRootRound();
        rootRound.getNumber().getPlanningConfig().setSelfReferee(true);

        const planningService = new PlanningService(competition);
        planningService.create(rootRound.getNumber());

        const nameService = new NameService();
        const games = planningService.getGamesForRoundNumber( rootRound.getNumber(), Game.ORDER_RESOURCEBATCH );
        games.forEach( game => {
            console.log( game.getResourceBatch() + ' '
            + ' p ' + game.getPoule().getNumber() + ' p '
            + nameService.getPlacesFromName(game.getPlaces(Game.HOME), false, false)
            + ' vs ' + nameService.getPlacesFromName(game.getPlaces(Game.AWAY), false, false)
            + ' r ' + nameService.getPlaceFromName(game.getRefereePlace(), false, false)
            );
        });
        // expect(games.length).to.equal(30);

        // expect(games.shift().getResourceBatch()).to.equal(1);
        // expect(games.shift().getResourceBatch()).to.equal(1);
        // expect(games.shift().getResourceBatch()).to.equal(1);
        // expect(games.shift().getResourceBatch()).to.equal(1);
        // expect(games.pop().getResourceBatch()).to.equal(8);
        // expect(games.pop().getResourceBatch()).to.equal(8);
        // expect(games.pop().getResourceBatch()).to.equal(7);
    });
});
