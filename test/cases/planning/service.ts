import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
    Competition,
    Field,
    Game,
    NameService,
    Place,
    PlanningService,
    QualifyGroup,
    Sport,
    SportConfigService,
    SportPlanningConfigService,
    SportScoreConfigService,
    StructureService,
} from '../../../public_api';
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
        assertValidResourcesPerBatch(firstRoundNumber.getGames());
        firstRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, firstRoundNumber.getGames(), 2);
        });
    });

    // with one poule referee can be from same poule
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

        assertValidResourcesPerBatch(firstRoundNumber.getGames());
        firstRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, firstRoundNumber.getGames(), 2);
        });
    });

    // games should be ordered by roundnumber, subnumber because if sorted by poule
    // the planning is not optimized.
    // If all competitors of poule A play first and there are still fields free
    // than they cannot be referee. This will be most bad when there are two poules.
    it('self referee 4 fields, 66', () => {
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

        const games = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);
        // consoleGames(games);
        expect(games.length).to.equal(30);

        expect(games.shift().getResourceBatch()).to.equal(1);
        expect(games.shift().getResourceBatch()).to.equal(1);
        expect(games.shift().getResourceBatch()).to.equal(1);
        expect(games.shift().getResourceBatch()).to.equal(1);
        expect(games.pop().getResourceBatch()).to.be.lessThan(9);

        assertValidResourcesPerBatch(firstRoundNumber.getGames());
        firstRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, firstRoundNumber.getGames(), 5);
        });
    });

    it('2 fields 2 sports, 3', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);
        const sportConfigService = new SportConfigService(new SportScoreConfigService(), new SportPlanningConfigService());
        const sport2 = addSport(competition);
        const field2 = new Field(competition, 2); field2.setSport(sport2);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 3, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const planningService = new PlanningService(competition);
        planningService.create(firstRoundNumber);

        const games1 = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);
        // consoleGames(games1);
        expect(games1.length).to.equal(6);
        assertValidResourcesPerBatch(games1);
        firstRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, games1, 4);
        });
        expect(games1.pop().getResourceBatch()).to.be.lessThan(7);
    });

    it('3 fields 3 sports, 4', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);
        const sportConfigService = new SportConfigService(new SportScoreConfigService(), new SportPlanningConfigService());
        const sport2 = addSport(competition);
        const field2 = new Field(competition, 2); field2.setSport(sport2);
        const sport3 = addSport(competition);
        const field3 = new Field(competition, 3); field3.setSport(sport3);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const planningService = new PlanningService(competition);

        planningService.create(firstRoundNumber);
        const games1 = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);
        // consoleGames(games);
        expect(games1.length).to.equal(6);
        assertValidResourcesPerBatch(games1);
        firstRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, games1, 3);
        });
        expect(games1.pop().getResourceBatch()).to.be.lessThan(7);

        firstRoundNumber.getValidPlanningConfig().setNrOfHeadtohead(2);
        planningService.create(firstRoundNumber);
        const games2 = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);
        // consoleGames(games2);
        expect(games2.length).to.equal(12);
        assertValidResourcesPerBatch(games2);
        firstRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, games2, 6);
        });
        expect(games2.pop().getResourceBatch()).to.be.lessThan(7);

        firstRoundNumber.getValidPlanningConfig().setNrOfHeadtohead(3);
        planningService.create(firstRoundNumber);
        const games3 = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);
        // consoleGames(games);
        expect(games3.length).to.equal(18);

        assertValidResourcesPerBatch(games3);
        firstRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, games3, 9);
        });
    });

    it('2 fields 2 sports, 5', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);
        const sportConfigService = new SportConfigService(new SportScoreConfigService(), new SportPlanningConfigService());
        const sport2 = addSport(competition);
        const field2 = new Field(competition, 2); field2.setSport(sport2);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 5, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const planningService = new PlanningService(competition);
        planningService.create(firstRoundNumber);

        const games1 = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);
        // consoleGames(games1);
        expect(games1.length).to.equal(10);
        assertValidResourcesPerBatch(games1);
        firstRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, games1, 4);
        });
        expect(games1.pop().getResourceBatch()).to.be.lessThan(6);
    });

    // should not be possible, fields determine nrofsports
    // it('2 sports(1 & 3 fields), 5', () => {
    //     const competitionMapper = getMapper('competition');
    //     const competition = competitionMapper.toObject(jsonCompetition);
    //     const sportConfigService = new SportConfigService(new SportScoreConfigService(), new SportPlanningConfigService());
    //     const sport2 = addSport(competition);
    //     const field2 = new Field(competition, 2); field2.setSport(sport2);
    //     const field3 = new Field(competition, 3); field3.setSport(sport2);
    //     const field4 = new Field(competition, 4); field4.setSport(sport2);

    //     const structureService = new StructureService();
    //     const structure = structureService.create(competition, 5, 1);
    //     const firstRoundNumber = structure.getFirstRoundNumber();

    //     const planningService = new PlanningService(competition);
    //     planningService.create(firstRoundNumber);

    //     const games = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);
    //     // consoleGames(games1);
    //     expect(games.length).to.equal(10);
    //     assertValidResourcesPerBatch(games);
    //     firstRoundNumber.getPlaces().forEach(place => {
    //         this.assertValidGamesParticipations(place, games, 4);
    //     });
    //     expect(games.pop().getResourceBatch()).to.be.lessThan(6);
    // });

    it('2 fields check games in row, 6', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);
        const field2 = new Field(competition, 2); field2.setSport(competition.getFirstSportConfig().getSport());

        const structureService = new StructureService();
        const structure = structureService.create(competition, 6, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const planningService = new PlanningService(competition);
        planningService.create(firstRoundNumber);

        const games = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);
        // consoleGames(games);
        expect(games.length).to.equal(15);
        assertValidResourcesPerBatch(games);
        firstRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, games, 5);
            this.assertGamesInRow(place, games, 3);
        });
        expect(games.pop().getResourceBatch()).to.be.lessThan(9);
    });

    it('check datetime, 5', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);
        const sportConfigService = new SportConfigService(new SportScoreConfigService(), new SportPlanningConfigService());
        const sport2 = addSport(competition);
        const field2 = new Field(competition, 2); field2.setSport(sport2);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 5, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();

        const planningService = new PlanningService(competition);
        planningService.create(firstRoundNumber);

        const games1 = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);
        // consoleGames(games1);
        expect(games1.length).to.equal(10);
        assertValidResourcesPerBatch(games1);
        firstRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, games1, 4);
        });

        const lastGame = games1.pop();
        expect(lastGame.getResourceBatch()).to.equal(5);

        const endDateTime = planningService.calculateEndDateTime(firstRoundNumber);
        const nrOfMinutes = firstRoundNumber.getValidPlanningConfig().getMaximalNrOfMinutesPerGame();
        const lastGameStartDateTime = lastGame.getStartDateTime();
        lastGameStartDateTime.setMinutes(lastGameStartDateTime.getMinutes() + nrOfMinutes);
        expect(lastGameStartDateTime.getTime()).to.equal(endDateTime.getTime());
    });


    /**
     * time disabled
     */
    it('time disabled 4', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);
        const field2 = new Field(competition, 2); field2.setSport(competition.getFirstSportConfig().getSport());

        const structureService = new StructureService();
        const structure = structureService.create(competition, 4, 1);
        const firstRoundNumber = structure.getFirstRoundNumber();
        firstRoundNumber.getPlanningConfig().setEnableTime(false);

        const planningService = new PlanningService(competition);
        planningService.create(firstRoundNumber);
        planningService.reschedule(firstRoundNumber);

        const games = planningService.getGamesForRoundNumber(firstRoundNumber, Game.ORDER_RESOURCEBATCH);
        // consoleGames(games);
        expect(games.length).to.equal(6);

        assertValidResourcesPerBatch(firstRoundNumber.getGames());
        firstRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, firstRoundNumber.getGames(), 3);
        });
    });

    /**
     * time disabled
     */
    it('second round losers before winners, 44', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 8, 2);
        const firstRoundNumber = structure.getFirstRoundNumber();
        const rootRound = structure.getRootRound();

        structureService.addQualifiers(rootRound, QualifyGroup.WINNERS, 2);
        structureService.addQualifiers(rootRound, QualifyGroup.LOSERS, 2);


        const planningService = new PlanningService(competition);
        planningService.create(firstRoundNumber);
        planningService.reschedule(firstRoundNumber);

        const secondRoundNumber = firstRoundNumber.getNext();
        planningService.reschedule(secondRoundNumber);
        const games = planningService.getGamesForRoundNumber(secondRoundNumber, Game.ORDER_RESOURCEBATCH);

        expect(games.length).to.equal(2);
        // consoleGames(games);
        expect(games[0].getRound().getParentQualifyGroup().getWinnersOrLosers()).to.equal(QualifyGroup.LOSERS);

        assertValidResourcesPerBatch(secondRoundNumber.getGames());
        secondRoundNumber.getPlaces().forEach(place => {
            this.assertValidGamesParticipations(place, secondRoundNumber.getGames(), 1);
        });
    });



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

/**
 * check if every place has the same amount of games
 * check if one place is not two times in one game
 * for planning : add selfreferee if is this enables
 *
 * @param place
 * @param game
 */
export function assertValidGamesParticipations(place: Place, games: Game[], expectedValue?: number) {
    const sportPlanningConfigService = new SportPlanningConfigService();
    let nrOfGames = 0;
    games.forEach(game => {
        let nrOfSingleGameParticipations = 0;
        const places = game.getPlaces().map(gamePlace => gamePlace.getPlace());
        places.forEach(placeIt => {
            if (placeIt === place) {
                nrOfSingleGameParticipations++;
            }
        });
        if (nrOfSingleGameParticipations === 1) {
            nrOfGames++;
        }
        if (game.getRefereePlace() && game.getRefereePlace() === place) {
            nrOfSingleGameParticipations++;
        }
        expect(nrOfSingleGameParticipations).to.be.lessThan(2);
    });
    const config = place.getRound().getNumber().getValidPlanningConfig();
    // const nrOfGamesPerPlace = sportPlanningConfigService.getNrOfGamesPerPlace(place.getPoule(), config.getNrOfHeadtohead());
    // expect(nrOfGamesPerPlace).to.equal(nrOfGames);
    if (expectedValue !== undefined) {
        expect(expectedValue).to.equal(nrOfGames);
    }
}

export function assertGamesInRow(place: Place, games: Game[], maxInRow: number) {
    let nrOfGamesInRow = 0; let previousBatchNr = 1; let placeInBatch = false;
    games.forEach(game => {
        if (previousBatchNr === (game.getResourceBatch() - 1)) {
            previousBatchNr = game.getResourceBatch();
            if (placeInBatch) {
                nrOfGamesInRow++;
                expect(nrOfGamesInRow).to.be.lessThan(maxInRow + 1);
            } else {
                nrOfGamesInRow = 0;
            }
            placeInBatch = false;
        }
        if (placeInBatch) {
            return;
        }
        const places = game.getPlaces().map(gamePlace => gamePlace.getPlace());
        placeInBatch = places.some(placeIt => placeIt === place);
    });
    expect(nrOfGamesInRow).to.be.lessThan(maxInRow + 1);
}

/**
 * check if every batch has no double fields, referees or place
 *
 * @param games
 */
export function assertValidResourcesPerBatch(games: Game[]) {
    const batchResources = {};
    games.forEach(game => {
        if (batchResources[game.getResourceBatch()] === undefined) {
            batchResources[game.getResourceBatch()] = { fields: [], referees: [], places: [] };
        }
        const batchResource = batchResources[game.getResourceBatch()];
        const places = game.getPlaces().map(gamePlace => gamePlace.getPlace());
        if (game.getRefereePlace() !== undefined) {
            places.push(game.getRefereePlace());
        }
        places.forEach(placeIt => {
            expect(batchResource.places.find(place => place === placeIt)).to.equal(undefined);
            batchResource.places.push(placeIt);
        });
        expect(batchResource.fields.find(field => field === game.getField())).to.equal(undefined);
        batchResource.fields.push(game.getField());
        if (game.getReferee()) {
            expect(batchResource.referees.find(referee => referee === game.getReferee())).to.equal(undefined);
            batchResource.fields.push(game.getReferee());
        }
    });
}

export function consoleGames(games: Game[]) {
    const nameService = new NameService();
    games.forEach(game => {
        console.log(
            'poule ' + game.getPoule().getNumber()
            + ', ' + nameService.getPlacesFromName(game.getPlaces(Game.HOME), false, false)
            + ' vs ' + nameService.getPlacesFromName(game.getPlaces(Game.AWAY), false, false)
            + ' , ref ' + (game.getRefereePlace() ? nameService.getPlaceFromName(game.getRefereePlace(), false, false) : '')
            + ', batch ' + game.getResourceBatch()
            + ', field ' + game.getField().getNumber()
            + ', sport ' + game.getField().getSport().getName() + (game.getField().getSport().getCustomId() ?
                '(' + game.getField().getSport().getCustomId() + ')' : '')
        );
    });
}

export function addSport(competition: Competition) {
    const sportConfigService = new SportConfigService(new SportScoreConfigService(), new SportPlanningConfigService());
    const id = competition.getSportConfigs().length + 1;
    const sport = new Sport('sport' + id);
    sport.setId(id);
    sportConfigService.createDefault(sport, competition);
    return sport;
}
