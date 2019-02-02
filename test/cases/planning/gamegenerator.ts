import { expect } from 'chai';

import { GameGenerator } from '../../../src/planning/gamegenerator';
import { PlanningGameRound } from '../../../src/planning/gameround';
import { PoulePlace } from '../../../src/pouleplace';
import { PoulePlaceCombination } from '../../../src/pouleplace/combination';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { jsonStructureGameGenerator } from '../../data/structure-gamegenerator';


export function assertSameGame(gameRounds: PlanningGameRound[], roundNr: number, subNr: number, home: PoulePlace[], away: PoulePlace[]) {
    const combination: PoulePlaceCombination = gameRounds[roundNr - 1].getCombinations()[subNr - 1];
    expect(combination.getHome().map(poulePlace => poulePlace.getNumber())).to.deep.equal(home);
    expect(combination.getAway().map(poulePlace => poulePlace.getNumber())).to.deep.equal(away)
}

describe('Planning/GameGenerator', () => {
    it('FourPoulePlaces', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructureGameGenerator, competition);

        const gameGenerator = new GameGenerator(structure.getRootRound().getPoules()[0]);
        const gameRounds = gameGenerator.generate(structure.getFirstRoundNumber().getConfig().getTeamup());

        let roundNr = 1; let subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [1], [4]); subNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [2], [3]); roundNr++; subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [1], [2]); subNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [3], [4]); roundNr++; subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [1], [3]); subNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [4], [2]);
    });

    it('FourPoulePlacesTeamup', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructureGameGenerator, competition);

        const gameGenerator = new GameGenerator(structure.getRootRound().getPoules()[0]);
        structure.getFirstRoundNumber().getConfig().setTeamup(true);
        const gameRounds = gameGenerator.generate(structure.getFirstRoundNumber().getConfig().getTeamup());

        let roundNr = 1; let subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [1, 4], [2, 3]); roundNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [1, 2], [3, 4]); roundNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [1, 3], [2, 4]);
    });
});
