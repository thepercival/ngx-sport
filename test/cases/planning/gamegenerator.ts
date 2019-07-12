import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Place, Field, Game, Sport, NameService,
    PlanningService, StructureService, SportConfigService } from '../../../public_api';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { GameGenerator } from '../../../src/planning/gamegenerator';
import { PlanningGameRound } from '../../../src/planning/gameround';
import { PlaceCombination } from '../../../src/place/combination';


describe('Planning/GameGenerator', () => {

    it('one sport 4', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const gameGenerator = new GameGenerator();
        const firstPoule = structure.getRootRound().getPoule(1);
        const gameRounds = gameGenerator.createPoule(firstPoule, firstRoundNumber.getValidPlanningConfig().getTeamup() );

        let roundNr = 1; let subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [1], [4]); subNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [2], [3]); roundNr++; subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [2], [1]); subNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [4], [3]); roundNr++; subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [3], [1]); subNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [4], [2]);
    });

    /**
     * with one poule referee can be from same poule
     */
    it('one sport(nrOfHeadtohead=2) 44', () => {
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
    });

    it('one sport 4 teamup', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getValidPlanningConfig().setTeamup(true);

        const gameGenerator = new GameGenerator();
        const firstPoule = structure.getRootRound().getPoule(1);
        const gameRounds = gameGenerator.createPoule(firstPoule, firstRoundNumber.getValidPlanningConfig().getTeamup() );

        let roundNr = 1; const subNr = 1;
        this.assertSameGame(gameRounds, roundNr, subNr, [1, 4], [2, 3]); roundNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [2, 1], [3, 4]); roundNr++;
        this.assertSameGame(gameRounds, roundNr, subNr, [3, 1], [2, 4]);
    });

    it('one sport 5 teamup', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 5, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getValidPlanningConfig().setTeamup(true);

        const gameGenerator = new GameGenerator();
        gameGenerator.create(firstRoundNumber );

        expect(firstRoundNumber.getGames().length).to.equal(15);
    });

    it('one sport 6 teamup', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 6, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getValidPlanningConfig().setTeamup(true);

        const gameGenerator = new GameGenerator();
        gameGenerator.create(firstRoundNumber );

        expect(firstRoundNumber.getGames().length).to.equal(45);
    });

    it('two sports 6', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);
        const sport2 = new Sport('sport2');
        const sportConfigService = new SportConfigService();
        sportConfigService.createDefault(sport2, competition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 6, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const gameGenerator = new GameGenerator();
        gameGenerator.create(firstRoundNumber );

        expect(firstRoundNumber.getGames().length).to.equal(6);
    });

    // @TODO 
    // wat te doen als sommige deelnemers meer als 1x een sport moeten doen
    // om iedereen ook elke sport 1x te laten doen???
    // bijvoorbeeld met teamup of met een oneven aantal deelnemers per team????
    it('two sports 6 teamup', () => {
        // const competitionMapper = getMapper('competition');
        // const competition = competitionMapper.toObject(jsonCompetition);
        // const sport2 = new Sport('sport2');
        // const sportConfigService = new SportConfigService();
        // sportConfigService.createDefault(sport2, competition);

        // const structureService = new StructureService();
        // const structure = structureService.create(competition, 6, 1);
        // const firstRoundNumber = structure.getFirstRoundNumber();
        // firstRoundNumber.getValidPlanningConfig().setTeamup(true);

        // const gameGenerator = new GameGenerator();
        // gameGenerator.create(firstRoundNumber );

        // expect(firstRoundNumber.getGames().length).to.equal(6);
    });
});

export function assertSameGame(gameRounds: PlanningGameRound[], roundNr: number, subNr: number, home: Place[], away: Place[]) {
    const combination: PlaceCombination = gameRounds[roundNr - 1].getCombinations()[subNr - 1];
    expect(combination.getHome().map(place => place.getNumber())).to.deep.equal(home);
    expect(combination.getAway().map(place => place.getNumber())).to.deep.equal(away);
}
