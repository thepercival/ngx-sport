import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Association } from '../../public-api';

describe('CDK', () => {

    it('horizontal ranked no single rule', () => {
        const a = new Association('aaa');
        expect(true).to.not.equal(false);
    });
});