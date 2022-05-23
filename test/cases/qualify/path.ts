import { expect } from 'chai';
import { describe, it } from 'mocha';
import { QualifyTarget, QualifyPathNode } from '../../../public-api';

describe('QualifyPathNode', () => {

    it('getLevel', () => {
        const pathNode = new QualifyPathNode(QualifyTarget.Dropouts, 1);

        const childPathNode = new QualifyPathNode(QualifyTarget.Winners, 1, pathNode);

        const grandChildPathNode = new QualifyPathNode(QualifyTarget.Winners, 1, childPathNode);

        expect(pathNode.getLevel()).to.equal(1);
        expect(childPathNode.getLevel()).to.equal(2);
        expect(grandChildPathNode.getLevel()).to.equal(3);
    });
});
