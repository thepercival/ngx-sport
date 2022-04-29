import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('StructurePath', () => {

    it('test', () => {
        const piet = 'coeen';
        let ret = 'dus';
        ret += piet;

        expect(ret).to.equal('duscoeen');
    });
});

