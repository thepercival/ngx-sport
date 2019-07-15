import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Field, Game, NameService, PlanningService, StructureService } from '../../../public_api';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';


describe('Planning/Service', () => {

    it('game creation default', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 9, 3);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const planningService = new PlanningService(competition);
        planningService.create(firstRoundNumber);

        expect(firstRoundNumber.getGames().length).to.equal(9);
    });

    /**
     * with one poule referee can be from same poule
     */
    it('self referee 1 poule of 3', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);
        const field2 = new Field(competition, 2); field2.setSport(competition.getFirstSportConfig().getSport());

        const structureService = new StructureService();
        const structure = structureService.create(competition, 3, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getPlanningConfig().setSelfReferee(true);

        const planningService = new PlanningService(competition);
        planningService.create(firstRoundNumber);

        const games = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);

        expect(games.length).to.equal(3);
        const firstGame = games.shift();
        expect(firstGame.getResourceBatch()).to.equal(1);
        expect(firstGame.getRefereePlace()).to.equal(firstGame.getPoule().getPlace(1));
        expect(games.shift().getResourceBatch()).to.equal(2);
        expect(games.shift().getResourceBatch()).to.equal(3);
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
        const field2 = new Field(competition, 2); field2.setSport(competition.getFirstSportConfig().getSport());
        const field3 = new Field(competition, 3); field3.setSport(competition.getFirstSportConfig().getSport());
        const field4 = new Field(competition, 4); field4.setSport(competition.getFirstSportConfig().getSport());

        const structureService = new StructureService();
        const structure = structureService.create(competition, 12, 2);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getPlanningConfig().setSelfReferee(true);

        const planningService = new PlanningService(competition);
        planningService.create(firstRoundNumber);

        const nameService = new NameService();
        const games = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);
        games.forEach(game => {
            console.log(
                'poule ' + game.getPoule().getNumber()
                + ', ' + nameService.getPlacesFromName(game.getPlaces(Game.HOME), false, false)
                + ' vs ' + nameService.getPlacesFromName(game.getPlaces(Game.AWAY), false, false)
                + ' , ref ' + (game.getRefereePlace() ? nameService.getPlaceFromName(game.getRefereePlace(), false, false) : '')
                + ', batch ' + game.getResourceBatch()
                + ', field ' + game.getField().getNumber()
                + ', sport ' + game.getField().getSport().getCustomId()
            );
        });
        expect(games.length).to.equal(30);

        expect(games.shift().getResourceBatch()).to.equal(1);
        expect(games.shift().getResourceBatch()).to.equal(1);
        expect(games.shift().getResourceBatch()).to.equal(1);
        expect(games.shift().getResourceBatch()).to.equal(1);
        expect(games.pop().getResourceBatch()).to.be.lessThan(9);

        // do this for two roundnumbers!!
        // 'startDateTime': '2030-01-01T12:00:00.000Z',
        // PlanningConfigService.getDefaultMinutesPerGame() : 20
        // PlanningConfigService.getDefaultMinutesPerGameExt():
        // PlanningConfigService.getDefaultMinutesBetweenGames(): 5
        // (8 * 20) + ((8-1) * 5) = 195 min. => '2030-01-01T15:15:00.000Z'
        // const expectedEndDate = new Date('2030-01-01T15:15:00.000Z');
        // expect(planningService.calculateStartDateTime(firstRoundNumber).getTime()).to.equal(expectedEndDate.getTime());
    });



    // ga hier 2 sporten test en nog meer om de planningservice coverage 100 % te krijgen!!

    // it('recursive', () => {
    //     const numbers = [1, 2, 3, 4, 5, 6];
    //     const nrOfItemsPerBatch = 3;

    //     const itemSuccess = (newNumber: number): boolean => {
    //         return (newNumber % 2) === 1;
    //     };
    //     const endSuccess = (batch: number[]): boolean => {
    //         if (nrOfItemsPerBatch < batch.length) {
    //             return false;
    //         }
    //         let sum = 0;
    //         batch.forEach(number => sum += number);
    //         return sum === 9;
    //     };

    //     const showC = (list: number[], batch: number[] = []): boolean => {
    //         if (endSuccess(batch)) {
    //             console.log(batch);
    //             return true;
    //         }
    //         if (list.length + batch.length < nrOfItemsPerBatch) {
    //             return false;
    //         }
    //         const numberToTry = list.shift();
    //         if (itemSuccess(numberToTry)) {
    //             batch.push(numberToTry);
    //             if (showC(list.slice(), batch) === true) {
    //                 return true;
    //             }
    //             batch.pop();
    //             return showC(list, batch);

    //         }
    //         return showC(list, batch);
    //     };

    //     if (!showC(numbers)) {
    //         console.log('no combinations found');
    //     };
    // });
});
