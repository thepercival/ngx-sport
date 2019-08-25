import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
    Competition,
    Field,
    Sport,
    SportConfigService,
    SportPlanningConfigService,
    SportScoreConfigService,
    StructureService,
} from '../../../../public_api';
import { SportIdToNumberMap } from '../../../../src/sport/counter';
import { getMapper } from '../../../createmapper';
import { jsonCompetition } from '../../../data/competition';


describe('Sport/PlanningConfig/Service', () => {

    it('createDefault', () => {
        const competitionMapper = getMapper('competition');
        const competition: Competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        // structureService.create calls createDefault
        expect(firstRoundNumber.getSportPlanningConfigs().length).to.equal(1);
    });

    it('copy', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const service = new SportPlanningConfigService();
        const sport2 = new Sport('sport 2');
        const sourceConfig = firstRoundNumber.getFirstSportPlanningConfig();
        const newConfig = service.copy(sport2, firstRoundNumber, sourceConfig);

        expect(newConfig.getMinNrOfGames()).to.equal(sourceConfig.getMinNrOfGames());
        expect(firstRoundNumber.getSportPlanningConfigs().length).to.equal(2);
        // could check on not same sport to copy
    });

    it('getUsed', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const service = new SportPlanningConfigService();

        expect(service.getUsed(firstRoundNumber).length).to.equal(1);

        const sport2 = new Sport('sport 2');
        const sourceConfig = firstRoundNumber.getFirstSportPlanningConfig();
        const newConfig = service.copy(sport2, firstRoundNumber, sourceConfig);

        expect(service.getUsed(firstRoundNumber).length).to.equal(1);

        const field2 = new Field(competition, 2); field2.setSport(sport2);

        expect(service.getUsed(firstRoundNumber).length).to.equal(2);
    });

    it('getNrOfCombinations', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 6, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getValidPlanningConfig().setTeamup(true);

        const service = new SportPlanningConfigService();

        let teamup = false;
        expect(service.getNrOfCombinations(2, teamup)).to.equal(1);
        expect(service.getNrOfCombinations(3, teamup)).to.equal(3);
        expect(service.getNrOfCombinations(4, teamup)).to.equal(6);
        expect(service.getNrOfCombinations(5, teamup)).to.equal(10);
        expect(service.getNrOfCombinations(6, teamup)).to.equal(15);

        teamup = true;
        expect(service.getNrOfCombinations(4, teamup)).to.equal(3);
        expect(service.getNrOfCombinations(5, teamup)).to.equal(15);
        expect(service.getNrOfCombinations(6, teamup)).to.equal(45);
    });

    it('getNrOfGamesPerPlace 54', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 9, 2);
        const firstRoundNumber = structure.getFirstRoundNumber();


        const service = new SportPlanningConfigService();

        const sport2 = new Sport('sport 2');
        const sourceConfig = firstRoundNumber.getFirstSportPlanningConfig();
        const newConfig = service.copy(sport2, firstRoundNumber, sourceConfig);

        const firstPoule = structure.getRootRound().getPoule(1);
        const secondPoule = structure.getRootRound().getPoule(2);

        expect(service.getNrOfGamesPerPlace(firstPoule)).to.equal(4);
        expect(service.getNrOfGamesPerPlace(secondPoule)).to.equal(3);

        firstRoundNumber.getValidPlanningConfig().setTeamup(true);
        expect(service.getNrOfGamesPerPlace(firstPoule)).to.equal(12);
        expect(service.getNrOfGamesPerPlace(secondPoule)).to.equal(3);
    });

    it('getNrOfGamesPerPlace 6', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 6, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();


        const service = new SportPlanningConfigService();

        const sport2 = new Sport('sport 2');
        const sourceConfig = firstRoundNumber.getFirstSportPlanningConfig();
        const newConfig = service.copy(sport2, firstRoundNumber, sourceConfig);

        const firstPoule = structure.getRootRound().getPoule(1);

        expect(service.getNrOfGamesPerPlace(firstPoule)).to.equal(5);
        firstRoundNumber.getValidPlanningConfig().setTeamup(true);
        expect(service.getNrOfGamesPerPlace(firstPoule)).to.equal(30);
    });

    it('getNrOfGamesPerPlace 3', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 3, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getValidPlanningConfig().setTeamup(true);

        const service = new SportPlanningConfigService();

        const firstPoule = structure.getRootRound().getPoule(1);

        expect(service.getNrOfGamesPerPlace(firstPoule)).to.equal(0);
    });

    it('getNrOfHeadtohead', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getValidPlanningConfig().setTeamup(true);

        const service = new SportPlanningConfigService();

        const sport2 = new Sport('sport 2');
        const sportConfigService = new SportConfigService(
            new SportScoreConfigService(), new SportPlanningConfigService()
        );
        sportConfigService.createDefault(sport2, competition, structure);
        const field2 = new Field(competition, 2); field2.setSport(sport2);
        firstRoundNumber.getSportPlanningConfig(sport2).setMinNrOfGames(2);
        const firstPoule = structure.getRootRound().getPoule(1);

        const sportPlanningConfigs = service.getUsed(firstRoundNumber);
        const nrOfHeadtohead = service.getNrOfHeadtohead(firstPoule, sportPlanningConfigs);
        expect(nrOfHeadtohead).to.equal(1);

        firstRoundNumber.getSportPlanningConfig(sport2).setMinNrOfGames(3);

        const nrOfHeadtohead2 = service.getNrOfHeadtohead(firstPoule, sportPlanningConfigs);
        expect(nrOfHeadtohead2).to.equal(2);

        firstRoundNumber.getValidPlanningConfig().setNrOfHeadtohead(3);
        const nrOfHeadtohead3 = service.getNrOfHeadtohead(firstPoule, sportPlanningConfigs);
        expect(nrOfHeadtohead3).to.equal(2);

    });

    it('getMinNrOfGamesMap multiple sports', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 5, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getValidPlanningConfig().setTeamup(true);

        const service = new SportPlanningConfigService();

        const sport2 = new Sport('sport 2');
        const sourceConfig = firstRoundNumber.getFirstSportPlanningConfig();
        const newConfig = service.copy(sport2, firstRoundNumber, sourceConfig);

        const firstPoule = structure.getRootRound().getPoule(1);

        const map: SportIdToNumberMap = service.getMinNrOfGamesMap(firstPoule, firstRoundNumber.getSportPlanningConfigs());

        firstRoundNumber.getSportPlanningConfigs().forEach(config => {
            expect(map[config.getSport().getId()]).to.not.equal(undefined);
        });
    });

    it('getMinNrOfGamesMap single sport', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 6, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const firstPoule = structure.getRootRound().getPoule(1);

        const service = new SportPlanningConfigService();
        const map: SportIdToNumberMap = service.getMinNrOfGamesMap(firstPoule, firstRoundNumber.getSportPlanningConfigs());
        firstRoundNumber.getSportPlanningConfigs().forEach(config => {
            expect(map[config.getSport().getId()]).to.equal(5);
        });

        firstRoundNumber.getValidPlanningConfig().setNrOfHeadtohead(2);
        const map2: SportIdToNumberMap = service.getMinNrOfGamesMap(firstPoule, firstRoundNumber.getSportPlanningConfigs());
        firstRoundNumber.getSportPlanningConfigs().forEach(config => {
            expect(map2[config.getSport().getId()]).to.equal(10);
        });
    });
});





