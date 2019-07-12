import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Field, Game, Sport, NameService, PlanningService, StructureService, SportConfigService } from '../../../public_api';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { GameGenerator } from '../../../src/planning/gamegenerator';


describe('Planning/GameGenerator', () => {

    /**
     * with one poule referee can be from same poule
     */
    it('one sport(nrOfGames=2) 44', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 8, 2);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getValidPlanningConfig().setNrOfHeadtohead(2);

        const gameGenerator = new GameGenerator();
        gameGenerator.create(firstRoundNumber);
        const games = firstRoundNumber.getGames();
        expect(games.length).to.equal(24);
        // const firstGame = games.shift();
        // expect(firstGame.getResourceBatch()).to.equal(1);
        // expect(firstGame.getRefereePlace()).to.equal(firstGame.getPoule().getPlace(1));
        // expect(games.shift().getResourceBatch()).to.equal(2);
        // expect(games.shift().getResourceBatch()).to.equal(3);
    });

    /**
     * with one poule referee can be from same poule
     */
    it('two sports 4', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const sport2 = new Sport('sport 2');
        const sportConfigService = new SportConfigService();
        sportConfigService.createDefault(sport2, competition);
        const field2 = new Field(competition, 2); field2.setSport(sport2);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const gameGenerator = new GameGenerator();
        gameGenerator.create(firstRoundNumber);
        const games = firstRoundNumber.getGames();
        expect(games.length).to.equal(4);
        // const firstGame = games.shift();
        // expect(firstGame.getResourceBatch()).to.equal(1);
        // expect(firstGame.getRefereePlace()).to.equal(firstGame.getPoule().getPlace(1));
        // expect(games.shift().getResourceBatch()).to.equal(2);
        // expect(games.shift().getResourceBatch()).to.equal(3);
    });
});
