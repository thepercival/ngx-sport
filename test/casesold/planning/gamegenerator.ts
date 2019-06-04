import { expect } from 'chai';
import { describe, it } from 'mocha';

import { GameGenerator } from '../../../src/planning/gamegenerator';
import { PlanningGameRound } from '../../../src/planning/gameround';
import { Place } from '../../../src/place';
import { PlaceCombination } from '../../../src/place/combination';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { jsonStructureGameGenerator } from '../../data/structure-gamegenerator';


export function assertSameGame(gameRounds: PlanningGameRound[], roundNr: number, subNr: number, home: Place[], away: Place[]) {
    const combination: PlaceCombination = gameRounds[roundNr - 1].getCombinations()[subNr - 1];
    expect(combination.getHome().map(place => place.getNumber())).to.deep.equal(home);
    expect(combination.getAway().map(place => place.getNumber())).to.deep.equal(away)
}

describe('Planning/GameGenerator', () => {
    it('FourPlaces', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructureGameGenerator, competition);

        const gameGenerator = new GameGenerator(structure.getRootRound().getPoules()[0]);
        const gameRounds = gameGenerator.generate(structure.getFirstRoundNumber().getConfig().getTeamup());

        let roundNr = 1; let subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [1], [4]); subNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [2], [3]); roundNr++; subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [2], [1]); subNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [4], [3]); roundNr++; subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [3], [1]); subNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [4], [2]);
    });

    it('FourPlacesTeamup', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructureGameGenerator, competition);

        const gameGenerator = new GameGenerator(structure.getRootRound().getPoules()[0]);
        structure.getFirstRoundNumber().getConfig().setTeamup(true);
        const gameRounds = gameGenerator.generate(structure.getFirstRoundNumber().getConfig().getTeamup());

        let roundNr = 1; let subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [1, 4], [2, 3]); roundNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [2, 1], [3, 4]); roundNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [3, 1], [2, 4]);
    });
});
