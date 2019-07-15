import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
    Field,
    Place,
    Sport,
    SportConfigService,
    SportPlanningConfigService,
    SportScoreConfigService,
    StructureService,
} from '../../../public_api';
import { PlaceCombination } from '../../../src/place/combination';
import { GameGenerator } from '../../../src/planning/gamegenerator';
import { PlanningGameRound } from '../../../src/planning/gameround';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';


describe('Planning/GameGenerator', () => {

    it('one sport 4', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const gameGenerator = new GameGenerator();
        const firstPoule = structure.getRootRound().getPoule(1);
        const gameRounds = gameGenerator.createPouleGameRounds(firstPoule, firstRoundNumber.getValidPlanningConfig().getTeamup());

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
        const gameRounds = gameGenerator.createPouleGameRounds(firstPoule, firstRoundNumber.getValidPlanningConfig().getTeamup());

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
        gameGenerator.create(firstRoundNumber);

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
        gameGenerator.create(firstRoundNumber);

        expect(firstRoundNumber.getGames().length).to.equal(45);

        check if every place has the same amount of games
        check if one place is not two times in one game
        // for planning : add selfreferee if is this enables

    });

    it('two sports(sport2 => minNrOfGames = 3), 4', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);
        const sport2 = new Sport('sport2');
        const sportConfigService = new SportConfigService(new SportScoreConfigService(), new SportPlanningConfigService());
        sportConfigService.createDefault(sport2, competition);
        const field2 = new Field(competition, 2); field2.setSport(sport2);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getSportPlanningConfig(sport2).setMinNrOfGames(3);

        const gameGenerator = new GameGenerator();
        gameGenerator.create(firstRoundNumber);

        expect(firstRoundNumber.getGames().length).to.equal(12);
    });

    it('two sports(sport2 => minNrOfGames = 2), teamup, 4', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);
        const sport2 = new Sport('sport2');
        const sportConfigService = new SportConfigService(new SportScoreConfigService(), new SportPlanningConfigService());
        sportConfigService.createDefault(sport2, competition);
        const field2 = new Field(competition, 2); field2.setSport(sport2);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getSportPlanningConfig(sport2).setMinNrOfGames(2);
        firstRoundNumber.getPlanningConfig().setTeamup(true);

        const gameGenerator = new GameGenerator();
        gameGenerator.create(firstRoundNumber);

        expect(firstRoundNumber.getGames().length).to.equal(3);
    });
});

export function assertSameGame(gameRounds: PlanningGameRound[], roundNr: number, subNr: number, home: Place[], away: Place[]) {
    const combination: PlaceCombination = gameRounds[roundNr - 1].getCombinations()[subNr - 1];
    expect(combination.getHome().map(place => place.getNumber())).to.deep.equal(home);
    expect(combination.getAway().map(place => place.getNumber())).to.deep.equal(away);
}
