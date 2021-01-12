import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Association } from '../../public_api';

describe('Assocation', () => {
    it('Inheritance', () => {
        const fifa = new Association('FIFA');
        const uefa = new Association('UEFA', fifa);
        const knvb = new Association('KNVB', uefa);
        expect(knvb.getAncestors().length).to.equal(2);
        expect(uefa.getAncestors().length).to.equal(1);
        expect(fifa.getAncestors().length).to.equal(0);
    });
});
