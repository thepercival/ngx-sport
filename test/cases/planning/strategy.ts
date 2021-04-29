import { expect } from 'chai';
import { describe, it } from 'mocha';
import { AgainstSportVariant, AllInOneGameSportVariant, GameCreationStrategy, GameCreationStrategyCalculator, SingleSportVariant } from '../../../public_api';
import { GameMode } from '../../../src/planning/gameMode';
import { Sport } from '../../../src/sport';

describe('PlanningStrategy', () => {
    /*it('OnlySingle', () => {
        const sport = new Sport('dummy', false, GameMode.Against, 1);
        const singleSportVariant1 = new SingleSportVariant(sport, 3, 2);
        const singleSportVariant2 = new SingleSportVariant(sport, 3, 2);

        const calculator = new GameCreationStrategyCalculator();

        const strategy = calculator.calculate([singleSportVariant1, singleSportVariant2]);
        expect(strategy).to.equal(GameCreationStrategy.Incremental);
    });

    it('OnlyAllInOneGame', () => {
        const sport = new Sport('dummy', false, GameMode.Against, 1);
        const allInOneGameSportVariant1 = new AllInOneGameSportVariant(sport, 2);
        const allInOneGameSportVariant2 = new AllInOneGameSportVariant(sport, 2);

        const calculator = new GameCreationStrategyCalculator();

        const strategy = calculator.calculate([allInOneGameSportVariant1, allInOneGameSportVariant2]);
        expect(strategy).to.equal(GameCreationStrategy.Incremental);
    });

    it('OnlySingleAndAllInOneGame', () => {
        const sport = new Sport('dummy', false, GameMode.Against, 1);
        const singleSportVariant = new SingleSportVariant(sport, 3, 2);
        const allInOneGameSportVariant = new AllInOneGameSportVariant(sport, 2);

        const calculator = new GameCreationStrategyCalculator();

        const strategy = calculator.calculate([singleSportVariant, allInOneGameSportVariant]);
        expect(strategy).to.equal(GameCreationStrategy.Static);
    });*/

    it('Against', () => {
        const sport = new Sport('dummy', false, GameMode.Against, 1);
        const againstSportVariant = new AgainstSportVariant(sport, 1, 1, 2, 0);

        const calculator = new GameCreationStrategyCalculator();

        const strategy = calculator.calculate([againstSportVariant]);
        expect(strategy).to.equal(GameCreationStrategy.Static);
    });

    it('AgainstMixed', () => {
        const sport = new Sport('dummy', false, GameMode.Against, 1);
        const againstMixedSportVariant = new AgainstSportVariant(sport, 2, 2, 0, 2);

        const calculator = new GameCreationStrategyCalculator();

        const strategy = calculator.calculate([againstMixedSportVariant]);
        expect(strategy).to.equal(GameCreationStrategy.Static);
    });
});
