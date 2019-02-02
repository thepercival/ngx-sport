import { expect } from 'chai';

import { Game, PlanningService, PoulePlace } from '../../../public_api';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { jsonStructureGameGenerator } from '../../data/structure-gamegenerator';
import { jsonStructureGameGeneratorFive } from '../../data/structure-gamegenerator-five';

export function assertSameGame(game: Game, roundNr: number, subNr: number, home: PoulePlace[], away: PoulePlace[]) {
    expect(game.getRoundNumber()).to.equal(roundNr);
    expect(game.getSubNumber()).to.equal(subNr);
    expect(game.getPoulePlaces(Game.HOME).map(gamePoulePlace => gamePoulePlace.getPoulePlace().getNumber())).to.deep.equal(home);
    expect(game.getPoulePlaces(Game.AWAY).map(gamePoulePlace => gamePoulePlace.getPoulePlace().getNumber())).to.deep.equal(away);
}

describe('Planning/Service', () => {
    it('FourPoulePlacesTwoTimeHeadtohead', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructureGameGenerator, competition);

        const planningService = new PlanningService(competition);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getConfig().setNrOfHeadtoheadMatches(2);
        planningService.create(firstRoundNumber, competition.getStartDateTime());
        const games = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_BYNUMBER);
        expect(games.length).to.equal(12);

        let roundNr = 1; let subNr = 1;
        this.assertSameGame(games[0], roundNr, subNr, [1], [4]); subNr++;
        this.assertSameGame(games[1], roundNr, subNr, [2], [3]); roundNr++; subNr = 1;
        this.assertSameGame(games[2], roundNr, subNr, [1], [2]); subNr++;
        this.assertSameGame(games[3], roundNr, subNr, [3], [4]); roundNr++; subNr = 1;
        this.assertSameGame(games[4], roundNr, subNr, [1], [3]); subNr++;
        this.assertSameGame(games[5], roundNr, subNr, [4], [2]); roundNr++; subNr = 1;

        this.assertSameGame(games[6], roundNr, subNr, [4], [1]); subNr++;
        this.assertSameGame(games[7], roundNr, subNr, [3], [2]); roundNr++; subNr = 1;
        this.assertSameGame(games[8], roundNr, subNr, [2], [1]); subNr++;
        this.assertSameGame(games[9], roundNr, subNr, [4], [3]); roundNr++; subNr = 1;
        this.assertSameGame(games[10], roundNr, subNr, [3], [1]); subNr++;
        this.assertSameGame(games[11], roundNr, subNr, [2], [4]);
    });

    it('FourPoulePlacesTeamupHeadToHeadTwo', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructureGameGenerator, competition);

        const planningService = new PlanningService(competition);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getConfig().setNrOfHeadtoheadMatches(2);
        structure.getFirstRoundNumber().getConfig().setTeamup(true);
        planningService.create(firstRoundNumber, competition.getStartDateTime());
        const games = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_BYNUMBER);
        expect(games.length).to.equal(6);

        let roundNr = 1; let subNr = 1;
        this.assertSameGame(games[0], roundNr, subNr, [1, 4], [2, 3]); roundNr++;
        this.assertSameGame(games[1], roundNr, subNr, [1, 2], [3, 4]); roundNr++;
        this.assertSameGame(games[2], roundNr, subNr, [1, 3], [2, 4]); roundNr++;
        this.assertSameGame(games[3], roundNr, subNr, [3, 2], [4, 1]); roundNr++;
        this.assertSameGame(games[4], roundNr, subNr, [4, 3], [2, 1]); roundNr++;
        this.assertSameGame(games[5], roundNr, subNr, [4, 2], [3, 1]); roundNr++;
    });

    it('FivePoulePlacesTeamup', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructureGameGeneratorFive, competition);

        const planningService = new PlanningService(competition);
        const firstRoundNumber = structure.getFirstRoundNumber();
        planningService.create(firstRoundNumber, competition.getStartDateTime());
        const games = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_BYNUMBER);
        expect(games.length).to.equal(15);

        let roundNr = 1; let subNr = 1;
        // het lijkt erop dat het flatten niet vertical gaat!!!
        this.assertSameGame(games[0], roundNr, subNr, [2, 5], [3, 4]); roundNr++;
        this.assertSameGame(games[1], roundNr, subNr, [1, 2], [4, 5]); roundNr++;
        this.assertSameGame(games[2], roundNr, subNr, [4, 5], [2, 3]); roundNr++;
        this.assertSameGame(games[3], roundNr, subNr, [1, 3], [4, 5]); roundNr++;
        this.assertSameGame(games[4], roundNr, subNr, [4, 2], [3, 5]); roundNr++;
        this.assertSameGame(games[5], roundNr, subNr, [1, 4], [3, 5]); roundNr++;
        this.assertSameGame(games[6], roundNr, subNr, [1, 5], [3, 4]); roundNr++;
        this.assertSameGame(games[7], roundNr, subNr, [2, 5], [1, 3]); roundNr++;
        this.assertSameGame(games[8], roundNr, subNr, [3, 4], [1, 2]); roundNr++;
        this.assertSameGame(games[9], roundNr, subNr, [1, 3], [2, 4]); roundNr++;
        this.assertSameGame(games[10], roundNr, subNr, [1, 4], [2, 3]); roundNr++;
        this.assertSameGame(games[11], roundNr, subNr, [5, 3], [1, 2]); roundNr++;
        this.assertSameGame(games[12], roundNr, subNr, [1, 5], [2, 3]); roundNr++;
        this.assertSameGame(games[13], roundNr, subNr, [2, 5], [1, 4]); roundNr++;
        this.assertSameGame(games[14], roundNr, subNr, [4, 2], [1, 5]); roundNr++;
    });
});
