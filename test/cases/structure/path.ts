import { expect } from 'chai';
import { describe, it } from 'mocha';
import { QualifyTarget, StructurePathNode } from '../../../public-api';

describe('StructurePath', () => {

    it('getLevel', () => {
        const pathNode = new StructurePathNode(QualifyTarget.Dropouts, 1);

        const childPathNode = new StructurePathNode(QualifyTarget.Winners, 1, pathNode);

        const grandChildPathNode = new StructurePathNode(QualifyTarget.Winners, 1, childPathNode);

        expect(pathNode.getLevel()).to.equal(1);
        expect(childPathNode.getLevel()).to.equal(2);
        expect(grandChildPathNode.getLevel()).to.equal(3);
    });
});
