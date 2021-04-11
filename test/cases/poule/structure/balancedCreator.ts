import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BalancedPouleStructureCreator } from '../../../../src/poule/structure/balancedCreator';

describe('BalancedPouleStructureCreator', () => {
    it('11 places and 2 poules', () => {
        const creator = new BalancedPouleStructureCreator();
        const structure = creator.create(11, 2);
        expect(structure.getNrOfPlaces()).to.equal(11);
        expect(structure.getNrOfPoules()).to.equal(2);
        expect(structure.getBiggestPoule()).to.equal(6);
        expect(structure.getSmallestPoule()).to.equal(5);
    });

    it('11 places and 3 poules', () => {
        const creator = new BalancedPouleStructureCreator();
        const structure = creator.create(11, 3);
        expect(structure.getNrOfPlaces()).to.equal(11);
        expect(structure.getNrOfPoules()).to.equal(3);
        expect(structure.getBiggestPoule()).to.equal(4);
        expect(structure.getSmallestPoule()).to.equal(3);
    });
});
