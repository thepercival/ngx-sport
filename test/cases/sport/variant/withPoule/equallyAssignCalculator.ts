import { expect } from 'chai';
import { describe, it } from 'mocha';
import { AgainstGpp, EquallyAssignCalculator, GameMode, Sport } from '../../../../../public-api';

describe('EquallyAssignCalculator', () => {
    it('EqualAgainst4Places', () => {

        const calculator = new EquallyAssignCalculator();

        const againstGppVariants = [
            new AgainstGpp(new Sport('sport1', true, GameMode.Against, 2), 2, 2, 6),
            new AgainstGpp(new Sport('sport2', true, GameMode.Against, 2), 2, 2, 8),
            new AgainstGpp(new Sport('sport3', true, GameMode.Against, 2), 2, 2, 10),
        ];
        // 6 vs (4a2)
        // per game 4 versuses
        // 24 games is de eerste balanced
        // dat is 24 games per place

        expect(calculator.assignAgainstSportsEqually(4, againstGppVariants)).to.equal(true);
    });

    it('EqualAgainst5Places', () => {

        const calculator = new EquallyAssignCalculator();

        const againstGppVariants = [
            new AgainstGpp(new Sport('sport1', true, GameMode.Against, 2), 2, 2, 4),
            new AgainstGpp(new Sport('sport2', true, GameMode.Against, 2), 2, 2, 4),
            new AgainstGpp(new Sport('sport3', true, GameMode.Against, 2), 2, 2, 4),
            new AgainstGpp(new Sport('sport4', true, GameMode.Against, 2), 2, 2, 4),
        ];
        // 10 vs (5a2)
        // per game 2 with
        // 10 games is de eerste balanced
        // dat is 8 games per place

        expect(calculator.assignAgainstSportsEqually(5, againstGppVariants)).to.equal(true);
    });

    it('EqualAgainst5Places', () => {

        const calculator = new EquallyAssignCalculator();

        const againstGppVariants = [
            new AgainstGpp(new Sport('sport1', true, GameMode.Against, 2), 2, 2, 4),
            new AgainstGpp(new Sport('sport2', true, GameMode.Against, 2), 2, 2, 4),
        ];
        // 10 vs (5a2)
        // per game 2 with
        // 10 games is de eerste balanced
        // dat is 8 games per place

        expect(calculator.assignAgainstSportsEqually(4, againstGppVariants)).to.equal(true);
    });
});
